"use client"

import { useState, useEffect } from 'react'
import { TemplateCard } from '@/components/template-card'
import { TemplateVisualization } from '@/components/template-visualization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
    rating: 4.8,
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
    description: 'Generate compelling product descriptions for online stores with SEO optimization',
    industry: 'Retail',
    useCase: 'Product Marketing',
    promptConfig: {
      systemPrompt: 'You are an expert copywriter specializing in e-commerce product descriptions.',
      userPromptTemplate: 'Create a compelling product description for {product_name} in the {category} category. Focus on {key_features} and target {target_audience}.',
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
        maxTokens: 1500,
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
    rating: 4.5,
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
    rating: 4.9,
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState<IndustryVertical | 'all'>('all')
  const [complexityFilter, setComplexityFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'usageCount' | 'createdAt' | 'forkCount'>('rating')

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

  const handlePreview = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
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
                  <Star className="h-4 w-4 text-accent-foreground group-hover:animate-spin" style={{ animationDuration: '3s' }} />
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
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
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

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview: {selectedTemplate?.title}</DialogTitle>
            <DialogDescription>
              Created by {selectedTemplate?.author} • {selectedTemplate?.usageCount} uses • {selectedTemplate?.forkCount} forks
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Industry</h4>
                    <Badge variant="secondary">{selectedTemplate.industry}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium">Use Case</h4>
                    <p className="text-sm">{selectedTemplate.useCase}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">System Prompt</h4>
                  <pre className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {selectedTemplate.promptConfig.systemPrompt}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium">User Prompt Template</h4>
                  <pre className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {selectedTemplate.promptConfig.userPromptTemplate}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium">Parameters</h4>
                  <div className="space-y-2">
                    {selectedTemplate.promptConfig.parameters.map((param) => (
                      <div key={param.name} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div>
                          <span className="font-medium">{param.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">({param.type})</span>
                          {param.required && <Badge variant="outline" className="ml-2 text-xs">Required</Badge>}
                        </div>
                        <span className="text-sm text-muted-foreground">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}