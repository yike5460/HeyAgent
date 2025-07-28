"use client"

import { useState, useEffect } from 'react'
import { TemplateCard } from '@/components/template-card'
import { TemplateDetailsPanel } from '@/components/template-details-panel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { PromptTemplate, IndustryVertical } from '@/types'
import { Search, Filter, Eye, Copy, GitBranch, Star, Download } from 'lucide-react'

// Mock public templates data
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
    executionEnvironment: [],
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
      changelog: [
        {
          version: '1.0.0',
          date: '2024-01-15',
          changes: ['Initial release'],
          author: 'John Doe'
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'user1',
    author: 'John Doe',
    usageCount: 1250,
    tags: ['video', 'script', 'automation', 'content-creation', 'drama', 'entertainment'],
    forkCount: 12,
    isForked: false,
    collaborators: [],
    isPublic: true,
    license: 'MIT'
  },
  {
    id: '2',
    title: 'E-commerce Product Description Generator',
    description: 'Generate compelling product descriptions for online stores with SEO optimization and competitive analysis',
    industry: 'Retail',
    useCase: 'Product Marketing',
    promptConfig: {
      systemPrompt: 'You are an expert copywriter specializing in e-commerce product descriptions with access to web scraping and competitive analysis tools.',
      userPromptTemplate: 'Research {competitor_urls} and create a compelling product description for {product_name} in the {category} category. Focus on {key_features} and target {target_audience}.',
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
        },
        {
          name: 'competitor_urls',
          type: 'array',
          description: 'Competitor product URLs for analysis',
          required: false
        },
        {
          name: 'key_features',
          type: 'string',
          description: 'Key product features to highlight',
          required: true
        },
        {
          name: 'target_audience',
          type: 'string',
          description: 'Target customer demographic',
          required: true
        }
      ],
      constraints: {
        maxTokens: 1500,
        temperature: 0.8
      }
    },
    mcpServers: [
      {
        serverId: 'firecrawl',
        serverType: 'firecrawl',
        configuration: {
          endpoint: 'https://api.firecrawl.dev',
          authentication: {
            type: 'apiKey',
            credentials: { apiKey: 'fc-key' },
          },
          rateLimit: {
            requestsPerMinute: 60,
            requestsPerHour: 1000,
            burstLimit: 10,
          },
          fallback: {
            enabled: true,
            fallbackServers: [],
            retryAttempts: 3,
            timeoutMs: 30000,
          },
        },
        tools: [
          {
            name: 'scrape_webpage',
            description: 'Scrape content from competitor product pages',
            inputSchema: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                extractOptions: { type: 'object' }
              },
              required: ['url'],
            },
            outputSchema: {
              type: 'object',
              properties: {
                content: { type: 'string' },
                title: { type: 'string' },
                price: { type: 'string' },
                features: { type: 'array' }
              },
            },
            costEstimate: {
              estimatedCostPerCall: 0.01,
              currency: 'USD',
              billingModel: 'per-call',
            },
          },
        ],
        resources: [],
      },
    ],
    executionEnvironment: [
      {
        infrastructure: 'claude-code',
        requirements: 'Claude Code CLI, Node.js 18+, Python 3.9+'
      }
    ],
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
      changelog: [
        {
          version: '1.0.0',
          date: '2024-01-20',
          changes: ['Initial release'],
          author: 'Jane Smith'
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    userId: 'user2',
    author: 'Jane Smith',
    usageCount: 890,
    tags: ['ecommerce', 'copywriting', 'seo', 'marketing', 'retail'],
    forkCount: 8,
    isForked: false,
    collaborators: [],
    isPublic: true,
    license: 'MIT'
  },
  {
    id: '3',
    title: 'Healthcare Symptom Analyzer',
    description: 'Analyze patient symptoms and provide preliminary assessment for healthcare professionals',
    industry: 'Healthcare & Life Science',
    useCase: 'Medical Assessment',
    promptConfig: {
      systemPrompt: 'You are a medical AI assistant helping healthcare professionals with preliminary symptom analysis.',
      userPromptTemplate: 'Analyze the following symptoms: {symptoms}. Patient age: {age}, gender: {gender}. Provide preliminary assessment.',
      parameters: [
        {
          name: 'symptoms',
          type: 'string',
          description: 'List of patient symptoms',
          required: true
        },
        {
          name: 'age',
          type: 'number',
          description: 'Patient age',
          required: true
        }
      ],
      constraints: {
        maxTokens: 2500,
        temperature: 0.3
      }
    },
    mcpServers: [],
    executionEnvironment: [],
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
        minInstances: 2,
        maxInstances: 15,
        scaleUpThreshold: 70,
        scaleDownThreshold: 30
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
      dependencies: ['openai', 'medical-db'],
      changelog: [
        {
          version: '1.0.0',
          date: '2024-01-25',
          changes: ['Initial release'],
          author: 'Dr. Michael Chen'
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    userId: 'user3',
    author: 'Dr. Michael Chen',
    usageCount: 2100,
    tags: ['healthcare', 'medical', 'diagnosis', 'symptoms', 'analysis'],
    forkCount: 25,
    isForked: false,
    collaborators: [],
    isPublic: true,
    license: 'Apache-2.0'
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

export default function TemplateGalleryPage() {
  const [templates, setTemplates] = useState<PromptTemplate[]>(mockPublicTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState<PromptTemplate[]>(mockPublicTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [isTemplateDetailsOpen, setIsTemplateDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState<IndustryVertical | 'all'>('all')
  const [complexityFilter, setComplexityFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [sortBy, setSortBy] = useState<'usageCount' | 'createdAt' | 'forkCount'>('usageCount')

  useEffect(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = searchQuery === '' || 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        template.author.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesIndustry = industryFilter === 'all' || template.industry === industryFilter
      const matchesComplexity = complexityFilter === 'all' || template.metadata?.complexity === complexityFilter
      
      return matchesSearch && matchesIndustry && matchesComplexity
    })

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
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

  const handlePreview = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setIsTemplateDetailsOpen(true)
  }

  const handleTemplateCardClick = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setIsTemplateDetailsOpen(true)
  }

  const handleClone = (template: PromptTemplate) => {
    // In real implementation, this would navigate to the clone page or open a clone dialog
    toast({
      title: "Clone Template",
      description: `Template "${template.title}" will be cloned to your workspace.`
    })
  }

  const handleFork = (template: PromptTemplate) => {
    // In real implementation, this would create a fork
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Template Gallery</h1>
        <p className="text-lg text-muted-foreground">
          Explore and discover AI prompt templates created by the community. Find templates for your use case and clone them to your workspace.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">Public templates available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Times templates have been used</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              0
            </div>
            <p className="text-xs text-muted-foreground">Community favorites</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.reduce((sum, t) => sum + t.forkCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Templates forked by users</p>
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

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No templates found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleTemplateCardClick(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg line-clamp-2">{template.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{template.industry}</Badge>
                      <Badge variant="outline" className={
                        template.metadata.complexity === 'beginner' ? 'bg-green-100 text-green-800' :
                        template.metadata.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {template.metadata.complexity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>0</span>
                  </div>
                </div>
                <CardDescription className="line-clamp-3">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags && template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>by {template.author}</span>
                    <div className="flex items-center space-x-3">
                      <span>{template.usageCount.toLocaleString()} uses</span>
                      <span>{template.forkCount} forks</span>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreview(template)
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClone(template)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFork(template)
                      }}
                    >
                      <GitBranch className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExport(template)
                      }}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Template Details Panel */}
      <TemplateDetailsPanel
        template={selectedTemplate}
        isOpen={isTemplateDetailsOpen}
        onOpenChange={setIsTemplateDetailsOpen}
        onForkTemplate={handleFork}
      />
    </div>
  )
}