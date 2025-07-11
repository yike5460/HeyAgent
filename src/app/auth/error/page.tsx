"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorInfo = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          description: 'There is a problem with the server configuration. Please contact support.',
          action: 'Contact Support'
        }
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          description: 'You do not have permission to sign in. This may be due to account restrictions.',
          action: 'Try Different Account'
        }
      case 'Verification':
        return {
          title: 'Verification Error',
          description: 'The verification token is invalid or has expired. Please try signing in again.',
          action: 'Sign In Again'
        }
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
        return {
          title: 'OAuth Error',
          description: 'There was an error with the OAuth provider. This may be temporary.',
          action: 'Try Again'
        }
      case 'EmailCreateAccount':
        return {
          title: 'Account Creation Error',
          description: 'Unable to create your account. The email may already be in use with a different provider.',
          action: 'Try Different Provider'
        }
      case 'Callback':
        return {
          title: 'Callback Error',
          description: 'There was an error during the authentication callback process.',
          action: 'Try Again'
        }
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Not Linked',
          description: 'This email is already associated with another account using a different sign-in method.',
          action: 'Use Original Provider'
        }
      case 'EmailSignin':
        return {
          title: 'Email Sign-in Error',
          description: 'Unable to send email or email verification failed.',
          action: 'Try Again'
        }
      case 'CredentialsSignin':
        return {
          title: 'Invalid Credentials',
          description: 'The credentials you provided are incorrect.',
          action: 'Check Credentials'
        }
      case 'SessionRequired':
        return {
          title: 'Session Required',
          description: 'You must be signed in to access this page.',
          action: 'Sign In'
        }
      default:
        return {
          title: 'Authentication Error',
          description: 'An unexpected error occurred during authentication. Please try again.',
          action: 'Try Again'
        }
    }
  }

  const errorInfo = getErrorInfo(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Authentication Error</h1>
          <p className="text-muted-foreground">
            Something went wrong during the sign-in process
          </p>
        </div>

        {/* Error Card */}
        <Card className="border-2 border-destructive/10 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl">{errorInfo.title}</CardTitle>
            <CardDescription>
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Details */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error Code:</strong> {error || 'Unknown'}
                <br />
                <strong>Time:</strong> {new Date().toLocaleString()}
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-12 text-base"
                asChild
              >
                <Link href="/auth/signin">
                  <RefreshCw className="h-5 w-5 mr-3" />
                  {errorInfo.action}
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
                asChild
              >
                <Link href="/">
                  Go to Home
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                If this problem persists, please{" "}
                <Link href="/contact" className="underline hover:text-foreground">
                  contact support
                </Link>
                {" "}with the error code above.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting Tips */}
        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Troubleshooting Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Make sure you have a stable internet connection</li>
              <li>Try using a different browser or clearing your cache</li>
              <li>Disable browser extensions that might interfere</li>
              <li>Check if you have cookies enabled</li>
              <li>Try signing in with a different provider</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 