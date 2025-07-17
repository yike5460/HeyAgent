# HeyPrompt Database Schema Summary

## Overview
The HeyPrompt platform uses a comprehensive relational database schema built on Cloudflare D1 (SQLite) to support AI template management, user collaboration, and analytics. The schema has been refactored to use hard deletion and resolve FTS trigger conflicts.

## Core Entities

### User Management
- **users**: Core user profiles with OAuth authentication
- **user_favorites**: User bookmarks for templates

### Template System
- **templates**: Main template entities with JSON configurations
- **template_parameters**: Dynamic parameters for template customization
- **template_versions**: Version history and snapshots
- **template_forks**: Fork relationships between templates
- **template_tags**: Many-to-many tag associations
- **template_ratings**: User reviews and ratings

### MCP Integration
- **mcp_servers**: Model Context Protocol server configurations per template

### Collections & Organization
- **template_collections**: User-created template playlists
- **collection_items**: Many-to-many collection membership
- **industries**: Reference data for industry categorization

### Analytics & Search
- **template_usage**: Usage tracking and analytics
- **template_search**: Full-text search virtual table (FTS5) with fixed configuration

## Key Features
- **Multi-industry Support**: 8 industry verticals with specialized templates
- **Version Control**: Complete template history with snapshots
- **Social Features**: Ratings, reviews, favorites, and forking
- **Full-text Search**: SQLite FTS5 with fixed configuration for reliable template discovery
- **MCP Integration**: Seamless Model Context Protocol server management
- **Analytics**: Comprehensive usage tracking and metrics
- **Hard Deletion**: True deletion with CASCADE cleanup for data integrity

## Table Relationships Diagram

```mermaid
erDiagram
    users ||--o{ templates : creates
    users ||--o{ user_favorites : bookmarks
    users ||--o{ template_ratings : rates
    users ||--o{ template_collections : owns
    users ||--o{ template_forks : forks
    users ||--o{ template_usage : uses
    users ||--o{ template_versions : creates_version
    
    templates ||--o{ template_parameters : has
    templates ||--o{ mcp_servers : configures
    templates ||--o{ template_tags : tagged_with
    templates ||--o{ template_forks : forked_from
    templates ||--o{ template_forks : forked_to
    templates ||--o{ user_favorites : favorited_by
    templates ||--o{ template_ratings : rated_by
    templates ||--o{ template_versions : versioned_as
    templates ||--o{ template_usage : tracked_in
    templates ||--o{ collection_items : included_in
    templates ||--|| template_search : indexed_in
    
    template_collections ||--o{ collection_items : contains
    
    industries ||--o{ templates : categorizes
    
    users {
        string id PK
        string email UK
        string name
        string avatar_url
        string bio
        string company
        string location
        string website
        string github_username
        string twitter_username
        string linkedin_username
        string oauth_provider
        string oauth_provider_id
        datetime created_at
        datetime updated_at
    }
    
    templates {
        string id PK
        string title
        string description
        string industry FK
        string use_case
        string version
        string status
        string user_id FK
        string author_name
        real rating
        integer usage_count
        integer fork_count
        string license
        text prompt_config
        text agent_config
        text execution_environment
        text metadata
        text tags
        boolean is_public
        boolean is_featured
        datetime created_at
        datetime updated_at
        datetime published_at
    }
    
    template_parameters {
        string id PK
        string template_id FK
        string name
        string type
        string description
        string default_value
        boolean required
        text options
        text validation_rules
        integer display_order
        datetime created_at
    }
    
    mcp_servers {
        string id PK
        string template_id FK
        string name
        string description
        string command
        text args
        text env_vars
        text config
        boolean enabled
        datetime created_at
    }
    
    template_tags {
        string id PK
        string template_id FK
        string tag
        datetime created_at
    }
    
    template_forks {
        string id PK
        string original_template_id FK
        string forked_template_id FK
        string user_id FK
        datetime created_at
    }
    
    user_favorites {
        string id PK
        string user_id FK
        string template_id FK
        datetime created_at
    }
    
    template_ratings {
        string id PK
        string template_id FK
        string user_id FK
        integer rating
        text review
        datetime created_at
        datetime updated_at
    }
    
    template_versions {
        string id PK
        string template_id FK
        string version
        string title
        string description
        text prompt_config
        text agent_config
        text execution_environment
        text metadata
        text tags
        string created_by FK
        datetime created_at
    }
    
    template_collections {
        string id PK
        string user_id FK
        string name
        string description
        boolean is_public
        datetime created_at
        datetime updated_at
    }
    
    collection_items {
        string id PK
        string collection_id FK
        string template_id FK
        integer display_order
        datetime created_at
    }
    
    template_usage {
        string id PK
        string template_id FK
        string user_id FK
        string usage_type
        text metadata
        string ip_address
        string user_agent
        datetime created_at
    }
    
    template_search {
        string template_id
        string title
        string description
        string tags
        string industry
        string use_case
    }
    
    industries {
        string id PK
        string name UK
        string description
        string icon
        integer display_order
        boolean active
    }
```

## JSON Column Structures

### templates.prompt_config
```json
{
  "systemPrompt": "string",
  "userPromptTemplate": "string", 
  "parameters": ["array of parameter names"]
}
```

### templates.agent_config
```json
{
  "orchestration": "object",
  "monitoring": "object"
}
```

### templates.execution_environment
```json
{
  "infrastructure": "requirements object",
  "dependencies": ["array"],
  "resources": "object"
}
```

### templates.metadata
```json
{
  "category": "string",
  "complexity": "string",
  "dependencies": ["array"],
  "estimatedCost": "number"
}
```

## Performance Optimizations
- **Indexes**: Strategic indexes on foreign keys, status fields, and search columns
- **FTS5**: Full-text search with fixed configuration and manual triggers for reliable updates
- **JSON Columns**: Flexible schema for complex configurations
- **CASCADE Deletes**: Automatic cleanup of related records with true hard deletion
- **Unique Constraints**: Data integrity for critical relationships

## Recent Schema Refactoring (2025-07-17)

### Changes Made:
- **Removed Soft Deletion**: Eliminated all `deleted_at` columns for true hard deletion
- **Fixed FTS Configuration**: Removed problematic `content='templates'` and `content_rowid='rowid'` settings
- **Simplified Triggers**: Manual FTS maintenance to avoid auto-sync conflicts
- **Enhanced Cascade**: Proper foreign key relationships with CASCADE cleanup

### Benefits:
- **✅ Resolved FTS Errors**: No more "T.template_id" column reference conflicts
- **✅ Simplified Queries**: Removed `WHERE deleted_at IS NULL` filters
- **✅ Better Performance**: Fewer query conditions and cleaner database
- **✅ True Deletion**: Complete removal of templates and related data