export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isProtected = request.nextUrl.pathname.startsWith('/mine')
      if (isProtected) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
  },
  providers: [],
}