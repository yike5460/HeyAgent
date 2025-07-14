"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Monitor, 
  Key, 
  Shield, 
  Globe, 
  Zap,
  LifeBuoy,
  Trash2,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    newTemplateAlerts: true,
    marketingEmails: false,
    
    // Appearance settings
    themePreference: "system",
    
    // Language settings
    language: "en",
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    
    // Usage limits
    apiRateLimit: "100",
    maxTemplates: "50",
    
    // Developer settings
    devMode: false,
    apiKey: "****************************************",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
    
    // Set theme preference in settings state based on current theme
    if (theme) {
      setSettings(prev => ({
        ...prev,
        themePreference: theme
      }));
    }
  }, [session, status, router, theme]);
  
  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };
  
  const handleChange = (name: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleThemeChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      themePreference: value
    }));
    setTheme(value);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, you would save settings to an API
      // await fetch("/api/settings", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(settings)
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const regenerateApiKey = () => {
    // In a real app, you would call an API to regenerate the key
    const newKey = Array.from({ length: 40 }, () => 
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 62)]
    ).join("");
    
    setSettings(prev => ({
      ...prev,
      apiKey: newKey
    }));
    
    toast({
      title: "API Key Regenerated",
      description: "Your new API key has been generated. Please save it somewhere secure.",
    });
  };
  
  const [showApiKey, setShowApiKey] = useState(false);

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how HeyAgent looks for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme Preference</Label>
                    <Select 
                      value={settings.themePreference}
                      onValueChange={handleThemeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center">
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center">
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center">
                            <Monitor className="mr-2 h-4 w-4" />
                            <span>System</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Language & Region
                </CardTitle>
                <CardDescription>
                  Set your preferred language and regional settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={settings.language}
                      onValueChange={(value) => handleChange("language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Button
                    variant={settings.emailNotifications ? "default" : "outline"}
                    onClick={() => handleToggle("emailNotifications")}
                  >
                    {settings.emailNotifications ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">New Template Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new templates matching your interests are published
                    </p>
                  </div>
                  <Button
                    variant={settings.newTemplateAlerts ? "default" : "outline"}
                    onClick={() => handleToggle("newTemplateAlerts")}
                  >
                    {settings.newTemplateAlerts ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive product updates and marketing communications
                    </p>
                  </div>
                  <Button
                    variant={settings.marketingEmails ? "default" : "outline"}
                    onClick={() => handleToggle("marketingEmails")}
                  >
                    {settings.marketingEmails ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Account Security
                </CardTitle>
                <CardDescription>
                  Manage your account security settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button
                      variant={settings.twoFactorAuth ? "default" : "outline"}
                      onClick={() => handleToggle("twoFactorAuth")}
                    >
                      {settings.twoFactorAuth ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select 
                      value={settings.sessionTimeout}
                      onValueChange={(value) => handleChange("sessionTimeout", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeout duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage API keys for accessing HeyAgent programmatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <Input
                          id="apiKey"
                          value={settings.apiKey}
                          type={showApiKey ? "text" : "password"}
                          className="pr-10"
                          readOnly
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button onClick={() => {navigator.clipboard.writeText(settings.apiKey)}} className="ml-2" variant="outline">
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" onClick={regenerateApiKey}>
                    <Key className="h-4 w-4 mr-2" />
                    Regenerate API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Usage Limits
                </CardTitle>
                <CardDescription>
                  Configure your usage limits and quotas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiRateLimit">API Rate Limit (requests per minute)</Label>
                    <Select 
                      value={settings.apiRateLimit}
                      onValueChange={(value) => handleChange("apiRateLimit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rate limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50 requests/minute</SelectItem>
                        <SelectItem value="100">100 requests/minute</SelectItem>
                        <SelectItem value="200">200 requests/minute</SelectItem>
                        <SelectItem value="500">500 requests/minute</SelectItem>
                        <SelectItem value="1000">1000 requests/minute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxTemplates">Maximum Templates</Label>
                    <Select 
                      value={settings.maxTemplates}
                      onValueChange={(value) => handleChange("maxTemplates", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 templates</SelectItem>
                        <SelectItem value="25">25 templates</SelectItem>
                        <SelectItem value="50">50 templates</SelectItem>
                        <SelectItem value="100">100 templates</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LifeBuoy className="mr-2 h-5 w-5" />
                  Developer Options
                </CardTitle>
                <CardDescription>
                  Advanced settings for developers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Developer Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable additional developer features and logging
                      </p>
                    </div>
                    <Button
                      variant={settings.devMode ? "default" : "outline"}
                      onClick={() => handleToggle("devMode")}
                    >
                      {settings.devMode ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-500">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Destructive actions that cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-md">
                    <div>
                      <h4 className="text-sm font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}