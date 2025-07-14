"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { 
  User, 
  Mail, 
  Briefcase, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Globe, 
  Check,
  BadgeCheck,
  Building,
  Clock
} from "lucide-react";

interface Profile {
  name: string;
  email: string;
  bio: string;
  company: string;
  location: string;
  website: string;
  github: string;
  twitter: string;
  linkedin: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    bio: "",
    company: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
    linkedin: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (session?.user) {
      // Initialize profile with session data
      setProfile(prev => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
        // In a real app, you would fetch the full profile from an API
      }));
    }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // In a real app, you would save the profile to an API
      // await fetch("/api/profile", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(profile)
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="templates">My Templates</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="text-2xl">
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>

                  <div className="w-full pt-4 border-t flex flex-col space-y-3">
                    {profile.company && (
                      <div className="flex items-center text-sm">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{profile.company}</span>
                      </div>
                    )}
                    
                    {profile.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Joined {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="w-full pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Stats</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Templates</span>
                        <span className="font-bold">5</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Forks</span>
                        <span className="font-bold">12</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Stars</span>
                        <span className="font-bold">48</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Usage</span>
                        <span className="font-bold">324</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Main Content */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={true} // Email usually can't be changed directly
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      value={profile.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Where you work"
                        value={profile.company}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, Country"
                        value={profile.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="website"
                            name="website"
                            placeholder="https://example.com"
                            value={profile.website}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <div className="relative">
                          <Github className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="github"
                            name="github"
                            placeholder="username"
                            value={profile.github}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <div className="relative">
                          <Twitter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="twitter"
                            name="twitter"
                            placeholder="username"
                            value={profile.twitter}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            name="linkedin"
                            placeholder="username"
                            value={profile.linkedin}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>My Templates</CardTitle>
              <CardDescription>
                Templates you've created, forked, or saved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <h3 className="text-lg font-medium">Your templates will appear here</h3>
                <p className="mt-2">Create your first template to get started</p>
                <Button className="mt-4" onClick={() => router.push('/mine')}>
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent actions and events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample activity items - in a real app these would be loaded from an API */}
                <div className="flex items-start space-x-4 pb-4 border-b">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created new template</p>
                    <p className="text-sm text-muted-foreground">
                      You created "E-commerce Product Description Generator"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      3 days ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 pb-4 border-b">
                  <div className="rounded-full bg-primary/10 p-2">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Updated profile</p>
                    <p className="text-sm text-muted-foreground">
                      You updated your profile information
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      1 week ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Joined HeyAgent</p>
                    <p className="text-sm text-muted-foreground">
                      Welcome to the community!
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 weeks ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}