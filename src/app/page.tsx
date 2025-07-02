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

// Mock public templates for stats - Industry-focused
const mockPublicTemplates = [
  {
    id: '1',
    title: 'Short Drama Production Assistant',
    description: 'Automated script generation, character development, and scene planning for short-form video content with Kling video generation integration',
    author: 'MediaPro Studios',
    rating: 4.8,
    usageCount: 2150,
    forkCount: 34,
    tags: ['media-entertainment', 'video-generation', 'script', 'kling-api', 'production']
  },
  {
    id: '2',
    title: 'ASMR Content Creation Workflow',
    description: 'End-to-end ASMR content generation with audio processing, script optimization, and audience targeting using MCP servers',
    author: 'SoundScape AI',
    rating: 4.6,
    usageCount: 890,
    forkCount: 18,
    tags: ['media-entertainment', 'asmr', 'audio', 'mcp-servers', 'content-creation']
  },
  {
    id: '3',
    title: 'Healthcare Patient Analysis Agent',
    description: 'Comprehensive patient workflow automation with symptom analysis, treatment recommendations, and compliance monitoring',
    author: 'MedTech Solutions',
    rating: 4.9,
    usageCount: 3200,
    forkCount: 47,
    tags: ['healthcare', 'patient-analysis', 'compliance', 'medical-workflows', 'firecrawl']
  },
  {
    id: '4',
    title: 'Automated Customer Service Agent',
    description: 'Intelligent customer support with sentiment analysis, issue routing, and satisfaction tracking for retail environments',
    author: 'RetailBot Inc',
    rating: 4.7,
    usageCount: 1850,
    forkCount: 29,
    tags: ['retail', 'customer-service', 'sentiment-analysis', 'automation', 'support']
  },
  {
    id: '5',
    title: 'Financial Risk Assessment Pipeline',
    description: 'Real-time risk evaluation with market data analysis, compliance checking, and automated reporting for FSI',
    author: 'FinanceAI Corp',
    rating: 4.8,
    usageCount: 1650,
    forkCount: 22,
    tags: ['financial-services', 'risk-assessment', 'compliance', 'market-data', 'automation']
  },
  {
    id: '6',
    title: 'Manufacturing Quality Control Agent',
    description: 'Automated quality inspection with vision processing, defect detection, and supply chain optimization',
    author: 'IndustryBot Systems',
    rating: 4.5,
    usageCount: 980,
    forkCount: 15,
    tags: ['manufacturing', 'quality-control', 'vision-processing', 'defect-detection', 'optimization']
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
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Platform Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade agent template platform designed for deterministic application prototyping across industry verticals
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Production-Tested Prompts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground text-center">
                Sophisticated prompt templates with validated parameters, constraints, and deterministic workflow orchestration.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary/20 transition-colors duration-300">
                <Database className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-lg">Mature MCP Servers</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground text-center">
                Integrated agent tools like Firecrawl for web crawling, content extraction, and industry-specific data processing.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors duration-300">
                <Settings className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">SaaS Integrations</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground text-center">
                Pre-configured APIs for Kling, Veo3 video generation, and specialized industry tools with fallback behaviors.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-muted/30 transition-colors duration-300">
                <Workflow className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">E2B Sandbox</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground text-center">
                Containerized testing environments with performance metrics, cost analysis, and real-time validation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Advanced Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive toolset for professional agent development and deployment
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Template Inheritance</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Clone and customize optimized workflow templates with deterministic replication of proven architectures.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold">Visual Architecture</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Structural visualization showing LLM integration, tool dependencies, and API workflows in modern IDEs.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold">Advanced Customization</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Modify prompts, adjust MCP servers, configure API endpoints, and define custom fallback behaviors.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">Collaborative Development</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Version control, collaborative editing, template rating systems, and comprehensive usage analytics.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Quality Assurance</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Performance metrics, cost analysis, error handling demonstrations, and output quality assessments.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Upload className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold">Deployment Ready</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Seamless deployment workflows to production environments with dependency management and scaling.
            </p>
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