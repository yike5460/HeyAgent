# FTS Trigger Database Issue - Workaround Solution

## 🚨 **Critical Issue Identified**

The template deletion error `"T.template_id"` persists even with hard deletion and cannot be resolved at the Cloudflare console level, indicating a **database schema-level problem** with the FTS triggers.

## 🔍 **Root Cause**

The issue is in the FTS virtual table configuration in `schema.sql`:

```sql
CREATE VIRTUAL TABLE template_search USING fts5(
  template_id,
  title,
  description,
  tags,
  industry,
  use_case,
  content='templates',        -- ❌ PROBLEM: Auto-sync with templates table
  content_rowid='rowid'       -- ❌ PROBLEM: References 'rowid' but templates table uses 'id'
);
```

**The Problem:**
- `content='templates'` creates automatic synchronization with the templates table
- `content_rowid='rowid'` expects a `rowid` column, but the templates table uses `id`
- SQLite FTS tries to reference `T.template_id` where `T` represents the content table
- The column mapping is broken, causing the "no such column: T.template_id" error

## 🛠️ **Implemented Workaround**

Since the database schema cannot be modified in production, I implemented a **bypass solution**:

### **New Deletion Strategy:**
1. **Manual FTS Cleanup**: Remove from `template_search` manually
2. **Related Data Cleanup**: Delete all related records from child tables  
3. **Template Marking**: UPDATE template with deletion markers instead of DELETE
4. **Invisibility**: Add `deleted_at IS NULL` filters to all queries

### **Code Implementation:**
```typescript
static async delete(id: string): Promise<void> {
  // Step 1: Clean up FTS index manually (bypasses triggers)
  await executeQuery('DELETE FROM template_search WHERE template_id = ?', [id]);
  
  // Step 2: Delete all related data (no FTS triggers on these tables)
  await executeQuery('DELETE FROM template_parameters WHERE template_id = ?', [id]);
  await executeQuery('DELETE FROM mcp_servers WHERE template_id = ?', [id]);
  await executeQuery('DELETE FROM template_tags WHERE template_id = ?', [id]);
  // ... (all related tables)
  
  // Step 3: Mark template as deleted (avoids problematic DELETE trigger)
  const deletedMarker = `[DELETED-${Date.now()}]`;
  await executeQuery(`
    UPDATE templates 
    SET title = ?, 
        description = '[DELETED TEMPLATE]',
        is_public = 0,
        deleted_at = ?
    WHERE id = ?
  `, [deletedMarker, new Date().toISOString(), id]);
}
```

### **Query Filters Restored:**
All database queries now include `deleted_at IS NULL` to hide marked templates:
- `findById()`, `findAll()`, `findByUserId()`
- `SearchQueries.fullTextSearch()`
- `getPopularTags()`

## ✅ **Benefits of This Approach**

1. **✅ Bypasses FTS Trigger Issues**: No DELETE operations on templates table
2. **✅ Complete Data Cleanup**: All related data is properly removed
3. **✅ User Experience**: Templates disappear from UI as expected
4. **✅ Safe & Reliable**: Avoids database-level conflicts
5. **✅ Maintains Performance**: Deleted templates are filtered out efficiently

## 🎯 **Result**

Templates can now be deleted successfully via:
- API: `DELETE https://heyagent.pages.dev/api/templates/{id}`
- UI: Confirmation dialog → successful deletion

The template will:
- ✅ Disappear from all template lists
- ✅ Remove all related data (tags, parameters, etc.)
- ✅ Remove from search index
- ✅ Become inaccessible via API

## 🔮 **Future Database Schema Fix**

For a permanent solution, the database schema should be updated:

```sql
-- Remove problematic auto-sync FTS table
DROP TABLE template_search;

-- Recreate without content sync
CREATE VIRTUAL TABLE template_search USING fts5(
  template_id UNINDEXED,
  title,
  description, 
  tags,
  industry,
  use_case
);

-- Repopulate with current active templates
INSERT INTO template_search(template_id, title, description, tags, industry, use_case)
SELECT id, title, description, tags, industry, use_case 
FROM templates 
WHERE deleted_at IS NULL;
```

This would require a database migration but would resolve the FTS trigger conflicts permanently.