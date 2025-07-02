"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PromptTemplate } from '@/types'
import { localStorageService } from '@/services/local-storage'
import { useSession } from "next-auth/react"
import { 
  Brain, 
  Database, 
  Settings, 
  Workflow, 
  Plus, 
  Search, 
  Users, 
  User,
  ArrowRight,
  Star,
  GitBranch,
  Download,
  Upload
} from 'lucide-react'
import Link from 'next/link'

// Mock public templates for stats
const mockPublicTemplates = [
  {
    id: '1',
    title: 'Short Drama Production Assistant',
    description: 'Automated script generation, character development, and scene planning for short-form video content',
    author: 'John Doe',
    rating: 4.8,
    usageCount: 1250,
    forkCount: 12,
    tags: ['video', 'script', 'automation', 'content-creation']
  },
  {
    id: '2',
    title: 'E-commerce Product Description Generator',
    description: 'Generate compelling product descriptions for online stores with SEO optimization',
    author: 'Jane Smith',
    rating: 4.5,
    usageCount: 890,
    forkCount: 8,
    tags: ['ecommerce', 'copywriting', 'seo', 'marketing']
  },
  {
    id: '3',
    title: 'Healthcare Symptom Analyzer',
    description: 'Analyze patient symptoms and provide preliminary assessment for healthcare professionals',
    author: 'Dr. Michael Chen',
    rating: 4.9,
    usageCount: 2100,
    forkCount: 25,
    tags: ['healthcare', 'medical', 'diagnosis', 'symptoms']
  }
]

export default function HomePage() {
  const { data: session } = useSession()
  const [myTemplatesCount, setMyTemplatesCount] = useState(0)
  const [myDraftCount, setMyDraftCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMyTemplatesStats()
  }, [])

  const loadMyTemplatesStats = async () => {
    try {
      const allTemplates = await localStorageService.getAllTemplates()
      const myTemplates = allTemplates.filter(t => t.userId === 'current-user' || t.author === 'Current User')
      const draftTemplates = myTemplates.filter(t => t.status === 'draft')
      
      setMyTemplatesCount(myTemplates.length)
      setMyDraftCount(draftTemplates.length)
    } catch (error) {
      console.error('Error loading templates stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const publicStats = {
    totalTemplates: mockPublicTemplates.length,
    totalUsage: mockPublicTemplates.reduce((sum, t) => sum + t.usageCount, 0),
    averageRating: mockPublicTemplates.reduce((sum, t) => sum + t.rating, 0) / mockPublicTemplates.length,
    totalForks: mockPublicTemplates.reduce((sum, t) => sum + t.forkCount, 0)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">AI Template Hub</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create, discover, and manage AI prompt templates with advanced workflow orchestration. 
          Explore community templates or build your own with local storage persistence.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Templates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicStats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">Community contributed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Templates</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : myTemplatesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {myDraftCount} drafts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publicStats.totalUsage.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Template executions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publicStats.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Community rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Templates Gallery */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured Templates</h2>
            <p className="text-muted-foreground">Discover popular AI templates created by the community</p>
          </div>
          <Link href="/gallery">
            <Button size="lg" className="group">
              <Search className="h-4 w-4 mr-2" />
              View All Templates
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPublicTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {template.tags[0]}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{template.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {template.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{template.usageCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitBranch className="h-3 w-3" />
                      <span>{template.forkCount}</span>
                    </div>
                  </div>
                  <span className="text-xs">by {template.author}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(1, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full group-hover:bg-primary/90" size="sm">
                  <Download className="h-3 w-3 mr-2" />
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Ready to explore more?</h3>
              <p className="text-muted-foreground">Browse our complete collection of AI templates</p>
            </div>
            <Link href="/gallery">
              <Button size="lg" className="group">
                <Search className="h-4 w-4 mr-2" />
                Explore Gallery
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Features Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Platform Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="text-center">
              <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Template Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Create sophisticated AI prompt templates with parameters, constraints, and workflow orchestration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <GitBranch className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Clone & Fork</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Clone existing templates and create forks with inheritance tracking and customization support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Database className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Local Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                All templates are stored locally in your browser with full offline access and data persistence.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Workflow className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Interactive diagrams showing LLM, prompts, MCP servers, and workflow orchestration using React Flow.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Getting Started</CardTitle>
          <CardDescription>
            New to AI template management? Here's how to get started with the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                1
              </div>
              <h4 className="font-medium">Explore Gallery</h4>
              <p className="text-sm text-muted-foreground">
                Browse community templates to understand different use cases and patterns.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                2
              </div>
              <h4 className="font-medium">Clone & Customize</h4>
              <p className="text-sm text-muted-foreground">
                Clone interesting templates to your workspace and customize them for your needs.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                3
              </div>
              <h4 className="font-medium">Create Original</h4>
              <p className="text-sm text-muted-foreground">
                Build your own templates from scratch with advanced configuration options.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}