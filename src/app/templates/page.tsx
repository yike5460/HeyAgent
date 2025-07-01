"use client"

import { useState, useEffect } from 'react'
import { TemplateManager } from '@/components/template-manager'
import { TemplateVisualization } from '@/components/template-visualization'
import { TemplateCard } from '@/components/template-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { PromptTemplate } from '@/types'
import { Brain, Database, Settings, Workflow } from 'lucide-react'

// Mock data - this would come from API in real implementation
const mockTemplate: PromptTemplate = {
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
      },
      {
        name: 'theme',
        type: 'string',
        description: 'Central theme or message',
        required: false,
        defaultValue: 'human connection'
      },
      {
        name: 'audience',
        type: 'string',
        description: 'Target audience demographics',
        required: false,
        defaultValue: 'young adults'
      }
    ],
    constraints: {
      maxTokens: 2000,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
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
          credentials: { apiKey: 'fc-key' }
        },
        rateLimit: {
          requestsPerMinute: 60,
          requestsPerHour: 1000,
          burstLimit: 10
        },
        fallback: {
          enabled: true,
          fallbackServers: [],
          retryAttempts: 3,
          timeoutMs: 30000
        }
      },
      tools: [
        {
          name: 'scrape_webpage',
          description: 'Scrape content from a webpage for research',
          inputSchema: {
            type: 'object',
            properties: {
              url: { type: 'string' }
            },
            required: ['url']
          },
          outputSchema: {
            type: 'object',
            properties: {
              content: { type: 'string' }
            }
          },
          costEstimate: {
            estimatedCostPerCall: 0.01,
            currency: 'USD',
            billingModel: 'per-call'
          }
        },
        {
          name: 'extract_text',
          description: 'Extract text content from various file formats',
          inputSchema: {
            type: 'object',
            properties: {
              file_url: { type: 'string' }
            },
            required: ['file_url']
          },
          outputSchema: {
            type: 'object',
            properties: {
              text: { type: 'string' }
            }
          },
          costEstimate: {
            estimatedCostPerCall: 0.005,
            currency: 'USD',
            billingModel: 'per-call'
          }
        }
      ],
      resources: []
    },
    {
      serverId: 'content-analyzer',
      serverType: 'custom',
      configuration: {
        endpoint: 'https://api.content-analyzer.com',
        authentication: {
          type: 'bearer',
          credentials: { token: 'bearer-token' }
        },
        rateLimit: {
          requestsPerMinute: 100,
          requestsPerHour: 2000,
          burstLimit: 20
        },
        fallback: {
          enabled: false,
          fallbackServers: [],
          retryAttempts: 2,
          timeoutMs: 15000
        }
      },
      tools: [
        {
          name: 'analyze_sentiment',
          description: 'Analyze sentiment of text content',
          inputSchema: {
            type: 'object',
            properties: {
              text: { type: 'string' }
            },
            required: ['text']
          },
          outputSchema: {
            type: 'object',
            properties: {
              sentiment: { type: 'string' },
              confidence: { type: 'number' }
            }
          },
          costEstimate: {
            estimatedCostPerCall: 0.002,
            currency: 'USD',
            billingModel: 'per-call'
          }
        }
      ],
      resources: []
    }
  ],
  saasIntegrations: [
    {
      provider: 'openai',
      service: 'gpt-4',
      configuration: {
        apiKey: 'sk-key',
        endpoint: 'https://api.openai.com/v1',
        version: 'v1',
        rateLimit: {
          requestsPerMinute: 60,
          requestsPerHour: 1000,
          burstLimit: 10
        },
        costTracking: {
          enabled: true,
          budgetLimit: 100,
          alertThreshold: 80,
          trackingGranularity: 'per-call'
        }
      },
      capabilities: [
        {
          type: 'text-generation',
          parameters: [
            {
              name: 'model',
              type: 'string',
              description: 'Model to use',
              required: true,
              defaultValue: 'gpt-4'
            }
          ],
          constraints: [
            {
              name: 'max_tokens',
              value: 4000,
              description: 'Maximum tokens per request'
            }
          ]
        }
      ]
    },
    {
      provider: 'elevenlabs',
      service: 'text-to-speech',
      configuration: {
        apiKey: 'el-key',
        endpoint: 'https://api.elevenlabs.io/v1',
        version: 'v1',
        rateLimit: {
          requestsPerMinute: 30,
          requestsPerHour: 500,
          burstLimit: 5
        },
        costTracking: {
          enabled: true,
          budgetLimit: 50,
          alertThreshold: 70,
          trackingGranularity: 'per-call'
        }
      },
      capabilities: [
        {
          type: 'audio-synthesis',
          parameters: [
            {
              name: 'voice_id',
              type: 'string',
              description: 'Voice ID to use',
              required: true
            }
          ],
          constraints: [
            {
              name: 'max_characters',
              value: 5000,
              description: 'Maximum characters per request'
            }
          ]
        }
      ]
    }
  ],
  agentConfig: {
    workflow: [
      {
        id: 'step1',
        name: 'Research Phase',
        type: 'mcp-call',
        configuration: {
          serverId: 'firecrawl',
          tool: 'scrape_webpage',
          parameters: { url: '{research_url}' }
        },
        dependencies: [],
        timeout: 30000
      },
      {
        id: 'step2',
        name: 'Script Generation',
        type: 'prompt',
        configuration: {
          systemPrompt: 'Generate script based on research',
          userPrompt: 'Create drama script'
        },
        dependencies: ['step1'],
        timeout: 45000
      }
    ],
    errorHandling: {
      retryPolicy: {
        maxRetries: 3,
        backoffStrategy: 'exponential',
        baseDelay: 1000,
        maxDelay: 10000
      },
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
    dependencies: ['openai', 'firecrawl', 'elevenlabs'],
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
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([mockTemplate])
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(mockTemplate)

  const handleTemplateCreate = async (templateData: Partial<PromptTemplate>) => {
    try {
      // In real implementation, call API
      const newTemplate: PromptTemplate = {
        ...templateData,
        id: `template-${Date.now()}`,
        version: 1,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'current-user',
        author: 'Current User',
        rating: 0,
        usageCount: 0,
        forkCount: 0,
        isForked: false,
        collaborators: [],
        isPublic: false,
        license: 'MIT'
      } as PromptTemplate

      setTemplates(prev => [...prev, newTemplate])
      toast({
        title: "Template Created",
        description: "Your template has been created successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template.",
        variant: "destructive"
      })
    }
  }

  const handleTemplateUpdate = async (id: string, templateData: Partial<PromptTemplate>) => {
    try {
      setTemplates(prev => 
        prev.map(t => 
          t.id === id 
            ? { ...t, ...templateData, updatedAt: new Date().toISOString() }
            : t
        )
      )
      toast({
        title: "Template Updated",
        description: "Your template has been updated successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template.",
        variant: "destructive"
      })
    }
  }

  const handleTemplateDelete = async (id: string) => {
    try {
      setTemplates(prev => prev.filter(t => t.id !== id))
      toast({
        title: "Template Deleted",
        description: "Template has been deleted successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template.",
        variant: "destructive"
      })
    }
  }

  const handleTemplateClone = async (id: string) => {
    try {
      const templateToClone = templates.find(t => t.id === id)
      if (templateToClone) {
        const clonedTemplate: PromptTemplate = {
          ...templateToClone,
          id: `clone-${Date.now()}`,
          title: `${templateToClone.title} (Copy)`,
          version: 1,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rating: 0,
          usageCount: 0,
          forkCount: 0,
          isForked: true,
          parentTemplateId: templateToClone.id,
          collaborators: [],
          isPublic: false,
          license: templateToClone.license
        }
        setTemplates(prev => [...prev, clonedTemplate])
        toast({
          title: "Template Cloned",
          description: "Template has been cloned successfully."
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clone template.",
        variant: "destructive"
      })
    }
  }

  const handleTemplateImport = async (importedTemplates: PromptTemplate[]) => {
    try {
      const newTemplates = importedTemplates.map(template => ({
        ...template,
        id: `imported-${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'current-user',
        author: 'Imported User',
        status: 'draft' as const,
        version: 1,
        rating: 0,
        usageCount: 0,
        forkCount: template.forkCount || 0,
        isForked: template.isForked || false,
        parentTemplateId: template.parentTemplateId,
        collaborators: template.collaborators || [],
        isPublic: template.isPublic || false,
        license: template.license || 'MIT'
      }))
      
      setTemplates(prev => [...prev, ...newTemplates])
      toast({
        title: "Templates Imported",
        description: `Successfully imported ${newTemplates.length} templates.`
      })
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to import templates.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Template Gallery</h1>
        <p className="text-lg text-muted-foreground">
          Create, manage, and visualize AI prompt templates with advanced workflow orchestration.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{templates.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active templates in your gallery
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MCP Servers</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedTemplate.mcpServers.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Connected MCP servers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Integrations</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedTemplate.saasIntegrations.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  SaaS integrations configured
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workflow Steps</CardTitle>
                <Workflow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedTemplate.agentConfig.workflow.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Orchestration workflow steps
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Featured Template: {selectedTemplate.title}</CardTitle>
              <CardDescription>{selectedTemplate.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{selectedTemplate.industry}</Badge>
                <Badge variant="outline">{selectedTemplate.useCase}</Badge>
                <Badge variant="outline">{selectedTemplate.metadata.complexity}</Badge>
                <Badge variant="outline">{selectedTemplate.status}</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Dependencies</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.metadata.dependencies.map((dep) => (
                      <Badge key={dep} variant="outline" className="text-xs">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          <TemplateVisualization template={selectedTemplate} />
        </TabsContent>

        <TabsContent value="management">
          <TemplateManager
            templates={templates}
            onTemplateCreate={handleTemplateCreate}
            onTemplateUpdate={handleTemplateUpdate}
            onTemplateDelete={handleTemplateDelete}
            onTemplateClone={handleTemplateClone}
            onTemplateImport={handleTemplateImport}
          />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div key={template.id} onClick={() => setSelectedTemplate(template)}>
                <TemplateCard
                  template={{
                    id: template.id,
                    title: template.title,
                    description: template.description,
                    industry: template.industry,
                    useCase: template.useCase,
                    author: template.author,
                    rating: template.rating,
                    usageCount: template.usageCount,
                    lastUpdated: template.updatedAt,
                    tags: template.tags,
                    mcpServers: template.mcpServers.map(s => s.serverId),
                    saasIntegrations: template.saasIntegrations.map(s => s.provider),
                    status: template.status
                  }}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 