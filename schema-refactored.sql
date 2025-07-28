-- HeyPrompt Platform Database Schema for Cloudflare D1 (Refactored)
-- This schema removes soft deletion and fixes FTS trigger conflicts

-- Users table for authentication and profiles
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  company TEXT,
  location TEXT,
  website TEXT,
  github_username TEXT,
  twitter_username TEXT,
  linkedin_username TEXT,
  oauth_provider TEXT NOT NULL, -- 'github', 'google'
  oauth_provider_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index for OAuth provider combination
CREATE UNIQUE INDEX idx_users_oauth ON users(oauth_provider, oauth_provider_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Main templates table (removed deleted_at for hard deletion)
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  industry TEXT NOT NULL, -- 'Media & Entertainment', 'Healthcare & Life Science', etc.
  use_case TEXT,
  version TEXT DEFAULT '1.0.0',
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  user_id TEXT NOT NULL,
  author_name TEXT,
  usage_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,
  license TEXT DEFAULT 'MIT', -- 'MIT', 'Apache-2.0', 'GPL-3.0', 'Custom', 'Proprietary'
  
  -- JSON configurations
  prompt_config TEXT, -- JSON: {systemPrompt, userPromptTemplate, parameters}
  agent_config TEXT, -- JSON: orchestration and monitoring config
  execution_environment TEXT, -- JSON: infrastructure requirements
  metadata TEXT, -- JSON: category, complexity, dependencies, etc.
  
  -- Search and discovery
  tags TEXT, -- JSON array of tags
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for templates
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_status ON templates(status);
CREATE INDEX idx_templates_industry ON templates(industry);
CREATE INDEX idx_templates_public ON templates(is_public);
CREATE INDEX idx_templates_featured ON templates(is_featured);
CREATE INDEX idx_templates_created_at ON templates(created_at);
CREATE INDEX idx_templates_usage_count ON templates(usage_count);

-- Template parameters for dynamic prompts
CREATE TABLE template_parameters (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'string', 'number', 'boolean', 'select', 'multiselect'
  description TEXT,
  default_value TEXT,
  required BOOLEAN DEFAULT false,
  options TEXT, -- JSON array for select/multiselect types
  validation_rules TEXT, -- JSON: min, max, pattern, etc.
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE INDEX idx_template_parameters_template_id ON template_parameters(template_id);
CREATE INDEX idx_template_parameters_order ON template_parameters(template_id, display_order);

-- MCP server configurations
CREATE TABLE mcp_servers (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  command TEXT NOT NULL,
  args TEXT, -- JSON array of command arguments
  env_vars TEXT, -- JSON object of environment variables
  config TEXT, -- JSON configuration specific to the MCP server
  enabled BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE INDEX idx_mcp_servers_template_id ON mcp_servers(template_id);
CREATE INDEX idx_mcp_servers_enabled ON mcp_servers(enabled);

-- Template tags (many-to-many relationship)
CREATE TABLE template_tags (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_template_tags_unique ON template_tags(template_id, tag);
CREATE INDEX idx_template_tags_tag ON template_tags(tag);

-- Template forking relationships
CREATE TABLE template_forks (
  id TEXT PRIMARY KEY,
  original_template_id TEXT NOT NULL,
  forked_template_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (original_template_id) REFERENCES templates(id),
  FOREIGN KEY (forked_template_id) REFERENCES templates(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_template_forks_original ON template_forks(original_template_id);
CREATE INDEX idx_template_forks_forked ON template_forks(forked_template_id);
CREATE INDEX idx_template_forks_user ON template_forks(user_id);

-- User favorites
CREATE TABLE user_favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_user_favorites_unique ON user_favorites(user_id, template_id);
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_template ON user_favorites(template_id);


-- Template version history
CREATE TABLE template_versions (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  prompt_config TEXT, -- JSON snapshot
  agent_config TEXT, -- JSON snapshot
  execution_environment TEXT, -- JSON snapshot
  metadata TEXT, -- JSON snapshot
  tags TEXT, -- JSON array snapshot
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_template_versions_template_id ON template_versions(template_id);
CREATE INDEX idx_template_versions_version ON template_versions(template_id, version);
CREATE INDEX idx_template_versions_created_at ON template_versions(created_at);

-- Template usage analytics
CREATE TABLE template_usage (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  user_id TEXT,
  usage_type TEXT NOT NULL, -- 'view', 'clone', 'fork', 'download', 'execute'
  metadata TEXT, -- JSON: additional context
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_template_usage_template_id ON template_usage(template_id);
CREATE INDEX idx_template_usage_user_id ON template_usage(user_id);
CREATE INDEX idx_template_usage_type ON template_usage(usage_type);
CREATE INDEX idx_template_usage_created_at ON template_usage(created_at);

-- Template collections/playlists
CREATE TABLE template_collections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_template_collections_user_id ON template_collections(user_id);
CREATE INDEX idx_template_collections_public ON template_collections(is_public);

-- Collection items (many-to-many)
CREATE TABLE collection_items (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (collection_id) REFERENCES template_collections(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_collection_items_unique ON collection_items(collection_id, template_id);
CREATE INDEX idx_collection_items_collection ON collection_items(collection_id);
CREATE INDEX idx_collection_items_template ON collection_items(template_id);

-- Full-text search support (virtual table for SQLite FTS)
-- FIXED: Removed problematic content='templates' and content_rowid='rowid' settings
-- These caused the "T.template_id" column reference errors
CREATE VIRTUAL TABLE template_search USING fts5(
  template_id UNINDEXED,
  title,
  description,
  tags,
  industry,
  use_case
);

-- Simplified triggers that manually maintain the FTS table
-- This avoids the automatic sync issues that caused database conflicts
CREATE TRIGGER templates_search_insert AFTER INSERT ON templates BEGIN
  INSERT INTO template_search(template_id, title, description, tags, industry, use_case)
  VALUES (NEW.id, NEW.title, NEW.description, NEW.tags, NEW.industry, NEW.use_case);
END;

CREATE TRIGGER templates_search_update AFTER UPDATE ON templates BEGIN
  DELETE FROM template_search WHERE template_id = NEW.id;
  INSERT INTO template_search(template_id, title, description, tags, industry, use_case)
  VALUES (NEW.id, NEW.title, NEW.description, NEW.tags, NEW.industry, NEW.use_case);
END;

CREATE TRIGGER templates_search_delete AFTER DELETE ON templates BEGIN
  DELETE FROM template_search WHERE template_id = OLD.id;
END;

-- Industry categories reference table
CREATE TABLE industries (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

INSERT INTO industries (id, name, description, display_order) VALUES
  ('media-entertainment', 'Media & Entertainment', 'Content creation, streaming, gaming, and digital media', 1),
  ('healthcare-life-science', 'Healthcare & Life Science', 'Medical research, diagnostics, patient care, and biotechnology', 2),
  ('retail', 'Retail', 'E-commerce, inventory management, customer service, and sales', 3),
  ('manufacturing', 'Manufacturing', 'Production optimization, quality control, and supply chain', 4),
  ('automotive', 'Automotive', 'Vehicle design, autonomous systems, and transportation', 5),
  ('financial-services', 'Financial Services', 'Banking, insurance, investment, and fintech', 6),
  ('gaming', 'Gaming', 'Game development, player analytics, and interactive entertainment', 7),
  ('cross-industry', 'Cross Industry', 'General purpose solutions applicable across multiple sectors', 8);

-- Create indexes for performance
CREATE INDEX idx_industries_active ON industries(active);
CREATE INDEX idx_industries_order ON industries(display_order);