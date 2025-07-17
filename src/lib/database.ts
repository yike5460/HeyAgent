import type { PromptTemplate, User, SearchFilters, SortOptions } from '@/types';

// Database connection utility for Cloudflare D1
export function getDatabase(env?: any) {
  // In production, this will be injected by Cloudflare Workers/Pages
  // For development, you might use a local D1 database
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Development database connection - return mock or local D1
    console.warn('Using development database - make sure to set up local D1');
    return null; // Skip database operations in development
  }
  
  // Try multiple ways to access the D1 binding in Cloudflare environment
  let db = null;
  
  // Method 1: From env parameter (Cloudflare Pages Functions)
  if (env?.PROD_DB) {
    db = env.PROD_DB;
  } else if (env?.DB) {
    db = env.DB;
  }
  // Method 2: From global context (Cloudflare Workers)
  else if ((globalThis as any).PROD_DB) {
    db = (globalThis as any).PROD_DB;
  } else if ((globalThis as any).DB) {
    db = (globalThis as any).DB;
  }
  // Method 3: From process.env for Pages Functions  
  else if ((process as any)?.env?.PROD_DB) {
    db = (process as any).env.PROD_DB;
  }
  // Method 4: Check if we're in Cloudflare Edge Runtime
  else if (typeof (globalThis as any).EdgeRuntime !== 'undefined' && (globalThis as any).PROD_DB) {
    db = (globalThis as any).PROD_DB;
  }
  // Method 5: Try to access bindings from Cloudflare's injected globals in Pages
  else {
    // In Cloudflare Pages, bindings are injected as globals during runtime
    try {
      // This will be set by Cloudflare Pages runtime
      const cfEnv = (globalThis as any)?.__CF_ENV__ || (globalThis as any)?.__env__;
      if (cfEnv?.PROD_DB) {
        db = cfEnv.PROD_DB;
      }
    } catch (e) {
      // Ignore errors accessing __CF_ENV__
    }
  }
  
  // Last resort: try direct global access (Cloudflare injects bindings globally)
  if (!db && typeof globalThis !== 'undefined') {
    // Cloudflare Pages may inject D1 bindings directly into global scope
    const possibleNames = ['PROD_DB', 'DB', 'D1_DATABASE'];
    for (const name of possibleNames) {
      if ((globalThis as any)[name]) {
        db = (globalThis as any)[name];
        break;
      }
    }
  }
  
  if (!db) {
    console.error('Database binding not found. Available env keys:', env ? Object.keys(env) : 'no env provided');
    console.error('Global keys containing DB:', typeof globalThis !== 'undefined' ? 
      Object.keys(globalThis).filter(k => k.toLowerCase().includes('db') || k.includes('PROD')) : 'no globalThis');
    
    // In development, return null instead of throwing
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('Database not available in development - returning null');
      return null;
    }
    
    throw new Error('Database not available. Make sure D1 binding is configured.');
  }
  
  return db;
}

// Raw SQL query helper for complex operations
export async function executeQuery<T = any>(query: string, params: any[] = [], env?: any): Promise<T[]> {
  const db = getDatabase(env);
  if (!db) {
    // Return empty results in development
    return [];
  }
  const stmt = db.prepare(query);
  const result = await stmt.bind(...params).all();
  return result.results as T[];
}

// User management queries
export class UserQueries {
  static async findByEmail(email: string): Promise<User | null> {
    const result = await executeQuery(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1',
      [email]
    );
    if (!result[0]) return null;
    
    // Map database fields to User interface
    return this.mapDbToUser(result[0]);
  }

  static async findByOAuth(provider: string, providerId: string): Promise<User | null> {
    const result = await executeQuery(
      'SELECT * FROM users WHERE oauth_provider = ? AND oauth_provider_id = ? AND deleted_at IS NULL LIMIT 1',
      [provider, providerId]
    );
    if (!result[0]) return null;
    
    return this.mapDbToUser(result[0]);
  }

  static async create(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date().toISOString();
    
    // Map User interface to database fields
    await executeQuery(
      `INSERT INTO users (
        id, email, name, avatar_url, bio, company, location, website,
        github_username, twitter_username, linkedin_username,
        oauth_provider, oauth_provider_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.id, 
        userData.email, 
        userData.displayName, 
        userData.profile?.avatar,
        userData.profile?.bio, 
        userData.profile?.company, 
        userData.profile?.location, 
        userData.profile?.website,
        userData.profile?.socialLinks?.github, 
        userData.profile?.socialLinks?.twitter, 
        userData.profile?.socialLinks?.linkedin,
        'oauth', // Default provider type
        userData.cognitoId, 
        now, 
        now
      ]
    );
    
    return { 
      ...userData, 
      createdAt: now, 
      updatedAt: now 
    };
  }

  static async update(id: string, updates: Partial<User>): Promise<void> {
    const now = new Date().toISOString();
    const dbUpdates: any = {};
    
    // Map User interface updates to database fields
    if (updates.displayName !== undefined) dbUpdates.name = updates.displayName;
    if (updates.profile?.avatar !== undefined) dbUpdates.avatar_url = updates.profile.avatar;
    if (updates.profile?.bio !== undefined) dbUpdates.bio = updates.profile.bio;
    if (updates.profile?.company !== undefined) dbUpdates.company = updates.profile.company;
    if (updates.profile?.location !== undefined) dbUpdates.location = updates.profile.location;
    if (updates.profile?.website !== undefined) dbUpdates.website = updates.profile.website;
    if (updates.profile?.socialLinks?.github !== undefined) dbUpdates.github_username = updates.profile.socialLinks.github;
    if (updates.profile?.socialLinks?.twitter !== undefined) dbUpdates.twitter_username = updates.profile.socialLinks.twitter;
    if (updates.profile?.socialLinks?.linkedin !== undefined) dbUpdates.linkedin_username = updates.profile.socialLinks.linkedin;
    
    const fields = Object.keys(dbUpdates).map(key => `${key} = ?`);
    const values = Object.values(dbUpdates);
    
    if (fields.length === 0) return;

    await executeQuery(
      `UPDATE users SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
      [...values, now, id]
    );
  }

  static async createOrUpdate(userData: {
    id: string;
    email: string;
    name: string;
    image?: string;
    provider: string;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
  }): Promise<User> {
    try {
      // Try to find existing user
      const existing = await this.findByEmail(userData.email);
      
      if (existing) {
        // Update existing user
        await executeQuery(
          `UPDATE users SET 
            name = ?, 
            avatar_url = ?, 
            oauth_provider = ?, 
            updated_at = ?
          WHERE email = ?`,
          [userData.name, userData.image || '', userData.provider, userData.updatedAt, userData.email]
        );
        return existing;
      } else {
        // Create new user
        await executeQuery(
          `INSERT INTO users (
            id, email, name, avatar_url, oauth_provider, oauth_provider_id, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userData.id,
            userData.email,
            userData.name,
            userData.image || '',
            userData.provider,
            userData.id, // Use id as provider id for now
            userData.createdAt,
            userData.updatedAt
          ]
        );
        
        // Return the created user
        const newUser = await this.findByEmail(userData.email);
        if (!newUser) {
          throw new Error('Failed to create user');
        }
        return newUser;
      }
    } catch (error) {
      console.error('Error in createOrUpdate:', error);
      throw error;
    }
  }

  // Helper method to map database row to User interface
  private static mapDbToUser(dbRow: any): User {
    return {
      id: dbRow.id,
      email: dbRow.email,
      username: dbRow.name || dbRow.email.split('@')[0],
      displayName: dbRow.name,
      profile: {
        avatar: dbRow.avatar_url,
        bio: dbRow.bio,
        company: dbRow.company,
        location: dbRow.location,
        website: dbRow.website,
        socialLinks: {
          github: dbRow.github_username,
          twitter: dbRow.twitter_username,
          linkedin: dbRow.linkedin_username
        }
      },
      roles: [
        {
          role: 'creator',
          scope: 'global'
        }
      ],
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at,
      cognitoId: dbRow.oauth_provider_id
    };
  }
}

// Template management queries
export class TemplateQueries {
  // Basic template lookup without enrichment for operations like delete
  static async findBasicById(id: string): Promise<any | null> {
    const templates = await executeQuery(
      'SELECT id, user_id, title, status FROM templates WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    
    return templates[0] || null;
  }

  static async findById(id: string): Promise<PromptTemplate | null> {
    const templates = await executeQuery(
      `SELECT t.*, u.name as author_name 
       FROM templates t 
       LEFT JOIN users u ON t.user_id = u.id 
       WHERE t.id = ? AND t.deleted_at IS NULL`,
      [id]
    );
    
    if (!templates[0]) return null;

    return await this.enrichTemplate(templates[0]);
  }

  static async findAll(filters: SearchFilters = {}, sort: SortOptions = { field: 'createdAt', direction: 'desc' }, limit = 50, offset = 0): Promise<PromptTemplate[]> {
    let query = `
      SELECT t.*, u.name as author_name 
      FROM templates t 
      LEFT JOIN users u ON t.user_id = u.id 
      WHERE t.deleted_at IS NULL AND t.is_public = 1
    `;
    const params: any[] = [];

    // Apply filters
    if (filters.industry?.length) {
      query += ` AND t.industry IN (${filters.industry.map(() => '?').join(',')})`;
      params.push(...filters.industry);
    }

    if (filters.tags?.length) {
      // Use JSON_EXTRACT for tag filtering in SQLite
      const tagConditions = filters.tags.map(() => `JSON_EXTRACT(t.tags, '$') LIKE ?`).join(' OR ');
      query += ` AND (${tagConditions})`;
      params.push(...filters.tags.map(tag => `%"${tag}"%`));
    }

    if (filters.rating) {
      query += ` AND t.rating >= ?`;
      params.push(filters.rating);
    }

    if (filters.license?.length) {
      query += ` AND t.license IN (${filters.license.map(() => '?').join(',')})`;
      params.push(...filters.license);
    }

    if (filters.search) {
      query += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    // Apply sorting
    const sortField = sort.field === 'createdAt' ? 't.created_at' : 
                     sort.field === 'rating' ? 't.rating' : 
                     sort.field === 'usageCount' ? 't.usage_count' :
                     't.created_at';
    query += ` ORDER BY ${sortField} ${sort.direction?.toUpperCase() || 'DESC'}`;

    // Apply pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const templates = await executeQuery(query, params);
    return Promise.all(templates.map(t => this.enrichTemplate(t)));
  }

  static async findByUserId(userId: string): Promise<PromptTemplate[]> {
    const templates = await executeQuery(
      `SELECT t.*, u.name as author_name 
       FROM templates t 
       LEFT JOIN users u ON t.user_id = u.id 
       WHERE t.user_id = ? AND t.deleted_at IS NULL 
       ORDER BY t.created_at DESC`,
      [userId]
    );
    
    return Promise.all(templates.map(t => this.enrichTemplate(t)));
  }

  static async create(template: Omit<PromptTemplate, 'createdAt' | 'updatedAt' | 'rating' | 'usageCount' | 'forkCount'>): Promise<PromptTemplate> {
    const now = new Date().toISOString();
    
    // Insert main template
    await executeQuery(
      `INSERT INTO templates (
        id, title, description, industry, use_case, version, status, user_id,
        prompt_config, agent_config, execution_environment, metadata, tags,
        license, is_public, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        template.id, template.title, template.description, template.industry,
        template.useCase, template.version, template.status, template.userId,
        JSON.stringify(template.promptConfig), JSON.stringify(template.agentConfig),
        JSON.stringify(template.executionEnvironment), JSON.stringify(template.metadata),
        JSON.stringify(template.tags), template.license, template.isPublic ? 1 : 0,
        now, now
      ]
    );

    // Insert MCP servers
    if (template.mcpServers?.length) {
      for (const mcpServer of template.mcpServers) {
        await executeQuery(
          `INSERT INTO mcp_servers (id, template_id, name, description, command, args, env_vars, config, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `${template.id}_${mcpServer.serverId}`, template.id, mcpServer.serverId,
            'MCP Server Configuration', 'npx', JSON.stringify(['@modelcontextprotocol/server-firecrawl']),
            JSON.stringify({ FIRECRAWL_API_KEY: 'your-api-key' }), JSON.stringify(mcpServer.configuration || {}), now
          ]
        );
      }
    }

    // Insert tags
    if (template.tags?.length) {
      for (const tag of template.tags) {
        await executeQuery(
          `INSERT INTO template_tags (id, template_id, tag, created_at) VALUES (?, ?, ?, ?)`,
          [`${template.id}_${tag}`, template.id, tag, now]
        );
      }
    }

    const created = await this.findById(template.id);
    if (!created) throw new Error('Failed to create template');
    return created;
  }

  static async update(id: string, updates: Partial<PromptTemplate>): Promise<void> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    // Handle simple fields
    const simpleFields: (keyof PromptTemplate)[] = ['title', 'description', 'industry', 'useCase', 'version', 'status', 'license'];
    simpleFields.forEach(field => {
      if (updates[field] !== undefined) {
        const dbField = field === 'useCase' ? 'use_case' : field;
        fields.push(`${dbField} = ?`);
        values.push(updates[field] as any);
      }
    });

    // Handle JSON fields
    if (updates.promptConfig) {
      fields.push('prompt_config = ?');
      values.push(JSON.stringify(updates.promptConfig));
    }
    if (updates.agentConfig) {
      fields.push('agent_config = ?');
      values.push(JSON.stringify(updates.agentConfig));
    }
    if (updates.executionEnvironment) {
      fields.push('execution_environment = ?');
      values.push(JSON.stringify(updates.executionEnvironment));
    }
    if (updates.metadata) {
      fields.push('metadata = ?');
      values.push(JSON.stringify(updates.metadata));
    }
    if (updates.tags) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updates.tags));
    }

    if (fields.length === 0) return;

    // Update main template
    await executeQuery(
      `UPDATE templates SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
      [...values, now, id]
    );

    // Update MCP servers if provided
    if (updates.mcpServers) {
      // Delete existing MCP servers
      await executeQuery('DELETE FROM mcp_servers WHERE template_id = ?', [id]);
      
      // Insert updated MCP servers
      for (const mcpServer of updates.mcpServers) {
        await executeQuery(
          `INSERT INTO mcp_servers (id, template_id, name, description, command, args, env_vars, config, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `${id}_${mcpServer.serverId}`, id, mcpServer.serverId,
            'MCP Server Configuration', 'npx', JSON.stringify(['@modelcontextprotocol/server-firecrawl']),
            JSON.stringify({ FIRECRAWL_API_KEY: 'your-api-key' }), JSON.stringify(mcpServer.configuration || {}), now
          ]
        );
      }
    }

    // Update tags if provided
    if (updates.tags) {
      // Delete existing tags
      await executeQuery('DELETE FROM template_tags WHERE template_id = ?', [id]);
      
      // Insert updated tags
      for (const tag of updates.tags) {
        await executeQuery(
          `INSERT INTO template_tags (id, template_id, tag, created_at) VALUES (?, ?, ?, ?)`,
          [`${id}_${tag}`, id, tag, now]
        );
      }
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Perform soft delete directly - let the database handle the validation
      await executeQuery(
        'UPDATE templates SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL',
        [new Date().toISOString(), id]
      );
      
      // Note: D1 doesn't return affected row count reliably, so we'll skip that check
      // The API endpoint will handle the "template not found" case by checking beforehand
      
    } catch (error) {
      console.error('Error in template deletion:', error);
      
      // Re-throw with more specific error message if it's the column issue
      if (error instanceof Error && error.message.includes('no such column')) {
        throw new Error(`Database schema error: ${error.message}`);
      }
      
      throw error;
    }
  }

  static async incrementUsage(id: string): Promise<void> {
    await executeQuery(
      'UPDATE templates SET usage_count = usage_count + 1 WHERE id = ?',
      [id]
    );
  }

  // Helper method to safely parse JSON with fallback
  private static safeJsonParse(jsonString: string, fallback: any): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('JSON parsing error:', error, 'Input:', jsonString);
      return fallback;
    }
  }

  // Helper method to enrich template with related data
  private static async enrichTemplate(template: any): Promise<PromptTemplate> {
    // Parse JSON fields with error handling
    const parsed = {
      ...template,
      promptConfig: template.prompt_config ? this.safeJsonParse(template.prompt_config, { systemPrompt: '', userPromptTemplate: '', parameters: [] }) : { systemPrompt: '', userPromptTemplate: '', parameters: [] },
      agentConfig: template.agent_config ? this.safeJsonParse(template.agent_config, null) : null,
      executionEnvironment: template.execution_environment ? this.safeJsonParse(template.execution_environment, []) : [],
      metadata: template.metadata ? this.safeJsonParse(template.metadata, {}) : {},
      tags: template.tags ? this.safeJsonParse(template.tags, []) : [],
      useCase: template.use_case,
      userId: template.user_id,
      is_public: Boolean(template.is_public),
      rating: template.rating || 0,
      usageCount: template.usage_count || 0,
      forkCount: template.fork_count || 0
    };

    // Fetch MCP servers
    const mcpServers = await executeQuery(
      `SELECT * FROM mcp_servers WHERE template_id = ? AND enabled = 1`,
      [template.id]
    );
    
    parsed.mcpServers = mcpServers.map(server => ({
      serverId: server.name,
      serverType: 'firecrawl' as const,
      configuration: {
        endpoint: 'https://api.firecrawl.dev',
        authentication: {
          type: 'apiKey' as const,
          credentials: server.config ? JSON.parse(server.config) : {}
        },
        rateLimit: {
          requestsPerMinute: 60,
          requestsPerHour: 1000,
          burstLimit: 10
        },
        fallback: {
          enabled: true,
          fallbackServers: [],
          retryAttempts: 3,
          timeoutMs: 30000
        }
      },
      tools: [],
      resources: []
    }));

    return parsed as PromptTemplate;
  }
}

// Search queries
export class SearchQueries {
  static async fullTextSearch(query: string, limit = 20): Promise<PromptTemplate[]> {
    const results = await executeQuery(
      `SELECT template_id FROM template_search 
       WHERE template_search MATCH ? 
       ORDER BY rank LIMIT ?`,
      [query, limit]
    );
    
    const templateIds = results.map(r => r.template_id);
    if (templateIds.length === 0) return [];

    const templates = await executeQuery(
      `SELECT t.*, u.name as author_name 
       FROM templates t 
       LEFT JOIN users u ON t.user_id = u.id 
       WHERE t.id IN (${templateIds.map(() => '?').join(',')}) 
       AND t.deleted_at IS NULL`,
      templateIds
    );

    return Promise.all(templates.map(t => TemplateQueries['enrichTemplate'](t)));
  }

  static async getPopularTags(limit = 20): Promise<Array<{ tag: string; count: number }>> {
    return await executeQuery(
      `SELECT tag, COUNT(*) as count 
       FROM template_tags tt
       JOIN templates t ON tt.template_id = t.id
       WHERE t.deleted_at IS NULL AND t.is_public = 1
       GROUP BY tag 
       ORDER BY count DESC 
       LIMIT ?`,
      [limit]
    );
  }
}

// Analytics queries
export class AnalyticsQueries {
  static async recordUsage(templateId: string, userId: string | null, usageType: string, metadata?: any): Promise<void> {
    await executeQuery(
      `INSERT INTO template_usage (id, template_id, user_id, usage_type, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        `${templateId}_${Date.now()}_${Math.random()}`,
        templateId, userId, usageType,
        metadata ? JSON.stringify(metadata) : null,
        new Date().toISOString()
      ]
    );
  }

  static async getTemplateStats(templateId: string): Promise<any> {
    const stats = await executeQuery(
      `SELECT 
         usage_type,
         COUNT(*) as count,
         DATE(created_at) as date
       FROM template_usage 
       WHERE template_id = ? 
       GROUP BY usage_type, DATE(created_at)
       ORDER BY date DESC`,
      [templateId]
    );
    
    return stats;
  }
}