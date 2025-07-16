# HeyAgent Database Schema Summary

## Overview
The HeyAgent platform uses a comprehensive relational database schema built on Cloudflare D1 (SQLite) to support AI template management, user collaboration, and analytics.

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
- **template_search**: Full-text search virtual table (FTS5)

## Key Features
- **Multi-industry Support**: 8 industry verticals with specialized templates
- **Version Control**: Complete template history with snapshots
- **Social Features**: Ratings, reviews, favorites, and forking
- **Full-text Search**: SQLite FTS5 for advanced template discovery
- **MCP Integration**: Seamless Model Context Protocol server management
- **Analytics**: Comprehensive usage tracking and metrics

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
        string version
        string status
        string user_id FK
        real rating
        integer usage_count
        integer fork_count
        text prompt_config "JSON"
        text agent_config "JSON"
        text execution_environment "JSON"
        text metadata "JSON"
        text tags "JSON"
        boolean is_public
        boolean is_featured
        datetime created_at
        datetime updated_at
    }
    
    template_parameters {
        string id PK
        string template_id FK
        string name
        string type
        string description
        string default_value
        boolean required
        text options "JSON"
        text validation_rules "JSON"
        integer display_order
    }
    
    mcp_servers {
        string id PK
        string template_id FK
        string name
        string command
        text args "JSON"
        text env_vars "JSON"
        text config "JSON"
        boolean enabled
    }
    
    template_tags {
        string id PK
        string template_id FK
        string tag
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
    }
    
    template_versions {
        string id PK
        string template_id FK
        string version
        string title
        text prompt_config "JSON"
        text agent_config "JSON"
        text execution_environment "JSON"
        text metadata "JSON"
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
    }
    
    collection_items {
        string id PK
        string collection_id FK
        string template_id FK
        integer display_order
    }
    
    template_usage {
        string id PK
        string template_id FK
        string user_id FK
        string usage_type
        text metadata "JSON"
        string ip_address
        datetime created_at
    }
    
    template_search {
        string template_id FK
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
- **FTS5**: Full-text search with automatic triggers for real-time updates
- **JSON Columns**: Flexible schema for complex configurations
- **Cascade Deletes**: Proper cleanup of related records
- **Unique Constraints**: Data integrity for critical relationships