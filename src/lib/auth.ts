import { NextAuthOptions } from "next-auth"
// import { D1Adapter } from "@auth/d1-adapter" // Install with: npm install @auth/d1-adapter
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string | null
      role?: string
    }
  }

  interface User {
    id: string
    username?: string | null
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username?: string | null
    role?: string
  }
}

// Database connection (you'll need to configure this with your actual D1 database)
const getDatabase = () => {
  // In a real Cloudflare Pages environment, you would get this from the context
  // For development, you'll need to mock this or use a different approach
  if (typeof (globalThis as any).cloudflare !== 'undefined') {
    return (globalThis as any).cloudflare.env.DB
  }
  // For development/testing, return null and handle gracefully
  return null
}

export const authOptions: NextAuthOptions = {
  // adapter: D1Adapter(getDatabase()), // Uncomment after installing @auth/d1-adapter
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        token.id = user.id
        token.username = user.username || extractUsernameFromEmail(user.email)
        token.role = user.role || "user"

        // Create user profile if it doesn't exist
        await createUserProfile(user, account, profile)
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser) {
        console.log(`New user registered: ${user.email}`)
      }
      
      // Log the sign-in activity
      await logUserActivity(user.id, "sign_in", {
        provider: account?.provider,
        isNewUser
      })
    },
    async signOut({ session, token }) {
      if (session?.user?.id) {
        await logUserActivity(session.user.id, "sign_out", {})
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
}

// Helper function to extract username from email
function extractUsernameFromEmail(email: string | null | undefined): string {
  if (!email) return ""
  return email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "")
}

// Helper function to create user profile
async function createUserProfile(user: any, account: any, profile: any) {
  try {
    const db = getDatabase()
    if (!db) return

    // Check if profile already exists
    const existingProfile = await db.prepare(
      "SELECT id FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).first()

    if (existingProfile) return

    // Create new user profile
    const profileData: any = {
      id: crypto.randomUUID(),
      user_id: user.id,
      username: extractUsernameFromEmail(user.email),
      display_name: user.name,
      avatar_url: user.image,
      role: "user",
      status: "active",
      email_notifications: 1,
      push_notifications: 1,
      preferences: JSON.stringify({
        theme: "system",
        language: "en"
      }),
      settings: JSON.stringify({
        privacy: {
          profileVisible: true,
          emailVisible: false
        }
      }),
      github_username: null,
      website: null,
      location: null,
      bio: null
    }

    // Add provider-specific data
    if (account?.provider === "github" && profile) {
      profileData.github_username = profile.login
      if (profile.blog) profileData.website = profile.blog
      if (profile.location) profileData.location = profile.location
      if (profile.bio) profileData.bio = profile.bio
    }

    await db.prepare(`
      INSERT INTO user_profiles (
        id, user_id, username, display_name, avatar_url, role, status,
        email_notifications, push_notifications, preferences, settings,
        github_username, website, location, bio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      profileData.id,
      profileData.user_id,
      profileData.username,
      profileData.display_name,
      profileData.avatar_url,
      profileData.role,
      profileData.status,
      profileData.email_notifications,
      profileData.push_notifications,
      profileData.preferences,
      profileData.settings,
      profileData.github_username || null,
      profileData.website || null,
      profileData.location || null,
      profileData.bio || null
    ).run()

    console.log(`Created user profile for: ${user.email}`)
  } catch (error) {
    console.error("Error creating user profile:", error)
  }
}

// Helper function to log user activity
async function logUserActivity(userId: string, activityType: string, metadata: any) {
  try {
    const db = getDatabase()
    if (!db) return

    await db.prepare(`
      INSERT INTO user_activities (id, user_id, activity_type, metadata)
      VALUES (?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      userId,
      activityType,
      JSON.stringify(metadata)
    ).run()
  } catch (error) {
    console.error("Error logging user activity:", error)
  }
} 