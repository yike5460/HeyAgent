import { auth as nextAuth } from "../../auth"

export interface Session {
  user: {
    id: string
    email: string
    name?: string
    image?: string
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const session = await nextAuth()
    
    if (!session?.user?.email) {
      return null
    }

    return {
      user: {
        id: session.user.email, // Use email as ID for now
        email: session.user.email,
        name: session.user.name || undefined,
        image: session.user.image || undefined
      }
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export { getSession as auth }