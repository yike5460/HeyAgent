"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TemplateCard } from '@/components/template-card'
import { TemplateDetailsPanel } from '@/components/template-details-panel'
import { DashboardHero } from '@/components/dashboard-hero'
import { PromptTemplate, IndustryVertical } from '@/types'
import { localStorageService } from '@/services/local-storage'
import { useSession } from "next-auth/react"
import { toast } from '@/components/ui/use-toast'
import {
  Search,
  Star,
  GitBranch,
  Activity,
  Eye,
  Copy,
  Download
} from 'lucide-react'
import Link from 'next/link'

// Mock public templates with full PromptTemplate structure
const mockPublicTemplates: PromptTemplate[] = [
  {
    id: '1',
    title: 'Short Drama Production Assistant',
    description: 'Automated script generation, character development, and scene planning for short-form video content',
    industry: 'Media & Entertainment',
    useCase: 'Short Drama Production',
    promptConfig: {
      systemPrompt: 'You are an expert script writer and video production assistant specializing in short-form drama content.',
      userPromptTemplate: 'Create a {genre} short drama script with {duration} minutes duration. Focus on {theme} and target {audience} audience.',
      parameters: [
        {
          name: 'genre',
          type: 'string',
          description: 'The genre of the drama (romance, thriller, comedy, etc.)',
          required: true
        },
        {
          name: 'duration',
          type: 'number',
          description: 'Duration in minutes',
          required: true,
          defaultValue: 5
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
        autoScaling: true,
        minInstances: 1,
        maxInstances: 10,
        scaleUpThreshold: 80,
        scaleDownThreshold: 20
      }
    },
    metadata: {
      category: 'Content Creation',
      complexity: 'intermediate',
      estimatedRuntime: 120,
      resourceRequirements: {
        cpu: '0.5',
        memory: '1Gi',
        storage: '10Gi',
        network: true
      },
      dependencies: ['openai'],
      changelog: []
    },
    version: 1,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'user1',
    author: 'MediaPro Studios',
    rating: 4.8,
    usageCount: 2150,
    tags: ['video', 'script', 'automation', 'content-creation', 'drama'],
    forkCount: 34,
    isForked: false,
    collaborators: [],
    isPublic: true,
    license: 'MIT'
  },
  {
    id: '2',
    title: 'Healthcare Patient Analysis Agent',
    description: 'Comprehensive patient workflow automation with symptom analysis, treatment recommendations, and compliance monitoring',
    industry: 'Healthcare & Life Science',
    useCase: 'Patient Analysis',
    promptConfig: {
      systemPrompt: 'You are a medical AI assistant with expertise in patient data analysis and healthcare workflows.',
      userPromptTemplate: 'Analyze patient symptoms: {symptoms}. Consider medical history: {history}. Provide treatment recommendations for {condition}.',
      parameters: [
        {
          name: 'symptoms',
          type: 'string',
          description: 'Patient reported symptoms',
          required: true
        },
        {
          name: 'history',
          type: 'string',
          description: 'Patient medical history',
          required: false
        }
      ],
      constraints: {
        maxTokens: 1500,
        temperature: 0.3
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
      category: 'Healthcare',
      complexity: 'advanced',
      estimatedRuntime: 180,
      resourceRequirements: {
        cpu: '1',
        memory: '2Gi',
        storage: '15Gi',
        network: true
      },
      dependencies: ['anthropic'],
      changelog: []
    },
    version: 1,
    status: 'published',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    userId: 'user2',
    author: 'MedTech Solutions',
    rating: 4.9,
    usageCount: 3200,
    tags: ['healthcare', 'patient-analysis', 'compliance', 'medical-workflows'],
    forkCount: 47,
    isForked: false,
    collaborators: [],
    isPublic: true,
    license: 'Apache-2.0'
  },
  {
    id: '3',
    title: 'E-commerce Product Description Generator',
    description: 'Generate compelling product descriptions for online stores with SEO optimization and competitive analysis',
    industry: 'Retail',
    useCase: 'Product Marketing',
    promptConfig: {
      systemPrompt: 'You are an expert copywriter specializing in e-commerce product descriptions.',
      userPromptTemplate: 'Create a product description for {product_name} in the {category} category. Highlight {key_features} for {target_audience}.',
      parameters: [
        {
          name: 'product_name',
          type: 'string',
          description: 'Name of the product',
          required: true
        },
        {
          name: 'category',
          type: 'string',
          description: 'Product category',
          required: true
        }
      ],
      constraints: {
        maxTokens: 1000,
        temperature: 0.8
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
        autoScaling: true,
        minInstances: 1,
        maxInstances: 8,
        scaleUpThreshold: 70,
        scaleDownThreshold: 30
      }
    },
    metadata: {
      category: 'Marketing',
      complexity: 'beginner',
      estimatedRuntime: 60,
      resourceRequirements: {
        cpu: '0.25',
        memory: '512Mi',
        storage: '5Gi',
        network: true
      },
      dependencies: ['openai'],
      changelog: []
    },
    version: 1,
    status: 'published',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
    userId: 'user3',
    author: 'RetailBot Inc',
    rating: 4.7,
    usageCount: 1850,
    tags: ['retail', 'ecommerce', 'copywriting', 'seo', 'marketing'],
    forkCount: 29,
    isForked: false,
    collaborators: [],
    isPublic: true,
    license: 'MIT'
  }
]

const industryOptions: IndustryVertical[] = [
  'Media & Entertainment',
  'Healthcare & Life Science',
  'Retail',
  'Manufacturing',
  'Automotive',
  'Financial Services',
  'Gaming'
]

export default function HomePage() {
  const { data: session } = useSession()
  const [myTemplatesCount, setMyTemplatesCount] = useState(0)
  const [myDraftCount, setMyDraftCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [isTemplateDetailsOpen, setIsTemplateDetailsOpen] = useState(false)
  
  // Gallery functionality states
  const [templates, setTemplates] = useState<PromptTemplate[]>(mockPublicTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState<PromptTemplate[]>(mockPublicTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState<IndustryVertical | 'all'>('all')
  const [complexityFilter, setComplexityFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'usageCount' | 'createdAt' | 'forkCount'>('rating')

  useEffect(() => {
    loadMyTemplatesStats()
  }, [])

  // Filter and sort templates when filters change
  useEffect(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = searchQuery === '' || 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        template.author.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesIndustry = industryFilter === 'all' || template.industry === industryFilter
      const matchesComplexity = complexityFilter === 'all' || template.metadata.complexity === complexityFilter
      
      return matchesSearch && matchesIndustry && matchesComplexity
    })

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'usageCount':
          return b.usageCount - a.usageCount
        case 'forkCount':
          return b.forkCount - a.forkCount
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    setFilteredTemplates(filtered)
  }, [templates, searchQuery, industryFilter, complexityFilter, sortBy])

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

  const handlePreview = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setIsTemplateDetailsOpen(true)
  }

  const handleClone = (template: PromptTemplate) => {
    toast({
      title: "Clone Template",
      description: `Template "${template.title}" will be cloned to your workspace.`
    })
  }

  const handleFork = (template: PromptTemplate) => {
    toast({
      title: "Fork Template",
      description: `Template "${template.title}" will be forked to your workspace.`
    })
  }

  const handleExport = (template: PromptTemplate) => {
    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.title.replace(/\s+/g, '_').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Export Complete",
      description: `Template "${template.title}" exported successfully.`
    })
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

      {/* Enhanced Stats Grid with Animations - Ultra Compact */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Community Templates */}
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card">
          <CardContent className="p-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary tabular-nums">{templates.length}</div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-4 w-4 text-primary group-hover:animate-pulse" />
                </div>
              </div>
              <div className="text-sm font-medium text-foreground">Community Templates</div>
              <div className="text-xs text-muted-foreground">Public templates available</div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </CardContent>
        </Card>
        
        {/* Total Usage */}
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card">
          <CardContent className="p-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary tabular-nums">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
                </div>
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-4 w-4 text-accent-foreground group-hover:animate-pulse" />
                </div>
              </div>
              <div className="text-sm font-medium text-foreground">Total Executions</div>
              <div className="text-xs text-muted-foreground">AI workflows run</div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </CardContent>
        </Card>
        
        {/* Average Rating */}
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card">
          <CardContent className="p-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary tabular-nums">
                  {(templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1)}
                </div>
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-4 w-4 text-primary group-hover:fill-primary transition-colors duration-300" />
                </div>
              </div>
              <div className="text-sm font-medium text-foreground">Avg Rating</div>
              <div className="text-xs text-muted-foreground">Community rating</div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </CardContent>
        </Card>
        
        {/* Total Forks */}
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card">
          <CardContent className="p-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary tabular-nums">
                  {templates.reduce((sum, t) => sum + t.forkCount, 0)}
                </div>
                <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GitBranch className="h-4 w-4 text-secondary-foreground group-hover:animate-bounce" />
                </div>
              </div>
              <div className="text-sm font-medium text-foreground">Total Forks</div>
              <div className="text-xs text-muted-foreground">Templates forked by users</div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 items-center p-4 bg-muted/50 rounded-lg">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates by title, description, tags, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={industryFilter} onValueChange={(value: any) => setIndustryFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industryOptions.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={complexityFilter} onValueChange={(value: any) => setComplexityFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="usageCount">Usage</SelectItem>
              <SelectItem value="forkCount">Forks</SelectItem>
              <SelectItem value="createdAt">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTemplates.length} of {templates.length} templates
      </div>

      {/* Templates Grid - Responsive Layout */}
      <div id="templates" className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No templates found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={handlePreview}
              onClone={handleClone}
              onFork={handleFork}
              onExport={handleExport}
            />
          ))
        )}
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
              <h4 className="font-medium">Explore Templates</h4>
              <p className="text-sm text-muted-foreground">
                Browse and filter community templates to find the perfect starting point for your use case.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                2
              </div>
              <h4 className="font-medium">Clone & Customize</h4>
              <p className="text-sm text-muted-foreground">
                Clone interesting templates to your workspace and customize them for your specific needs.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                3
              </div>
              <h4 className="font-medium">Create & Share</h4>
              <p className="text-sm text-muted-foreground">
                Build your own templates from scratch and share them with the community.
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
        onUseTemplate={(template) => {
          toast({
            title: "Use Template",
            description: `Template "${template.title}" will be used in sandbox.`
          })
        }}
        onCloneTemplate={handleClone}
        onForkTemplate={handleFork}
      />
    </div>
  )
}