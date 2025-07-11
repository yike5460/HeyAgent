"use client"

import { useState, useEffect } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, Github, Chrome, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get error from URL params
  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      setError(getErrorMessage(urlError))
    }
  }, [searchParams])

  // Check if user is already signed in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        const callbackUrl = searchParams.get('callbackUrl') || '/'
        router.push(callbackUrl)
      }
    }
    checkSession()
  }, [router, searchParams])

  const handleProviderSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(provider)
      setError(null)
      
      const callbackUrl = searchParams.get('callbackUrl') || '/'
      
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false
      })

      if (result?.error) {
        setError(getErrorMessage(result.error))
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'OAuthSignin':
        return 'Error occurred during the OAuth signin process.'
      case 'OAuthCallback':
        return 'Error occurred during the OAuth callback process.'
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account.'
      case 'EmailCreateAccount':
        return 'Could not create email account.'
      case 'Callback':
        return 'Error occurred during callback.'
      case 'OAuthAccountNotLinked':
        return 'This email is already registered with a different provider. Please use the same provider you used before.'
      case 'EmailSignin':
        return 'Check your email for the signin link.'
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.'
      case 'SessionRequired':
        return 'Please sign in to access this page.'
      case 'AccessDenied':
        return 'Access denied. You may not have permission to sign in.'
      default:
        return 'An error occurred during sign in. Please try again.'
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue building amazing AI templates
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="border-2 border-primary/10 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* OAuth Providers */}
            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
                onClick={() => handleProviderSignIn('google')}
                disabled={isLoading !== null}
              >
                {isLoading === 'google' ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                ) : (
                  <Chrome className="h-5 w-5 mr-3" />
                )}
                Continue with Google
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
                onClick={() => handleProviderSignIn('github')}
                disabled={isLoading !== null}
              >
                {isLoading === 'github' ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                ) : (
                  <Github className="h-5 w-5 mr-3" />
                )}
                Continue with GitHub
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Terms and Privacy */}
            <div className="text-center text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>New to HeyAgent?</p>
          <p>Your account will be created automatically when you sign in for the first time.</p>
        </div>
      </div>
    </div>
  )
} 