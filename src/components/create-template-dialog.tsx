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
import { PromptTemplate, IndustryVertical, MCPServerConfig, ExecutionEnvironment, TemplateParameter } from "@/types"

interface CreateTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTemplateCreate?: (template: Partial<PromptTemplate>) => void
  editingTemplate?: PromptTemplate
  isEditing?: boolean
}

const industries: IndustryVertical[] = [
  "Media & Entertainment",
  "Healthcare & Life Science", 
  "Retail",
  "Manufacturing",
  "Automotive",
  "Financial Services",
  "Gaming",
  "Cross Industry"
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

const commonExecutionEnvironments = [
  { infrastructure: 'vscode', name: 'VS Code', description: 'Visual Studio Code with extensions' },
  { infrastructure: 'cursor', name: 'Cursor', description: 'AI-powered code editor' },
  { infrastructure: 'claude-code', name: 'Claude Code', description: 'Claude Code CLI environment' },
  { infrastructure: 'jupyter', name: 'Jupyter Notebook', description: 'Interactive computing environment' },
  { infrastructure: 'github-codespaces', name: 'GitHub Codespaces', description: 'Cloud development environment' },
  { infrastructure: 'replit', name: 'Replit', description: 'Online IDE and hosting platform' }
]

// Model series mapping based on provider information
const modelsByProvider = {
  openai: {
    reasoning: [
      { id: 'o4-mini', name: 'o4-mini', description: 'Faster, more affordable reasoning model' },
      { id: 'o3', name: 'o3', description: 'Our most powerful reasoning model' },
      { id: 'o3-pro', name: 'o3-pro', description: 'Version of o3 with more compute for better responses' },
      { id: 'o3-mini', name: 'o3-mini', description: 'A small model alternative to o3' },
      { id: 'o1', name: 'o1', description: 'Previous full o-series reasoning model' },
      { id: 'o1-mini', name: 'o1-mini', description: 'A small model alternative to o1' },
      { id: 'o1-pro', name: 'o1-pro', description: 'Version of o1 with more compute for better responses' }
    ],
    flagship: [
      { id: 'gpt-4.1', name: 'GPT-4.1', description: 'Flagship GPT model for complex tasks' },
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Fast, intelligent, flexible GPT model' },
      { id: 'gpt-4o-audio-preview', name: 'GPT-4o Audio', description: 'GPT-4o models capable of audio inputs and outputs' },
      { id: 'chatgpt-4o-latest', name: 'ChatGPT-4o', description: 'GPT-4o model used in ChatGPT' }
    ],
    costOptimized: [
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 mini', description: 'Balanced for intelligence, speed, and cost' },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 nano', description: 'Fastest, most cost-effective GPT-4.1 model' },
      { id: 'gpt-4o-mini', name: 'GPT-4o mini', description: 'Fast, affordable small model for focused tasks' },
      { id: 'gpt-4o-mini-audio-preview', name: 'GPT-4o mini Audio', description: 'Smaller model capable of audio inputs and outputs' }
    ],
    legacy: [
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'An older high-intelligence GPT model' },
      { id: 'gpt-4', name: 'GPT-4', description: 'An older high-intelligence GPT model' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Legacy GPT model for cheaper chat and non-chat tasks' }
    ]
  },
  anthropic: {
    claude4: [
      { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', description: 'Our most powerful and capable model' },
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'High-performance model with exceptional reasoning capabilities' }
    ],
    claude3_5: [
      { id: 'claude-3-7-sonnet-20250219', name: 'Claude Sonnet 3.7', description: 'High-performance model with early extended thinking' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude Sonnet 3.5 v2', description: 'Our previous intelligent model' },
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude Sonnet 3.5', description: 'Previous version of Sonnet 3.5' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude Haiku 3.5', description: 'Our fastest model' }
    ],
    claude3: [
      { id: 'claude-3-opus-20240229', name: 'Claude Opus 3', description: 'Powerful model for complex tasks' },
      { id: 'claude-3-haiku-20240307', name: 'Claude Haiku 3', description: 'Fast and compact model for near-instant responsiveness' }
    ]
  },
  bedrock: {
    claude: [
      { id: 'anthropic.claude-opus-4-20250514-v1:0', name: 'Claude Opus 4', description: 'Most capable Claude model on Bedrock' },
      { id: 'anthropic.claude-sonnet-4-20250514-v1:0', name: 'Claude Sonnet 4', description: 'High-performance Claude model' },
      { id: 'anthropic.claude-3-5-sonnet-20241022-v2:0', name: 'Claude 3.5 Sonnet v2', description: 'Latest Claude 3.5 Sonnet' },
      { id: 'anthropic.claude-3-5-haiku-20241022-v1:0', name: 'Claude 3.5 Haiku', description: 'Fastest Claude model' },
      { id: 'anthropic.claude-3-opus-20240229-v1:0', name: 'Claude 3 Opus', description: 'Most capable Claude 3 model' },
      { id: 'anthropic.claude-3-haiku-20240307-v1:0', name: 'Claude 3 Haiku', description: 'Fastest Claude 3 model' }
    ],
    titan: [
      { id: 'amazon.titan-text-express-v1', name: 'Titan Text Express', description: 'Amazon\'s text generation model' },
      { id: 'amazon.titan-text-lite-v1', name: 'Titan Text Lite', description: 'Lightweight Amazon text model' }
    ]
  },
  google: {
    gemini2_5: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Our most advanced reasoning Gemini model' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Best model in terms of price-performance' },
      { id: 'gemini-2.5-flash-lite-preview-06-17', name: 'Gemini 2.5 Flash-Lite', description: 'Most cost-efficient model supporting high throughput' }
    ],
    gemini2: [
      { id: 'gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', description: 'Newest multimodal model with next generation features' },
      { id: 'gemini-2.0-flash-lite-001', name: 'Gemini 2.0 Flash-Lite', description: 'Cost efficiency and low latency model' }
    ],
    gemini1_5: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Complex reasoning tasks requiring more intelligence' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and versatile performance across diverse tasks' },
      { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B', description: 'High volume and lower intelligence tasks' }
    ]
  },
  custom: []
}

// Provider-specific default parameters
const providerDefaults = {
  openai: {
    temperature: 1.0,
    maxTokens: 2000,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    stopSequences: [],
    parallelToolCalls: true,
    stream: false,
  },
  anthropic: {
    temperature: 0.0,
    maxTokens: 256,
    topP: 1.0,
    topK: 5,
    stopSequences: [],
    thinking: false,
  },
  bedrock: {
    temperature: 0.5,
    maxTokens: 2048,
    topP: 1.0,
    stopSequences: [],
    streaming: true,
    guardrailId: "",
    guardrailVersion: "",
  },
  google: {
    temperature: 0.7,
    maxTokens: 8192,
    topP: 1.0,
    topK: 40,
    stopSequences: [],
    safetySettings: [],
  }
}

export function CreateTemplateDialog({ open, onOpenChange, onTemplateCreate, editingTemplate, isEditing = false }: CreateTemplateDialogProps) {
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
    temperature: 1.0,
    maxTokens: 2000,
    topP: 1.0,
    
    // Provider-specific parameters
    // OpenAI
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    stopSequences: [] as string[],
    parallelToolCalls: true,
    stream: false,
    
    // Anthropic
    topK: 5,
    thinking: false,
    
              // Amazon Bedrock
    guardrailId: "",
    guardrailVersion: "",
    streaming: true,
    
    // Google
    safetySettings: "",
    
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
     
     // Execution Environment
     executionEnvironment: [] as {
       infrastructure: string;
       requirements: string;
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
  const [newExecutionEnvironment, setNewExecutionEnvironment] = useState({
    infrastructure: "",
    requirements: ""
  })

  // Populate form data when editing a template
  React.useEffect(() => {
    if (isEditing && editingTemplate) {
      setFormData({
        // Basic Information
        title: editingTemplate.title || "",
        description: editingTemplate.description || "",
        industry: editingTemplate.industry || "" as IndustryVertical,
        useCase: editingTemplate.useCase || "",
        category: editingTemplate.metadata?.category || "Custom",
        complexity: editingTemplate.metadata?.complexity || "intermediate" as 'beginner' | 'intermediate' | 'advanced',
        estimatedRuntime: editingTemplate.metadata?.estimatedRuntime || 60,
        
        // Tags
        tags: editingTemplate.tags || [],
        
        // Model Configuration - properly load from model config
        modelProvider: editingTemplate.promptConfig?.model?.provider || "openai",
        modelName: editingTemplate.promptConfig?.model?.name || "gpt-4",
        temperature: editingTemplate.promptConfig?.model?.parameters?.temperature || editingTemplate.promptConfig?.constraints?.temperature || 1.0,
        maxTokens: editingTemplate.promptConfig?.model?.parameters?.maxTokens || editingTemplate.promptConfig?.constraints?.maxTokens || 2000,
        topP: editingTemplate.promptConfig?.model?.parameters?.topP || editingTemplate.promptConfig?.constraints?.topP || 1.0,
        
        // Provider-specific parameters - load from model config
        frequencyPenalty: editingTemplate.promptConfig?.model?.parameters?.frequencyPenalty || editingTemplate.promptConfig?.constraints?.frequencyPenalty || 0.0,
        presencePenalty: editingTemplate.promptConfig?.model?.parameters?.presencePenalty || editingTemplate.promptConfig?.constraints?.presencePenalty || 0.0,
        stopSequences: (editingTemplate.promptConfig?.model?.parameters?.stopSequences || []) as string[],
        parallelToolCalls: editingTemplate.promptConfig?.model?.parameters?.parallelToolCalls ?? true,
        stream: editingTemplate.promptConfig?.model?.parameters?.stream || false,
        topK: editingTemplate.promptConfig?.model?.parameters?.topK || 5,
        thinking: editingTemplate.promptConfig?.model?.parameters?.thinking || false,
        guardrailId: editingTemplate.promptConfig?.model?.parameters?.guardrailId || "",
        guardrailVersion: editingTemplate.promptConfig?.model?.parameters?.guardrailVersion || "",
        streaming: editingTemplate.promptConfig?.model?.parameters?.streaming ?? true,
        safetySettings: typeof editingTemplate.promptConfig?.model?.parameters?.safetySettings === 'string' 
          ? editingTemplate.promptConfig.model.parameters.safetySettings 
          : "",
        
        // Prompt Configuration
        systemPrompt: editingTemplate.promptConfig?.systemPrompt || "",
        userPromptTemplate: editingTemplate.promptConfig?.userPromptTemplate || "",
        parameters: editingTemplate.promptConfig?.parameters || [],
        
        // MCP Servers - convert from MCPServerConfig to form format
        mcpServers: editingTemplate.mcpServers?.map(server => ({
          name: server.serverId,
          description: `MCP Server: ${server.serverType}`,
          configuration: JSON.stringify(server.configuration || {})
        })) || [],
        
        // Execution Environment
        executionEnvironment: editingTemplate.executionEnvironment?.map(env => ({
          infrastructure: env.infrastructure,
          requirements: JSON.stringify(env.requirements || {})
        })) || [],
        
        // Dependencies
        dependencies: editingTemplate.metadata?.dependencies || []
      })
    }
  }, [isEditing, editingTemplate])

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

  const handleAddExecutionEnvironment = () => {
    if (newExecutionEnvironment.infrastructure.trim()) {
      setFormData(prev => ({
        ...prev,
        executionEnvironment: [...prev.executionEnvironment, { ...newExecutionEnvironment }]
      }))
      setNewExecutionEnvironment({
        infrastructure: "",
        requirements: ""
      })
    }
  }

  const handleRemoveExecutionEnvironment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      executionEnvironment: prev.executionEnvironment.filter((_, i) => i !== index)
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
    // Description is now optional
    if (!formData.industry) errors.push("Industry is required")
    if (!formData.useCase.trim()) errors.push("Use case is required")
    if (formData.title.length < 3) errors.push("Title must be at least 3 characters")
    if (formData.description.length > 0 && formData.description.length < 10) errors.push("Description must be at least 10 characters if provided")
    
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
        // Add complete model configuration
        model: {
          provider: formData.modelProvider as 'openai' | 'anthropic' | 'bedrock' | 'google' | 'custom',
          name: formData.modelName,
          parameters: {
            temperature: formData.temperature,
            maxTokens: formData.maxTokens,
            topP: formData.topP,
            // OpenAI specific
            ...(formData.modelProvider === 'openai' && {
              frequencyPenalty: formData.frequencyPenalty,
              presencePenalty: formData.presencePenalty,
              parallelToolCalls: formData.parallelToolCalls,
              stream: formData.stream,
              stopSequences: formData.stopSequences
            }),
            // Anthropic specific
            ...(formData.modelProvider === 'anthropic' && {
              topK: formData.topK,
              thinking: formData.thinking
            }),
            // Amazon Bedrock specific
            ...(formData.modelProvider === 'bedrock' && {
              guardrailId: formData.guardrailId,
              guardrailVersion: formData.guardrailVersion,
              streaming: formData.streaming
            }),
            // Google specific
            ...(formData.modelProvider === 'google' && {
              safetySettings: formData.safetySettings
            })
          }
        },
        constraints: {
          maxTokens: formData.maxTokens,
          temperature: formData.temperature,
          topP: formData.topP,
          ...(formData.modelProvider === 'openai' && {
            frequencyPenalty: formData.frequencyPenalty,
            presencePenalty: formData.presencePenalty,
            parallelToolCalls: formData.parallelToolCalls,
            stream: formData.stream
          }),
          ...(formData.modelProvider === 'anthropic' && {
            topK: formData.topK,
            thinking: formData.thinking
          }),
          ...(formData.modelProvider === 'bedrock' && {
            guardrailId: formData.guardrailId,
            guardrailVersion: formData.guardrailVersion,
            streaming: formData.streaming
          })
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
      executionEnvironment: formData.executionEnvironment,
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
      temperature: 1.0,
      maxTokens: 2000,
      topP: 1.0,
      
      // Provider-specific parameters
      // OpenAI
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      stopSequences: [],
      parallelToolCalls: true,
      stream: false,
      
      // Anthropic
      topK: 5,
      thinking: false,
      
      // Amazon Bedrock
      guardrailId: "",
      guardrailVersion: "",
      streaming: true,
      
      // Google
      safetySettings: "",
      
      systemPrompt: "",
      userPromptTemplate: "",
      parameters: [],
      mcpServers: [],
      executionEnvironment: [],
      dependencies: []
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] max-h-[90vh] flex flex-col p-0">
        <div className="flex-shrink-0 p-6 pb-0">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Template' : 'Create New Template'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update your AI template with modified configuration, prompts, MCP servers, and integrations.'
                : 'Create a comprehensive AI template with model configuration, prompts, MCP servers, and SaaS integrations.'
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex-shrink-0 px-6">
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
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6">
            <TabsContent value="basic" className="space-y-6 mt-4 data-[state=active]:block hidden">
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what your template does and how it helps users..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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

            <TabsContent value="model" className="space-y-6 mt-4 data-[state=active]:block hidden">
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
                      <Select value={formData.modelProvider} onValueChange={(value) => {
                        const defaults = providerDefaults[value as keyof typeof providerDefaults] || providerDefaults.openai;
                        const providerModels = modelsByProvider[value as keyof typeof modelsByProvider];
                        let defaultModel = 'gpt-4o';
                        
                        // Set default model based on provider
                        if (value === 'openai') {
                          defaultModel = 'gpt-4o';
                        } else if (value === 'anthropic') {
                          defaultModel = 'claude-3-5-sonnet-20241022';
                        } else if (value === 'bedrock') {
                          defaultModel = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
                        } else if (value === 'google') {
                          defaultModel = 'gemini-2.5-flash';
                        }
                        
                        setFormData(prev => ({ 
                          ...prev, 
                          modelProvider: value,
                          modelName: defaultModel,
                          temperature: defaults.temperature,
                          maxTokens: defaults.maxTokens,
                          topP: defaults.topP,
                        }));
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="bedrock">Amazon Bedrock</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="custom">Custom Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modelName">Model</Label>
                      {formData.modelProvider === 'custom' ? (
                        <Input
                          id="modelName"
                          value={formData.modelName}
                          onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                          placeholder="Enter custom model name"
                        />
                      ) : (
                        <Select value={formData.modelName} onValueChange={(value) => {
                          setFormData(prev => ({ ...prev, modelName: value }));
                        }}>
                          <SelectTrigger className="text-left">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(modelsByProvider[formData.modelProvider as keyof typeof modelsByProvider] || {}).map(([category, models]) => (
                              <div key={category}>
                                <div className="px-2 py-2 text-sm font-semibold text-muted-foreground bg-muted/30 border-b border-border/50">
                                  {category === 'reasoning' && 'Reasoning Models'}
                                  {category === 'flagship' && 'Flagship Models'}
                                  {category === 'costOptimized' && 'Cost-Optimized Models'}
                                  {category === 'legacy' && 'Legacy Models'}
                                  {category === 'claude4' && 'Claude 4 Series'}
                                  {category === 'claude3_5' && 'Claude 3.5 Series'}
                                  {category === 'claude3' && 'Claude 3 Series'}
                                  {category === 'claude' && 'Claude Models'}
                                  {category === 'titan' && 'Titan Models'}
                                  {category === 'gemini2_5' && 'Gemini 2.5 Series'}
                                  {category === 'gemini2' && 'Gemini 2.0 Series'}
                                  {category === 'gemini1_5' && 'Gemini 1.5 Series'}
                                </div>
                                {models.map((model: any) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{model.name}</span>
                                      <span className="text-xs text-muted-foreground">{model.description}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* Common Parameters for all providers */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max={formData.modelProvider === 'openai' ? 2 : 1}
                        value={formData.temperature}
                        onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) || providerDefaults[prev.modelProvider as keyof typeof providerDefaults].temperature }))}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.modelProvider === 'openai' ? 'Ranges from 0-2. Higher values = more random output. Default: 1.0' : 
                         formData.modelProvider === 'anthropic' ? 'Ranges from 0-1. Higher values = more random output. Default: 0.0' : 
                         'Controls randomness of the output. Higher values = more random.'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <Input
                        id="maxTokens"
                        type="number"
                        min="1"
                        max={formData.modelProvider === 'openai' ? 8192 : formData.modelProvider === 'anthropic' ? 4096 : 8000}
                        value={formData.maxTokens}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || providerDefaults[prev.modelProvider as keyof typeof providerDefaults].maxTokens }))}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.modelProvider === 'openai' ? 'Maximum tokens to generate. Model-specific limits apply.' : 
                         formData.modelProvider === 'anthropic' ? 'Maximum tokens to generate. Default: 256' : 
                         'Maximum tokens to generate in response.'}
                      </p>
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
                        onChange={(e) => setFormData(prev => ({ ...prev, topP: parseFloat(e.target.value) || providerDefaults[prev.modelProvider as keyof typeof providerDefaults].topP }))}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.modelProvider === 'openai' ? 'Alternative to temperature. Default: 1.0' : 
                         formData.modelProvider === 'anthropic' ? 'Controls diversity via nucleus sampling.' : 
                         'Controls diversity of token selection.'}
                      </p>
                    </div>
                  </div>
                  
                  {/* OpenAI Specific Parameters */}
                  {formData.modelProvider === 'openai' && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
                        <Input
                          id="frequencyPenalty"
                          type="number"
                          step="0.1"
                          min="-2"
                          max="2"
                          defaultValue="0"
                          onChange={(e) => setFormData(prev => ({ ...prev, frequencyPenalty: parseFloat(e.target.value) || 0 }))}
                        />
                        <p className="text-xs text-muted-foreground">Penalizes repeated tokens. Range: -2.0 to 2.0. Default: 0</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presencePenalty">Presence Penalty</Label>
                        <Input
                          id="presencePenalty"
                          type="number"
                          step="0.1"
                          min="-2"
                          max="2"
                          defaultValue="0"
                          onChange={(e) => setFormData(prev => ({ ...prev, presencePenalty: parseFloat(e.target.value) || 0 }))}
                        />
                        <p className="text-xs text-muted-foreground">Penalizes tokens based on appearance in text. Range: -2.0 to 2.0. Default: 0</p>
                      </div>
                    </div>
                  )}

                  {/* Anthropic Specific Parameters */}
                  {formData.modelProvider === 'anthropic' && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="topK">Top K</Label>
                        <Input
                          id="topK"
                          type="number"
                          min="0"
                          defaultValue="5"
                          onChange={(e) => setFormData(prev => ({ ...prev, topK: parseInt(e.target.value) || 5 }))}
                        />
                        <p className="text-xs text-muted-foreground">Limits sampling to top K tokens. Higher values increase diversity.</p>
                      </div>
                    </div>
                  )}

                  {/* Amazon Bedrock Specific Parameters */}
                  {formData.modelProvider === 'bedrock' && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="guardrailId">Guardrail ID</Label>
                        <Input
                          id="guardrailId"
                          type="text"
                          placeholder="Optional guardrail ID"
                          onChange={(e) => setFormData(prev => ({ ...prev, guardrailId: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground">Amazon Bedrock guardrail ID for content filtering</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardrailVersion">Guardrail Version</Label>
                        <Input
                          id="guardrailVersion"
                          type="text"
                          placeholder="Optional guardrail version"
                          onChange={(e) => setFormData(prev => ({ ...prev, guardrailVersion: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground">Amazon Bedrock guardrail version</p>
                      </div>
                    </div>
                  )}

                  {/* Google Specific Parameters */}
                  {formData.modelProvider === 'google' && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="topK">Top K</Label>
                        <Input
                          id="topK"
                          type="number"
                          min="1"
                          max="100"
                          defaultValue="40"
                          onChange={(e) => setFormData(prev => ({ ...prev, topK: parseInt(e.target.value) || 40 }))}
                        />
                        <p className="text-xs text-muted-foreground">Limits sampling to top K tokens. Range: 1-100. Default: 40</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="safetySettings">Safety Settings</Label>
                        <Input
                          id="safetySettings"
                          type="text"
                          placeholder="JSON array of safety settings"
                          onChange={(e) => setFormData(prev => ({ ...prev, safetySettings: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground">Configure safety thresholds for content filtering</p>
                      </div>
                    </div>
                  )}
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

            <TabsContent value="integrations" className="space-y-6 mt-4 data-[state=active]:block hidden">
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

              {/* Execution Environment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    <span>Execution Environment</span>
                  </CardTitle>
                  <CardDescription>Record the actual infrastructure the agent template executes on</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Select
                      value={newExecutionEnvironment.infrastructure}
                      onValueChange={(value) => setNewExecutionEnvironment(prev => ({ ...prev, infrastructure: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select infrastructure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vscode">VS Code</SelectItem>
                        <SelectItem value="cursor">Cursor</SelectItem>
                        <SelectItem value="claude-code">Claude Code</SelectItem>
                        <SelectItem value="jupyter">Jupyter Notebook</SelectItem>
                        <SelectItem value="github-codespaces">GitHub Codespaces</SelectItem>
                        <SelectItem value="replit">Replit</SelectItem>
                        <SelectItem value="colab">Google Colab</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Specific requirements (e.g., install ROO CODE plugin in VS Code, Python 3.9+, Node.js 16+)"
                      value={newExecutionEnvironment.requirements}
                      onChange={(e) => setNewExecutionEnvironment(prev => ({ ...prev, requirements: e.target.value }))}
                      rows={3}
                    />
                    <Button
                      type="button"
                      onClick={handleAddExecutionEnvironment}
                      disabled={!newExecutionEnvironment.infrastructure.trim()}
                      size="sm"
                    >
                      Add Execution Environment
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.executionEnvironment.map((env, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium capitalize">{env?.infrastructure?.replace('-', ' ') || 'Unknown'}</div>
                          {env?.requirements && <div className="text-sm text-muted-foreground">{env.requirements}</div>}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExecutionEnvironment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 mt-4 data-[state=active]:block hidden">
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
        </div>

        <div className="flex-shrink-0 p-6 pt-0">
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{isEditing ? 'Update Template' : 'Create Template'}</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}