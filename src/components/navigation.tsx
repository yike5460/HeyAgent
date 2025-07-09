"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Plus, 
  User, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Hexagon,
  Sparkles,
  Diamond,
  Orbit,
  Triangle,
  Menu,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Copy
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "@/components/ui/use-toast"

export function Navigation() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            {/* Background faded hexagon for stereovision effect */}
            <Hexagon className="absolute h-6 w-6 text-primary/20 translate-x-0.5 translate-y-0.5" />
            <Hexagon className="absolute h-6 w-6 text-primary/40 translate-x-0.25 translate-y-0.25" />
            {/* Main hexagon */}
            <Hexagon className="relative h-6 w-6 text-primary" />
          </div>
          {/* Abstract & Aesthetic icon options for HeyAgent:
          <Sparkles className="h-6 w-6 text-primary" />   // AI magic, intelligent automation
          <Diamond className="h-6 w-6 text-primary" />    // Refined, precious, polished templates  
          <Orbit className="h-6 w-6 text-primary" />      // Orchestration, interconnected systems
          <Triangle className="h-6 w-6 text-primary" />   // Building blocks, hierarchy, structure
          */}
          <span className="font-bold text-xl">HeyAgent</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 text-sm font-medium ml-8">
          <Link
            href="/mine"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            My Templates
          </Link>
          <Link
            href="/sandbox"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Sandbox
          </Link>
          <Link
            href="/analytics"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Analytics
          </Link>
          <Link
            href="/docs"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Docs
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Search className="h-4 w-4 mr-2" />
            Search...
          </Button>

          {/* Social Media Share */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Share HeyAgent</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check%20out%20HeyAgent%20-%20Marketplace%20for%20Agentic%20Templates!&url=${encodeURIComponent(window.location.origin)}`, '_blank')}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Share on Twitter
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, '_blank')}
              >
                <Linkedin className="mr-2 h-4 w-4" />
                Share on LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank')}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Share on Facebook
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin)
                  toast({
                    title: "Link Copied!",
                    description: "HeyAgent link has been copied to your clipboard."
                  })
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Create Button */}
          <Link href="/mine">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </Link>

          {/* User Menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => signIn()}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}