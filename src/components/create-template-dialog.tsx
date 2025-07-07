"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus, Brain, MessageSquare, Database, Cloud, Settings } from "lucide-react"
import { PromptTemplate, IndustryVertical, MCPServerConfig, SaaSIntegration, TemplateParameter } from "@/types"

interface CreateTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTemplateCreate?: (template: Partial<PromptTemplate>) => void
}

const industries: IndustryVertical[] = [
  "Media & Entertainment",
  "Healthcare & Life Science", 
  "Retail",
  "Manufacturing",
  "Automotive",
  "Financial Services",
  "Gaming"
]

const complexityOptions = [
  { value: 'beginner', label: 'Beginner', description: 'Simple templates with minimal configuration' },
  { value: 'intermediate', label: 'Intermediate', description: 'Moderate complexity with some integrations' },
  { value: 'advanced', label: 'Advanced', description: 'Complex workflows with multiple integrations' }
]

const categoryOptions = [
  'Content Creation', 'Marketing', 'Healthcare', 'E-commerce', 'Education', 
  'Finance', 'Entertainment', 'Data Analysis', 'Custom'
]

const commonMCPServerTypes = [
  { id: 'firecrawl', type: 'firecrawl', name: 'Firecrawl', description: 'Web scraping and content extraction' },
  { id: 'file-processor', type: 'file-processor', name: 'File Processor', description: 'File analysis and processing' },
  { id: 'api-integrator', type: 'api-integrator', name: 'API Integrator', description: 'External API integrations' },
  { id: 'custom', type: 'custom', name: 'Custom Server', description: 'Custom MCP server implementation' }
]

const commonSaaSProviders = [
  { provider: 'openai', service: 'gpt-4', name: 'OpenAI GPT-4', capabilities: ['text-generation'] },
  { provider: 'anthropic', service: 'claude-3', name: 'Anthropic Claude', capabilities: ['text-generation'] },
  { provider: 'elevenlabs', service: 'speech-synthesis', name: 'ElevenLabs TTS', capabilities: ['audio-synthesis'] },
  { provider: 'kling', service: 'video-generation', name: 'Kling Video', capabilities: ['video-generation'] },
  { provider: 'custom', service: 'custom-service', name: 'Custom Service', capabilities: ['custom'] }
]

export function CreateTemplateDialog({ open, onOpenChange, onTemplateCreate }: CreateTemplateDialogProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    description: "",
    industry: "" as IndustryVertical,
    useCase: "",
    category: "Custom",
    complexity: "intermediate" as 'beginner' | 'intermediate' | 'advanced',
    estimatedRuntime: 60,
    
    // Tags
    tags: [] as string[],
    
    // Model Configuration
    modelProvider: "openai",
    modelName: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1.0,
    
    // Prompt Configuration
    systemPrompt: "",
    userPromptTemplate: "",
    parameters: [] as TemplateParameter[],
    
         // MCP Servers
     mcpServers: [] as {
       name: string;
       description: string;
       configuration: string; // JSON string
     }[],
     
     // SaaS Integrations
     saasIntegrations: [] as {
       name: string;
       description: string;
       apiUrl: string;
     }[],
    
    // Dependencies
    dependencies: [] as string[]
  })
  
  const [newTag, setNewTag] = useState("")
  const [newParameter, setNewParameter] = useState({
    name: "",
    type: "string" as const,
    description: "",
    required: false,
    defaultValue: ""
  })
  const [newDependency, setNewDependency] = useState("")
  const [newMCPServer, setNewMCPServer] = useState({
    name: "",
    description: "",
    configuration: ""
  })
  const [newSaaSIntegration, setNewSaaSIntegration] = useState({
    name: "",
    description: "",
    apiUrl: ""
  })

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddParameter = () => {
    if (newParameter.name.trim()) {
      setFormData(prev => ({
        ...prev,
        parameters: [...prev.parameters, { ...newParameter }]
      }))
      setNewParameter({
        name: "",
        type: "string",
        description: "",
        required: false,
        defaultValue: ""
      })
    }
  }

  const handleRemoveParameter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }))
  }

  const handleAddMCPServer = () => {
    if (newMCPServer.name.trim() && newMCPServer.configuration.trim()) {
      setFormData(prev => ({
        ...prev,
        mcpServers: [...prev.mcpServers, { ...newMCPServer }]
      }))
      setNewMCPServer({
        name: "",
        description: "",
        configuration: ""
      })
    }
  }

  const handleRemoveMCPServer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mcpServers: prev.mcpServers.filter((_, i) => i !== index)
    }))
  }

  const handleAddSaaSIntegration = () => {
    if (newSaaSIntegration.name.trim()) {
      setFormData(prev => ({
        ...prev,
        saasIntegrations: [...prev.saasIntegrations, { ...newSaaSIntegration }]
      }))
      setNewSaaSIntegration({
        name: "",
        description: "",
        apiUrl: ""
      })
    }
  }

  const handleRemoveSaaSIntegration = (index: number) => {
    setFormData(prev => ({
      ...prev,
      saasIntegrations: prev.saasIntegrations.filter((_, i) => i !== index)
    }))
  }

  const handleAddDependency = () => {
    if (newDependency.trim() && !formData.dependencies.includes(newDependency.trim())) {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, newDependency.trim()]
      }))
      setNewDependency("")
    }
  }

  const handleRemoveDependency = (depToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(dep => dep !== depToRemove)
    }))
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (!formData.title.trim()) errors.push("Title is required")
    if (!formData.description.trim()) errors.push("Description is required")
    if (!formData.industry) errors.push("Industry is required")
    if (!formData.useCase.trim()) errors.push("Use case is required")
    if (formData.title.length < 3) errors.push("Title must be at least 3 characters")
    if (formData.description.length < 10) errors.push("Description must be at least 10 characters")
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      alert(validationErrors.join(", "))
      return
    }

    const templateData: Partial<PromptTemplate> = {
      title: formData.title,
      description: formData.description,
      industry: formData.industry,
      useCase: formData.useCase,
      promptConfig: {
        systemPrompt: formData.systemPrompt,
        userPromptTemplate: formData.userPromptTemplate,
        parameters: formData.parameters,
        constraints: {
          maxTokens: formData.maxTokens,
          temperature: formData.temperature,
          topP: formData.topP
        }
      },
      tags: formData.tags,
      mcpServers: formData.mcpServers.map((server, index) => ({
        serverId: `${server.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
        serverType: 'custom' as any,
        configuration: {
          endpoint: 'https://api.custom.dev',
          authentication: {
            type: 'apiKey' as const,
            credentials: { apiKey: 'your-api-key' }
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
        tools: [{
          name: `${server.name}_tool`,
          description: server.description || `Tool for ${server.name}`,
          inputSchema: JSON.parse(server.configuration || '{"type": "object", "properties": {"input": {"type": "string"}}, "required": ["input"]}'),
          outputSchema: {
            type: 'object',
            properties: {
              result: { type: 'string' }
            }
          },
          costEstimate: {
            estimatedCostPerCall: 0.01,
            currency: 'USD',
            billingModel: 'per-call' as const
          }
        }],
        resources: []
      })),
      saasIntegrations: formData.saasIntegrations.map((integration, index) => ({
        provider: 'custom' as any,
        service: integration.name,
        configuration: {
          apiKey: 'your-api-key',
          endpoint: integration.apiUrl || 'https://api.custom.com/v1',
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
            trackingGranularity: 'per-call' as const
          }
        },
        capabilities: [{
          type: 'custom' as any,
          parameters: [],
          constraints: []
        }]
      })),
      agentConfig: {
        workflow: [],
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
        category: formData.category,
        complexity: formData.complexity,
        estimatedRuntime: formData.estimatedRuntime,
        resourceRequirements: {
          cpu: formData.complexity === 'beginner' ? '0.25' : formData.complexity === 'intermediate' ? '0.5' : '1',
          memory: formData.complexity === 'beginner' ? '512Mi' : formData.complexity === 'intermediate' ? '1Gi' : '2Gi',
          storage: formData.complexity === 'beginner' ? '5Gi' : formData.complexity === 'intermediate' ? '10Gi' : '15Gi',
          network: true
        },
        dependencies: formData.dependencies,
        changelog: [{
          version: '1.0.0',
          date: new Date().toISOString().split('T')[0],
          changes: ['Initial creation'],
          author: 'Current User'
        }]
      }
    }

    if (onTemplateCreate) {
      onTemplateCreate(templateData)
    }
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      industry: "" as IndustryVertical,
      useCase: "",
      category: "Custom",
      complexity: "intermediate",
      estimatedRuntime: 60,
      tags: [],
      modelProvider: "openai",
      modelName: "gpt-4",
      temperature: 0.7,
      maxTokens: 2000,
      topP: 1.0,
      systemPrompt: "",
      userPromptTemplate: "",
      parameters: [],
      mcpServers: [],
      saasIntegrations: [],
      dependencies: []
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a comprehensive AI template with model configuration, prompts, MCP servers, and SaaS integrations.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Basic</span>
            </TabsTrigger>
            <TabsTrigger value="model" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Model & Prompt</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <Cloud className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="basic" className="space-y-6 mt-0">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                  <CardDescription>Essential template details and metadata</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Template Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., E-commerce Product Description Generator"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="useCase">Use Case *</Label>
                      <Input
                        id="useCase"
                        value={formData.useCase}
                        onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                        placeholder="e.g., Product Marketing"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what your template does and how it helps users..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value: IndustryVertical) => setFormData(prev => ({ ...prev, industry: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complexity">Complexity</Label>
                      <Select value={formData.complexity} onValueChange={(value: any) => setFormData(prev => ({ ...prev, complexity: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                                                 <SelectContent>
                           {complexityOptions.map((option) => (
                             <SelectItem key={option.value} value={option.value}>
                               <div className="text-left">
                                 <div className="font-medium">{option.label}</div>
                                 <div className="text-xs text-muted-foreground">{option.description}</div>
                               </div>
                             </SelectItem>
                           ))}
                         </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedRuntime">Estimated Runtime (seconds)</Label>
                      <Input
                        id="estimatedRuntime"
                        type="number"
                        value={formData.estimatedRuntime}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedRuntime: parseInt(e.target.value) || 60 }))}
                        min="1"
                        max="3600"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="model" className="space-y-6 mt-0">
              {/* Model Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>Model Configuration</span>
                  </CardTitle>
                  <CardDescription>Configure the AI model and parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="modelProvider">Provider</Label>
                      <Select value={formData.modelProvider} onValueChange={(value) => setFormData(prev => ({ ...prev, modelProvider: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="custom">Custom Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modelName">Model</Label>
                      <Input
                        id="modelName"
                        value={formData.modelName}
                        onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                        placeholder="e.g., gpt-4, claude-3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={formData.temperature}
                        onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0.7 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <Input
                        id="maxTokens"
                        type="number"
                        min="1"
                        max="8000"
                        value={formData.maxTokens}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 2000 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topP">Top P</Label>
                      <Input
                        id="topP"
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={formData.topP}
                        onChange={(e) => setFormData(prev => ({ ...prev, topP: parseFloat(e.target.value) || 1.0 }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prompt Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Prompt Configuration</span>
                  </CardTitle>
                  <CardDescription>Define system and user prompts with parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemPrompt">System Prompt (Optional)</Label>
                    <Textarea
                      id="systemPrompt"
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                      placeholder="You are an expert AI assistant..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userPromptTemplate">User Prompt Template (Required)</Label>
                    <Textarea
                      id="userPromptTemplate"
                      value={formData.userPromptTemplate}
                      onChange={(e) => setFormData(prev => ({ ...prev, userPromptTemplate: e.target.value }))}
                      placeholder="Create a {type} for {product} with {features}..."
                      rows={3}
                    />
                  </div>

                  {/* Template Parameters */}
                  <div className="space-y-3">
                    <Label>Template Parameters</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Parameter name"
                        value={newParameter.name}
                        onChange={(e) => setNewParameter(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <div className="flex space-x-2">
                        <Select value={newParameter.type} onValueChange={(value: any) => setNewParameter(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="array">Array</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={handleAddParameter} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {formData.parameters.map((param, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">{param.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">({param.type})</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveParameter(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6 mt-0">
              {/* MCP Servers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span>MCP Servers</span>
                  </CardTitle>
                  <CardDescription>Add Model Context Protocol servers for enhanced capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Server name (required)"
                      value={newMCPServer.name}
                      onChange={(e) => setNewMCPServer(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newMCPServer.description}
                      onChange={(e) => setNewMCPServer(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="JSON configuration (required)"
                      value={newMCPServer.configuration}
                      onChange={(e) => setNewMCPServer(prev => ({ ...prev, configuration: e.target.value }))}
                      rows={3}
                    />
                    <Button
                      type="button"
                      onClick={handleAddMCPServer}
                      disabled={!newMCPServer.name.trim() || !newMCPServer.configuration.trim()}
                      size="sm"
                    >
                      Add MCP Server
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.mcpServers.map((server, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{server.name}</div>
                          {server.description && <div className="text-sm text-muted-foreground">{server.description}</div>}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMCPServer(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SaaS Integrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Cloud className="h-5 w-5 text-emerald-600" />
                    <span>SaaS Integrations</span>
                  </CardTitle>
                  <CardDescription>Connect external SaaS services and APIs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Integration name (required)"
                      value={newSaaSIntegration.name}
                      onChange={(e) => setNewSaaSIntegration(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newSaaSIntegration.description}
                      onChange={(e) => setNewSaaSIntegration(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Input
                      placeholder="API URL (optional)"
                      value={newSaaSIntegration.apiUrl}
                      onChange={(e) => setNewSaaSIntegration(prev => ({ ...prev, apiUrl: e.target.value }))}
                    />
                    <Button
                      type="button"
                      onClick={handleAddSaaSIntegration}
                      disabled={!newSaaSIntegration.name.trim()}
                      size="sm"
                    >
                      Add SaaS Integration
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.saasIntegrations.map((integration, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{integration.name}</div>
                          {integration.description && <div className="text-sm text-muted-foreground">{integration.description}</div>}
                          {integration.apiUrl && <div className="text-xs text-blue-600">{integration.apiUrl}</div>}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSaaSIntegration(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 mt-0">
              {/* Dependencies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dependencies</CardTitle>
                  <CardDescription>Specify external dependencies and requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add dependency (e.g., openai, firecrawl)"
                      value={newDependency}
                      onChange={(e) => setNewDependency(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDependency())}
                    />
                    <Button type="button" onClick={handleAddDependency} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.dependencies.map((dep) => (
                      <Badge key={dep} variant="outline" className="flex items-center gap-1">
                        {dep}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveDependency(dep)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex-shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}