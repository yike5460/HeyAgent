"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TemplateVisualization } from '@/components/template-visualization'
import { toast } from '@/components/ui/use-toast'
import { PromptTemplate } from '@/types'
import { 
  Star, 
  Users, 
  GitBranch, 
  Download, 
  Copy, 
  Play, 
  Eye,
  Settings,
  FileJson,
  GitMerge,
  Brain,
  MessageSquare,
  Database,
  Cloud
} from 'lucide-react'

interface TemplateDetailsPanelProps {
  template: PromptTemplate | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUseTemplate?: (template: PromptTemplate) => void
  onCloneTemplate?: (template: PromptTemplate) => void
  onForkTemplate?: (template: PromptTemplate) => void
}

export function TemplateDetailsPanel({ 
  template, 
  isOpen, 
  onOpenChange,
  onUseTemplate,
  onCloneTemplate,
  onForkTemplate
}: TemplateDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!template) return null

  const handleUseTemplate = () => {
    if (onUseTemplate) {
      onUseTemplate(template)
    } else {
      toast({
        title: "Use Template",
        description: `Template "${template.title}" will be used in sandbox.`
      })
    }
  }

  const handleCloneTemplate = () => {
    if (onCloneTemplate) {
      onCloneTemplate(template)
    } else {
      toast({
        title: "Clone Template",
        description: `Template "${template.title}" will be cloned to your workspace.`
      })
    }
  }

  const handleForkTemplate = () => {
    if (onForkTemplate) {
      onForkTemplate(template)
    } else {
      toast({
        title: "Fork Template",
        description: `Template "${template.title}" will be forked to your workspace.`
      })
    }
  }

  const handleExportTemplate = () => {
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{template.title}</DialogTitle>
              <DialogDescription className="text-base">
                {template.description}
              </DialogDescription>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>by {template.author}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{template.usageCount.toLocaleString()} uses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitBranch className="h-4 w-4" />
                  <span>{template.forkCount} forks</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUseTemplate} className="bg-primary hover:bg-primary/90">
                <Play className="h-4 w-4 mr-2" />
                Use Template
              </Button>
              <Button variant="outline" onClick={handleCloneTemplate}>
                <Copy className="h-4 w-4 mr-2" />
                Clone
              </Button>
              <Button variant="outline" onClick={handleForkTemplate}>
                <GitBranch className="h-4 w-4 mr-2" />
                Fork
              </Button>
              <Button variant="outline" onClick={handleExportTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="visualization" className="flex items-center space-x-2">
                <GitMerge className="h-4 w-4" />
                <span>Workflow</span>
              </TabsTrigger>
              <TabsTrigger value="configuration" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configuration</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center space-x-2">
                <FileJson className="h-4 w-4" />
                <span>JSON</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="overview" className="space-y-6 mt-0 h-full overflow-y-auto">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Template Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Industry</h4>
                          <Badge variant="secondary">{template.industry}</Badge>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Use Case</h4>
                          <p className="text-sm">{template.useCase}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Complexity</h4>
                          <Badge variant="outline" className={
                            template.metadata.complexity === 'beginner' ? 'bg-green-100 text-green-800' :
                            template.metadata.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {template.metadata.complexity}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                          <p className="text-sm">{template.metadata.category}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>

                {template.mcpServers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>MCP Servers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {template.mcpServers.map((server, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <h4 className="font-medium">{server.serverId}</h4>
                              <p className="text-sm text-muted-foreground">{server.serverType}</p>
                            </div>
                            <Badge variant="outline">{server.tools.length} tools</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {template.saasIntegrations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>SaaS Integrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {template.saasIntegrations.map((integration, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <h4 className="font-medium">{integration.service}</h4>
                              <p className="text-sm text-muted-foreground">{integration.provider}</p>
                            </div>
                            <Badge variant="outline">{integration.configuration.version}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="visualization" className="mt-0 h-full overflow-y-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Template Workflow</CardTitle>
                    <CardDescription>
                      Visual representation of how this template orchestrates AI components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 px-4">
                      {/* Main Orchestration Container */}
                      <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 mb-6">
                        {/* Orchestration Label */}
                        <div className="absolute -top-3 left-6 bg-background px-2">
                          <span className="text-sm font-semibold text-muted-foreground">Orchestration</span>
                        </div>

                        {/* Components Flow */}
                        <div className="flex items-center justify-center space-x-4 overflow-x-auto">
                          {/* Prompt Component */}
                          <div className="flex flex-col items-center min-w-0">
                            <div className="w-28 h-16 border-2 border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-950 shadow-sm transition-colors">
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300 text-center px-2">Prompt</span>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="flex items-center flex-shrink-0">
                            <div className="w-6 h-0.5 bg-muted-foreground/60"></div>
                            <div className="w-0 h-0 border-l-[6px] border-l-muted-foreground/60 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
                          </div>

                          {/* Model Component */}
                          <div className="flex flex-col items-center min-w-0">
                            <div className="w-28 h-16 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-950 shadow-sm transition-colors">
                              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 text-center px-2">Model</span>
                            </div>
                          </div>

                          {/* Conditional MCP Servers */}
                          {template.mcpServers.length > 0 && (
                            <>
                              {/* Arrow */}
                              <div className="flex items-center flex-shrink-0">
                                <div className="w-6 h-0.5 bg-muted-foreground/60"></div>
                                <div className="w-0 h-0 border-l-[6px] border-l-muted-foreground/60 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
                              </div>

                              {/* Tool/MCP Server Component */}
                              <div className="flex flex-col items-center min-w-0">
                                <div className="w-28 h-16 border-2 border-purple-200 dark:border-purple-800 rounded-lg flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-950 shadow-sm transition-colors px-1">
                                  <span className="text-xs font-medium text-purple-700 dark:text-purple-300 text-center leading-tight">Tool/MCP</span>
                                  <span className="text-xs font-medium text-purple-700 dark:text-purple-300 text-center leading-tight">Server</span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Conditional SaaS API */}
                          {template.saasIntegrations.filter(s => !s.capabilities.some(c => c.type === 'text-generation')).length > 0 && (
                            <>
                              {/* Arrow */}
                              <div className="flex items-center flex-shrink-0">
                                <div className="w-6 h-0.5 bg-muted-foreground/60"></div>
                                <div className="w-0 h-0 border-l-[6px] border-l-muted-foreground/60 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
                              </div>

                              {/* SaaS API Component */}
                              <div className="flex flex-col items-center min-w-0">
                                <div className="w-28 h-16 border-2 border-orange-200 dark:border-orange-800 rounded-lg flex items-center justify-center bg-orange-50 dark:bg-orange-950 shadow-sm transition-colors">
                                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300 text-center px-2">SaaS API</span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Conditional Memory/Vector Database */}
                          {template.mcpServers.some(s => s.serverType === 'file-processor') && (
                            <>
                              {/* Arrow */}
                              <div className="flex items-center flex-shrink-0">
                                <div className="w-6 h-0.5 bg-muted-foreground/60"></div>
                                <div className="w-0 h-0 border-l-[6px] border-l-muted-foreground/60 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
                              </div>

                              {/* Memory/Vector Database Component */}
                              <div className="flex flex-col items-center min-w-0">
                                <div className="w-28 h-16 border-2 border-violet-200 dark:border-violet-800 rounded-lg flex flex-col items-center justify-center bg-violet-50 dark:bg-violet-950 shadow-sm transition-colors px-1">
                                  <span className="text-xs font-medium text-violet-700 dark:text-violet-300 text-center leading-tight">Memory/Vector</span>
                                  <span className="text-xs font-medium text-violet-700 dark:text-violet-300 text-center leading-tight">Database</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* E2B/Sandbox Component - Aligned with Orchestration width */}
                      <div className="relative border-2 border-dashed border-amber-200 dark:border-amber-800 rounded-xl p-4 bg-amber-50/50 dark:bg-amber-950/20">
                        <div className="flex items-center justify-center">
                          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">E2B/Sandbox</span>
                        </div>
                      </div>
                    </div>

                    {/* Workflow Description */}
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Workflow Description</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This template follows a linear orchestration flow within a controlled environment: 
                        The <strong>Prompt</strong> is processed by the <strong>Model</strong> to generate responses.
                        {template.mcpServers.length > 0 && (
                          <span> <strong>Tool/MCP Servers</strong> provide enhanced capabilities for data processing and external tool access.</span>
                        )}
                        {template.saasIntegrations.filter(s => !s.capabilities.some(c => c.type === 'text-generation')).length > 0 && (
                          <span> <strong>SaaS APIs</strong> integrate external services for specialized functionality.</span>
                        )}
                        {template.mcpServers.some(s => s.serverType === 'file-processor') && (
                          <span> <strong>Memory/Vector Database</strong> systems store and retrieve contextual information.</span>
                        )}
                        <span> The entire workflow runs within an <strong>E2B/Sandbox</strong> environment for secure execution.</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="configuration" className="mt-0 h-full">
                <div className="h-full overflow-y-auto pr-2">
                  <div className="space-y-6 pb-6">
                {/* Model Configuration Block */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <span>Model Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Unified grid layout for all model configuration options */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      <div>
                        <h4 className="font-medium text-xs text-muted-foreground mb-1">Provider</h4>
                        <div className="bg-muted px-3 py-2 rounded-md">
                          <p className="text-sm font-medium text-left truncate">
                            {template.saasIntegrations.find(s => s.capabilities.some(c => c.type === 'text-generation'))?.provider || 'OpenAI'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-xs text-muted-foreground mb-1">Model</h4>
                        <div className="bg-muted px-3 py-2 rounded-md">
                          <p className="text-sm font-medium text-left truncate">
                            {template.saasIntegrations.find(s => s.capabilities.some(c => c.type === 'text-generation'))?.service || 'gpt-4'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-xs text-muted-foreground mb-1">Temperature</h4>
                        <div className="bg-muted px-3 py-2 rounded-md">
                          <p className="text-sm font-mono font-medium text-left">{template.promptConfig.constraints.temperature || 0.7}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-xs text-muted-foreground mb-1">Max Tokens</h4>
                        <div className="bg-muted px-3 py-2 rounded-md">
                          <p className="text-sm font-mono font-medium text-left">{template.promptConfig.constraints.maxTokens || 4096}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-xs text-muted-foreground mb-1">Top P</h4>
                        <div className="bg-muted px-3 py-2 rounded-md">
                          <p className="text-sm font-mono font-medium text-left">{template.promptConfig.constraints.topP || 1.0}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prompt Configuration Block */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-secondary" />
                      </div>
                      <span>Prompt Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-xs text-muted-foreground mb-1">
                        System Prompt 
                        <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                      </h4>
                      <div className="bg-muted rounded-md p-3 max-h-[120px] overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                          {template.promptConfig.systemPrompt || "No system prompt configured"}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-xs text-muted-foreground mb-1">
                        User Prompt Template 
                        <span className="text-xs text-destructive ml-1">(Required)</span>
                      </h4>
                      <div className="bg-muted rounded-md p-3 max-h-[120px] overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap font-mono">
                          {template.promptConfig.userPromptTemplate}
                        </pre>
                      </div>
                    </div>
                    {template.promptConfig.parameters.length > 0 && (
                      <div>
                        <details className="group">
                          <summary className="cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors list-none">
                            <h4 className="font-medium text-sm text-muted-foreground inline-flex items-center gap-2">
                              <svg 
                                className="h-4 w-4 transition-transform group-open:rotate-90" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              Template Parameters ({template.promptConfig.parameters.length})
                            </h4>
                          </summary>
                          <div className="mt-2 space-y-2">
                      {template.promptConfig.parameters.map((param) => (
                        <div key={param.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{param.name}</span>
                              <Badge variant="outline" className="text-xs">{param.type}</Badge>
                              {param.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{param.description}</p>
                            {param.defaultValue && (
                              <p className="text-xs text-muted-foreground">Default: {param.defaultValue}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                        </details>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* MCP Servers Block */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Database className="h-4 w-4 text-accent" />
                      </div>
                      <span>MCP Servers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {template.mcpServers.length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {template.mcpServers.map((server, index) => (
                          <div key={index} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="font-medium">{server.serverId}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {server.serverType === 'firecrawl' && 'Web scraping and content extraction from websites and documents'}
                                  {server.serverType === 'api-integrator' && 'Unified interface for external API integrations and data processing'}
                                  {server.serverType === 'file-processor' && 'File upload, processing, and format conversion capabilities'}
                                  {server.serverType === 'custom' && 'Custom server implementation with specialized functionality'}
                                </p>
                              </div>
                              <Badge variant="outline">{server.tools.length} tools</Badge>
                            </div>
                            <details className="group">
                              <summary className="cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors list-none">
                                <h5 className="font-medium text-sm text-muted-foreground inline-flex items-center gap-2">
                                  <svg 
                                    className="h-4 w-4 transition-transform group-open:rotate-90" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                  JSON Configuration
                                </h5>
                              </summary>
                              <div className="mt-2">
                                <div className="relative max-h-64 overflow-y-auto bg-muted rounded-md">
                                  <pre className="text-xs p-3 whitespace-pre-wrap">
                                    {JSON.stringify(server.configuration, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </details>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="h-12 w-12 rounded-lg bg-muted mx-auto mb-3 flex items-center justify-center">
                          <div className="h-6 w-6 rounded-sm bg-muted-foreground/20" />
                        </div>
                        <p className="text-sm">No MCP servers configured</p>
                        <p className="text-xs mt-1">This template operates without external MCP server integrations</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* SaaS API Block */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Cloud className="h-4 w-4 text-primary" />
                      </div>
                      <span>SaaS API Integrations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {template.saasIntegrations.length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {template.saasIntegrations.map((integration, index) => (
                          <div key={index} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="font-medium">{integration.provider}</h4>
                                <p className="text-sm text-muted-foreground">{integration.service}</p>
                              </div>
                              <Badge variant="outline">{integration.configuration.version}</Badge>
                            </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                                <h5 className="font-medium text-sm text-muted-foreground mb-1">Provider Name</h5>
                                <p className="text-sm bg-muted p-2 rounded">{integration.provider}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm text-muted-foreground mb-1">API Endpoint URL</h5>
                                <p className="text-sm bg-muted p-2 rounded font-mono text-xs break-all">
                                  {integration.configuration.endpoint}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm text-muted-foreground">Capabilities</h5>
                              <div className="flex flex-wrap gap-2">
                                {integration.capabilities.map((capability, capIndex) => (
                                  <Badge key={capIndex} variant="secondary" className="text-xs">
                                    {capability.type.replace('-', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="h-12 w-12 rounded-lg bg-muted mx-auto mb-3 flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full bg-muted-foreground/20" />
                        </div>
                        <p className="text-sm">No SaaS API integrations configured</p>
                        <p className="text-xs mt-1">This template operates with standard model capabilities only</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-6 mt-0 h-full overflow-y-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Template JSON</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="text-xs bg-slate-950 text-slate-100 p-4 rounded-md overflow-x-auto max-h-96 border font-mono">
                        <details className="cursor-pointer">
                          <summary className="text-slate-400 hover:text-slate-200 transition-colors mb-2 select-none">
                            📋 Click to expand/collapse JSON structure
                          </summary>
                          <pre className="whitespace-pre-wrap text-slate-100">
                      {JSON.stringify(template, null, 2)}
                    </pre>
                        </details>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(template, null, 2))
                          toast({
                            title: "Copied to clipboard",
                            description: "Template JSON has been copied to your clipboard."
                          })
                        }}
                        className="absolute top-2 right-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded border border-slate-600 transition-colors"
                      >
                        Copy JSON
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}