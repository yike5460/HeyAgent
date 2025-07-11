// User service for database operations
// This service handles user-related CRUD operations with Cloudflare D1

export interface UserProfile {
  id: string
  user_id: string
  username?: string
  display_name?: string
  bio?: string
  location?: string
  website?: string
  github_username?: string
  twitter_username?: string
  linkedin_username?: string
  avatar_url?: string
  cover_image_url?: string
  preferences: string // JSON string
  settings: string // JSON string
  role: string
  status: string
  email_notifications: number
  push_notifications: number
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: string
  description?: string
  metadata?: string // JSON string
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Database connection helper
const getDatabase = () => {
  // In a real Cloudflare Pages environment, you would get this from the context
  if (typeof (globalThis as any).cloudflare !== 'undefined') {
    return (globalThis as any).cloudflare.env.DB
  }
  return null
}

export class UserService {
  /**
   * Get user profile by user ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const db = getDatabase()
      if (!db) return null

      const result = await db.prepare(
        "SELECT * FROM user_profiles WHERE user_id = ?"
      ).bind(userId).first()

      return result as UserProfile | null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  /**
   * Create or update user profile
   */
  static async upsertUserProfile(profileData: Partial<UserProfile>): Promise<boolean> {
    try {
      const db = getDatabase()
      if (!db) return false

      const existingProfile = await this.getUserProfile(profileData.user_id!)
      
      if (existingProfile) {
        // Update existing profile
        await db.prepare(`
          UPDATE user_profiles SET
            username = ?,
            display_name = ?,
            bio = ?,
            location = ?,
            website = ?,
            github_username = ?,
            twitter_username = ?,
            linkedin_username = ?,
            avatar_url = ?,
            cover_image_url = ?,
            preferences = ?,
            settings = ?,
            role = ?,
            status = ?,
            email_notifications = ?,
            push_notifications = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `).bind(
          profileData.username || existingProfile.username,
          profileData.display_name || existingProfile.display_name,
          profileData.bio || existingProfile.bio,
          profileData.location || existingProfile.location,
          profileData.website || existingProfile.website,
          profileData.github_username || existingProfile.github_username,
          profileData.twitter_username || existingProfile.twitter_username,
          profileData.linkedin_username || existingProfile.linkedin_username,
          profileData.avatar_url || existingProfile.avatar_url,
          profileData.cover_image_url || existingProfile.cover_image_url,
          profileData.preferences || existingProfile.preferences,
          profileData.settings || existingProfile.settings,
          profileData.role || existingProfile.role,
          profileData.status || existingProfile.status,
          profileData.email_notifications ?? existingProfile.email_notifications,
          profileData.push_notifications ?? existingProfile.push_notifications,
          profileData.user_id
        ).run()
      } else {
        // Create new profile
        await db.prepare(`
          INSERT INTO user_profiles (
            id, user_id, username, display_name, bio, location, website,
            github_username, twitter_username, linkedin_username,
            avatar_url, cover_image_url, preferences, settings,
            role, status, email_notifications, push_notifications
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          profileData.id || crypto.randomUUID(),
          profileData.user_id,
          profileData.username,
          profileData.display_name,
          profileData.bio,
          profileData.location,
          profileData.website,
          profileData.github_username,
          profileData.twitter_username,
          profileData.linkedin_username,
          profileData.avatar_url,
          profileData.cover_image_url,
          profileData.preferences || JSON.stringify({ theme: "system", language: "en" }),
          profileData.settings || JSON.stringify({ privacy: { profileVisible: true, emailVisible: false } }),
          profileData.role || "user",
          profileData.status || "active",
          profileData.email_notifications ?? 1,
          profileData.push_notifications ?? 1
        ).run()
      }

      return true
    } catch (error) {
      console.error('Error upserting user profile:', error)
      return false
    }
  }

  /**
   * Log user activity
   */
  static async logActivity(
    userId: string,
    activityType: string,
    description?: string,
    metadata?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<boolean> {
    try {
      const db = getDatabase()
      if (!db) return false

      await db.prepare(`
        INSERT INTO user_activities (
          id, user_id, activity_type, description, metadata, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(),
        userId,
        activityType,
        description,
        metadata ? JSON.stringify(metadata) : null,
        ipAddress,
        userAgent
      ).run()

      return true
    } catch (error) {
      console.error('Error logging user activity:', error)
      return false
    }
  }

  /**
   * Get user activities with pagination
   */
  static async getUserActivities(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<UserActivity[]> {
    try {
      const db = getDatabase()
      if (!db) return []

      const result = await db.prepare(`
        SELECT * FROM user_activities 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `).bind(userId, limit, offset).all()

      return result.results as UserActivity[]
    } catch (error) {
      console.error('Error getting user activities:', error)
      return []
    }
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(userId: string, preferences: any): Promise<boolean> {
    try {
      const db = getDatabase()
      if (!db) return false

      await db.prepare(`
        UPDATE user_profiles SET 
          preferences = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).bind(
        JSON.stringify(preferences),
        userId
      ).run()

      return true
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return false
    }
  }

  /**
   * Update user settings
   */
  static async updateSettings(userId: string, settings: any): Promise<boolean> {
    try {
      const db = getDatabase()
      if (!db) return false

      await db.prepare(`
        UPDATE user_profiles SET 
          settings = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).bind(
        JSON.stringify(settings),
        userId
      ).run()

      return true
    } catch (error) {
      console.error('Error updating user settings:', error)
      return false
    }
  }

  /**
   * Link user to template
   */
  static async linkUserToTemplate(
    userId: string,
    templateId: string,
    role: string = 'owner',
    permissions?: any
  ): Promise<boolean> {
    try {
      const db = getDatabase()
      if (!db) return false

      await db.prepare(`
        INSERT OR REPLACE INTO user_templates (
          id, user_id, template_id, role, permissions
        ) VALUES (?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(),
        userId,
        templateId,
        role,
        permissions ? JSON.stringify(permissions) : null
      ).run()

      return true
    } catch (error) {
      console.error('Error linking user to template:', error)
      return false
    }
  }

  /**
   * Get user templates
   */
  static async getUserTemplates(userId: string): Promise<any[]> {
    try {
      const db = getDatabase()
      if (!db) return []

      const result = await db.prepare(`
        SELECT * FROM user_templates 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `).bind(userId).all()

      return result.results || []
    } catch (error) {
      console.error('Error getting user templates:', error)
      return []
    }
  }

  /**
   * Check if username is available
   */
  static async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    try {
      const db = getDatabase()
      if (!db) return false

      let query = "SELECT COUNT(*) as count FROM user_profiles WHERE username = ?"
      const params = [username.toLowerCase()]

      if (excludeUserId) {
        query += " AND user_id != ?"
        params.push(excludeUserId)
      }

      const result = await db.prepare(query).bind(...params).first()
      return result.count === 0
    } catch (error) {
      console.error('Error checking username availability:', error)
      return false
    }
  }

  /**
   * Search users by username or email
   */
  static async searchUsers(query: string, limit: number = 20): Promise<any[]> {
    try {
      const db = getDatabase()
      if (!db) return []

      const result = await db.prepare(`
        SELECT p.*, u.email 
        FROM user_profiles p
        JOIN users u ON p.user_id = u.id
        WHERE p.username LIKE ? OR p.display_name LIKE ? OR u.email LIKE ?
        AND p.status = 'active'
        ORDER BY p.display_name
        LIMIT ?
      `).bind(
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        limit
      ).all()

      return result.results || []
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }
} 