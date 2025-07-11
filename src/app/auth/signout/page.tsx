"use client"

import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    // If user is not signed in, redirect to home
    if (!session) {
      router.push('/')
    }
  }, [session, router])

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut({
        callbackUrl: '/',
        redirect: true
      })
    } catch (error) {
      console.error('Sign out error:', error)
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (!session) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Sign out</h1>
          <p className="text-muted-foreground">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        {/* Sign Out Card */}
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Confirm Sign Out</CardTitle>
            <CardDescription>
              You are currently signed in as <strong>{session.user?.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="destructive"
                size="lg"
                className="w-full h-12 text-base"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5 mr-3" />
                )}
                Sign Out
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Your templates and data will be saved and available when you sign back in.</p>
        </div>
      </div>
    </div>
  )
} 