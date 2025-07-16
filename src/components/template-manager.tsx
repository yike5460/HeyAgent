"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { 
  Plus, 
  Upload, 
  Download, 
  Copy, 
  Edit, 
  Trash2, 
  Eye, 
  FileJson,
  GitBranch,
  Save,
  X
} from "lucide-react"
import { PromptTemplate, IndustryVertical, MCPServerConfig, ExecutionEnvironment, TemplateParameter } from "@/types"

interface TemplateManagerProps {
  templates: PromptTemplate[]
  onTemplateCreate: (template: Partial<PromptTemplate>) => void
  onTemplateUpdate: (id: string, template: Partial<PromptTemplate>) => void
  onTemplateDelete: (id: string) => void
  onTemplateClone: (id: string) => void
  onTemplateImport: (templates: PromptTemplate[]) => void
}

interface TemplateFormData {
  title: string
  description: string
  industry: IndustryVertical
  useCase: string
  category: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  systemPrompt: string
  userPromptTemplate: string
  parameters: TemplateParameter[]
  constraints: {
    maxTokens: number
    temperature: number
    topP: number
  }
  tags: string[]
  mcpServers: MCPServerConfig[]
  executionEnvironment: ExecutionEnvironment[]
  estimatedRuntime: number
  dependencies: string[]
}

const industryOptions: IndustryVertical[] = [
  'Media & Entertainment',
  'Healthcare & Life Science',
  'Retail',
  'Manufacturing',
  'Automotive',
  'Financial Services',
  'Gaming'
]

export function TemplateManager({
  templates,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  onTemplateClone,
  onTemplateImport
}: TemplateManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [creationMode, setCreationMode] = useState<'scratch' | 'clone' | 'inherit'>('scratch')
  const [parentTemplate, setParentTemplate] = useState<PromptTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [industryFilter, setIndustryFilter] = useState<IndustryVertical | 'all'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    description: '',
    industry: 'Media & Entertainment',
    useCase: '',
    category: 'Custom',
    complexity: 'intermediate',
    systemPrompt: '',
    userPromptTemplate: '',
    parameters: [],
    constraints: {
      maxTokens: 2000,
      temperature: 0.7,
      topP: 1.0
    },
    tags: [],
    mcpServers: [],
    executionEnvironment: [],
    estimatedRuntime: 60,
    dependencies: []
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      industry: 'Media & Entertainment',
      useCase: '',
      category: 'Custom',
      complexity: 'intermediate',
      systemPrompt: '',
      userPromptTemplate: '',
      parameters: [],
      constraints: {
        maxTokens: 2000,
        temperature: 0.7,
        topP: 1.0
      },
      tags: [],
      mcpServers: [],
      executionEnvironment: [],
      estimatedRuntime: 60,
      dependencies: []
    })
    setCreationMode('scratch')
    setParentTemplate(null)
  }

  const handleCreateFromScratch = () => {
    resetForm()
    setCreationMode('scratch')
    setIsCreateDialogOpen(true)
  }

  const handleClone = (template: PromptTemplate) => {
    setFormData(prev => ({
      ...prev,
      title: `${template.title} (Copy)`,
      description: template.description,
      industry: template.industry,
      useCase: template.useCase,
      systemPrompt: template.promptConfig.systemPrompt,
      userPromptTemplate: template.promptConfig.userPromptTemplate,
      tags: [...template.tags],
      mcpServers: template.mcpServers,
      executionEnvironment: template.executionEnvironment
    }))
    setCreationMode('clone')
    setParentTemplate(template)
    setIsCreateDialogOpen(true)
  }

  const handleInherit = (template: PromptTemplate) => {
    setFormData(prev => ({
      ...prev,
      title: '',
      description: '',
      industry: template.industry,
      useCase: template.useCase,
      systemPrompt: template.promptConfig.systemPrompt,
      userPromptTemplate: '',
      tags: [...template.tags],
      mcpServers: template.mcpServers,
      executionEnvironment: template.executionEnvironment
    }))
    setCreationMode('inherit')
    setParentTemplate(template)
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      industry: template.industry,
      useCase: template.useCase,
      systemPrompt: template.promptConfig.systemPrompt,
      userPromptTemplate: template.promptConfig.userPromptTemplate,
      tags: [...template.tags],
      mcpServers: template.mcpServers,
      executionEnvironment: template.executionEnvironment
    }))
    setIsEditDialogOpen(true)
  }

  const handlePreview = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewDialogOpen(true)
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (!formData.title.trim()) errors.push("Title is required")
    if (!formData.description.trim()) errors.push("Description is required")
    if (!formData.useCase.trim()) errors.push("Use case is required")
    if (formData.title.length < 3) errors.push("Title must be at least 3 characters")
    if (formData.description.length < 10) errors.push("Description must be at least 10 characters")
    
    return errors
  }

  const handleSubmit = async () => {
    const validationErrors = validateForm()
    
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(", "),
        variant: "destructive"
      })
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
        parameters: [],
        constraints: {
          maxTokens: 2000,
          temperature: 0.7
        }
      },
      tags: formData.tags,
      mcpServers: [], // TODO: Map from server IDs to full configs
      executionEnvironment: [], // TODO: Map from provider names to full configs
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
        category: 'Custom',
        complexity: 'intermediate',
        estimatedRuntime: 60,
        resourceRequirements: {
          cpu: '0.5',
          memory: '1Gi',
          storage: '10Gi',
          network: true
        },
        dependencies: [],
        changelog: [{
          version: '1.0.0',
          date: new Date().toISOString().split('T')[0],
          changes: ['Initial creation'],
          author: 'Current User'
        }]
      },
      version: 1,
      status: 'draft',
      rating: 0,
      usageCount: 0
    }

    try {
      if (isEditDialogOpen && selectedTemplate) {
        await onTemplateUpdate(selectedTemplate.id, templateData)
        setIsEditDialogOpen(false)
        toast({
          title: "Template Updated",
          description: "Template has been successfully updated."
        })
      } else {
        await onTemplateCreate(templateData)
        setIsCreateDialogOpen(false)
        toast({
          title: "Template Created",
          description: "Template has been successfully created."
        })
      }
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleExport = (template?: PromptTemplate) => {
    const dataToExport = template ? [template] : templates
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `templates_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Export Complete",
      description: `${dataToExport.length} template(s) exported successfully.`
    })
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedTemplates = JSON.parse(content) as PromptTemplate[]
        
        if (!Array.isArray(importedTemplates)) {
          throw new Error('Invalid file format')
        }

        onTemplateImport(importedTemplates)
        toast({
          title: "Import Complete",
          description: `${importedTemplates.length} template(s) imported successfully.`
        })
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import templates. Please check the file format.",
          variant: "destructive"
        })
      }
    }
    reader.readAsText(file)
  }

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setFormData(prev => ({ ...prev, tags }))
  }

  // Filter templates based on search and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter
    const matchesIndustry = industryFilter === 'all' || template.industry === industryFilter
    
    return matchesSearch && matchesStatus && matchesIndustry
  })

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Template Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={() => handleExport()}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button onClick={handleCreateFromScratch}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 items-center p-4 bg-muted/50 rounded-lg">
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Search templates by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

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
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTemplates.length} of {templates.length} templates
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No templates found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters, or create a new template
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
          <Card key={template.id} className="group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{template.industry}</Badge>
                    <Badge variant="outline" className={
                      template.status === 'published' ? 'bg-green-100 text-green-800' :
                      template.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {template.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
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

              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => handlePreview(template)}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(template)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleClone(template)}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleInherit(template)}>
                  <GitBranch className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport(template)}>
                  <FileJson className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onTemplateDelete(template.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false)
          setIsEditDialogOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? 'Edit Template' : 
               creationMode === 'clone' ? `Clone Template from "${parentTemplate?.title}"` :
               creationMode === 'inherit' ? `Inherit from "${parentTemplate?.title}"` :
               'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? 'Modify the template details below.' :
               creationMode === 'clone' ? 'Create a copy of the selected template with modifications.' :
               creationMode === 'inherit' ? 'Create a new template inheriting configuration from the parent.' :
               'Fill in the details to create a new template from scratch.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter template title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter template description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value: IndustryVertical) => 
                  setFormData(prev => ({ ...prev, industry: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="useCase">Use Case</Label>
                <Input
                  id="useCase"
                  value={formData.useCase}
                  onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                  placeholder="Enter use case"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={formData.systemPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                placeholder="Enter system prompt"
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userPromptTemplate">User Prompt Template</Label>
              <Textarea
                id="userPromptTemplate"
                value={formData.userPromptTemplate}
                onChange={(e) => setFormData(prev => ({ ...prev, userPromptTemplate: e.target.value }))}
                placeholder="Enter user prompt template with {parameters}"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false)
              setIsEditDialogOpen(false)
              resetForm()
            }}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {isEditDialogOpen ? 'Update' : 'Create'} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview: {selectedTemplate?.title}</DialogTitle>
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
                  <h4 className="font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.tags && selectedTemplate.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">MCP Servers</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.mcpServers && selectedTemplate.mcpServers.map((server) => (
                      <Badge key={server.serverId} variant="outline">
                        {server.serverId}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Execution Environment</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.executionEnvironment && selectedTemplate.executionEnvironment.map((env, index) => (
                      <Badge key={index} variant="outline">
                        {env?.infrastructure?.replace('-', ' ') || 'Unknown'} {env?.requirements && `(${env.requirements.substring(0, 20)}...)`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 