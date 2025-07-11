"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { 
  User, 
  Mail, 
  Globe, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin,
  Camera,
  Save,
  Loader2,
  Calendar,
  Activity,
  Settings,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id?: string
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
  preferences?: any
  settings?: any
  role?: string
  status?: string
  created_at?: string
  updated_at?: string
}

interface UserStats {
  templatesCreated: number
  templatesShared: number
  totalUsage: number
  joinDate: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/profile")
    } else if (session?.user) {
      loadUserProfile()
    }
  }, [status, session, router])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      
      // In a real implementation, this would fetch from your API
      // For now, we'll create a mock profile based on session data
      const mockProfile: UserProfile = {
        user_id: session?.user?.id || '',
        username: session?.user?.username || extractUsernameFromEmail(session?.user?.email),
        display_name: session?.user?.name || '',
        bio: '',
        location: '',
        website: '',
        github_username: '',
        twitter_username: '',
        linkedin_username: '',
        avatar_url: session?.user?.image || '',
        role: session?.user?.role || 'user',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const mockStats: UserStats = {
        templatesCreated: 5,
        templatesShared: 12,
        totalUsage: 1250,
        joinDate: new Date().toLocaleDateString()
      }

      setProfile(mockProfile)
      setStats(mockStats)
      setFormData(mockProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const extractUsernameFromEmail = (email: string | null | undefined): string => {
    if (!email) return ""
    return email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "")
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // In a real implementation, this would save to your API
      // For now, we'll just update the local state
      setProfile({ ...profile, ...formData } as UserProfile)
      setIsEditing(false)
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile || {})
    setIsEditing(false)
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || session.user?.image || ""} />
            <AvatarFallback className="text-2xl">
              {profile?.display_name?.charAt(0) || session.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {profile?.display_name || session.user?.name || "User"}
            </h1>
            <p className="text-muted-foreground">
              @{profile?.username} • {session.user?.email}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary">{profile?.role}</Badge>
              <Badge variant="outline">{profile?.status}</Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.templatesCreated}</p>
                      <p className="text-sm text-muted-foreground">Templates Created</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Activity className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.templatesShared}</p>
                      <p className="text-sm text-muted-foreground">Templates Shared</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Activity className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.totalUsage}</p>
                      <p className="text-sm text-muted-foreground">Total Usage</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.joinDate}</p>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    placeholder="Tell us about yourself..."
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {profile?.bio || "No bio available. Click Edit Profile to add one."}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Manage your personal information and social links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={isEditing ? formData.username || '' : profile?.username || ''}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      disabled={!isEditing}
                      placeholder="your-username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={isEditing ? formData.display_name || '' : profile?.display_name || ''}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Your Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        className="pl-10"
                        value={isEditing ? formData.location || '' : profile?.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={!isEditing}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        className="pl-10"
                        value={isEditing ? formData.website || '' : profile?.website || ''}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="github_username">GitHub</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="github_username"
                          className="pl-10"
                          value={isEditing ? formData.github_username || '' : profile?.github_username || ''}
                          onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                          disabled={!isEditing}
                          placeholder="username"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="twitter_username">Twitter</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="twitter_username"
                          className="pl-10"
                          value={isEditing ? formData.twitter_username || '' : profile?.twitter_username || ''}
                          onChange={(e) => setFormData({ ...formData, twitter_username: e.target.value })}
                          disabled={!isEditing}
                          placeholder="username"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_username">LinkedIn</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin_username"
                          className="pl-10"
                          value={isEditing ? formData.linkedin_username || '' : profile?.linkedin_username || ''}
                          onChange={(e) => setFormData({ ...formData, linkedin_username: e.target.value })}
                          disabled={!isEditing}
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and template interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm">Signed in to your account</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <User className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm">Updated profile information</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <Settings className="h-4 w-4 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm">Created new template "AI Assistant"</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 