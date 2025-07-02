"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Code,
  Network
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
                <Network className="h-4 w-4" />
                <span>Architecture</span>
              </TabsTrigger>
              <TabsTrigger value="configuration" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configuration</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Code</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="overview" className="space-y-6 mt-0">
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

              <TabsContent value="visualization" className="mt-0 h-full">
                <div className="h-[600px]">
                  <TemplateVisualization template={template} className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="configuration" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>System Prompt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap overflow-x-auto">
                      {template.promptConfig.systemPrompt}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Prompt Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap overflow-x-auto">
                      {template.promptConfig.userPromptTemplate}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Max Tokens</h4>
                        <p className="text-sm">{template.promptConfig.constraints.maxTokens}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Temperature</h4>
                        <p className="text-sm">{template.promptConfig.constraints.temperature}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Template JSON</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded-md whitespace-pre-wrap overflow-x-auto max-h-96">
                      {JSON.stringify(template, null, 2)}
                    </pre>
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