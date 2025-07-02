"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TemplateDetailsPanel } from '@/components/template-details-panel'
import { DashboardHero } from '@/components/dashboard-hero'
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
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [isTemplateDetailsOpen, setIsTemplateDetailsOpen] = useState(false)

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

  const handleUseTemplate = (template: any) => {
    // Convert the mock template to PromptTemplate format
    const fullTemplate: PromptTemplate = {
      ...template,
      industry: template.industry || 'Media & Entertainment',
      useCase: template.useCase || 'General',
      promptConfig: {
        systemPrompt: 'You are a helpful AI assistant.',
        userPromptTemplate: 'Please help me with: {request}',
        parameters: [
          {
            name: 'request',
            type: 'string',
            description: 'The user request',
            required: true
          }
        ],
        constraints: {
          maxTokens: 2000,
          temperature: 0.7
        }
      },
      mcpServers: [],
      saasIntegrations: [],
      agentConfig: {
        workflow: [],
        errorHandling: {
          retryPolicy: { maxRetries: 3, backoffStrategy: 'exponential', baseDelay: 1000, maxDelay: 10000 },
          fallbackActions: [],
          errorNotifications: []
        },
        monitoring: {
          metricsCollection: true,
          performanceTracking: true,
          costTracking: true,
          alerting: []
        },
        scaling: {
          autoScaling: false,
          minInstances: 1,
          maxInstances: 5,
          scaleUpThreshold: 80,
          scaleDownThreshold: 20
        }
      },
      metadata: {
        category: 'General',
        complexity: 'beginner',
        estimatedRuntime: 60,
        resourceRequirements: {
          cpu: '0.25',
          memory: '512Mi',
          storage: '5Gi',
          network: true
        },
        dependencies: [],
        changelog: []
      },
      version: 1,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'mock-user',
      parentTemplateId: undefined,
      isForked: false,
      inheritanceConfig: undefined,
      exportMetadata: undefined,
      collaborators: [],
      isPublic: true,
      license: 'MIT'
    }
    
    setSelectedTemplate(fullTemplate)
    setIsTemplateDetailsOpen(true)
  }

  const publicStats = {
    totalTemplates: mockPublicTemplates.length,
    totalUsage: mockPublicTemplates.reduce((sum, t) => sum + t.usageCount, 0),
    averageRating: mockPublicTemplates.reduce((sum, t) => sum + t.rating, 0) / mockPublicTemplates.length,
    totalForks: mockPublicTemplates.reduce((sum, t) => sum + t.forkCount, 0)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Enhanced Dashboard Hero */}
      <DashboardHero
        publicStats={publicStats}
        myTemplatesCount={myTemplatesCount}
        myDraftCount={myDraftCount}
        loading={loading}
      />



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

      {/* Template Details Panel */}
      <TemplateDetailsPanel
        template={selectedTemplate}
        isOpen={isTemplateDetailsOpen}
        onOpenChange={setIsTemplateDetailsOpen}
      />
    </div>
  )
}