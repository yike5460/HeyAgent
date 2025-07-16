import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session?.user?.email) {
        session.user.id = session.user.email; // Use email as ID
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user, account }: any) {
      try {
        // Auto-create user in database on first sign-in
        if (user?.email) {
          const { UserQueries } = await import('@/lib/database');
          await UserQueries.createOrUpdate({
            id: user.email,
            email: user.email,
            name: user.name || '',
            image: user.image || '',
            provider: account?.provider || 'unknown',
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        return true;
      } catch (error) {
        console.error('Error creating user in database:', error);
        // Still allow sign-in even if user creation fails
        return true;
      }
    },
    authorized({ auth, request }: any) {
      const isLoggedIn = !!auth?.user
      const isProtected = request.nextUrl.pathname.startsWith('/mine')
      if (isProtected) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
