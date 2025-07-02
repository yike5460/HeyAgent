"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TemplatesRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the root page since templates is now the landing page
    router.replace('/')
  }, [router])

  return (
    <div className="container mx-auto py-8 text-center">
      <p>Redirecting to templates...</p>
    </div>
  )
}