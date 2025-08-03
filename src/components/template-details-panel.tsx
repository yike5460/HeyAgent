"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TemplateVisualization } from '@/components/template-visualization'
import { TemplateInfoSections } from '@/components/template-info-sections'
import { toast } from '@/components/ui/use-toast'
import { PromptTemplate } from '@/types'
import { useTemplateRefresh } from '@/hooks/use-template-refresh'
import { 
  Star, 
  Users, 
  GitBranch, 
  Download, 
  Play, 
  Eye,
  Settings,
  FileJson,
  GitMerge,
  Brain,
  MessageSquare,
  Database,
  Cloud,
  BarChart3
} from 'lucide-react'

interface TemplateDetailsPanelProps {
  template: PromptTemplate | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUseTemplate?: (template: PromptTemplate) => void
  onForkTemplate?: (template: PromptTemplate) => void
}

export function TemplateDetailsPanel({ 
  template: propTemplate, 
  isOpen, 
  onOpenChange,
  onUseTemplate,
  onForkTemplate
}: TemplateDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Use the refresh hook to get updated template data when notified
  const { template: refreshedTemplate } = useTemplateRefresh(propTemplate?.id || '', propTemplate || undefined)
  
  // Use refreshed template if available, fallback to prop template
  const template = refreshedTemplate || propTemplate

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
      <DialogContent className="max-w-6xl h-[95vh] max-h-[95vh] flex flex-col p-0">
        <div className="flex-shrink-0 p-6 pb-0">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1 pr-4">
                <DialogTitle className="text-2xl">{template.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {template.description}
                </DialogDescription>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground flex-wrap gap-y-2">
                  <span>by {template.author}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>0</span>
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
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                <Button onClick={handleUseTemplate} className="bg-primary hover:bg-primary/90" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
                <Button variant="outline" onClick={handleForkTemplate} size="sm">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Fork
                </Button>
                <Button variant="outline" onClick={handleExportTemplate} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-hidden min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex-shrink-0 px-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="analytic" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytic</span>
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
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6">
              <TabsContent value="overview" className="space-y-6 mt-4 data-[state=active]:block hidden">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Template Visualization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TemplateVisualization template={template} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytic" className="mt-4 data-[state=active]:block hidden">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>Template Analytics</span>
                    </CardTitle>
                    <CardDescription>
                      Performance insights and usage statistics for this template
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Performance Overview */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Usage Count</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{template.usageCount.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Total executions</div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Fork Count</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{template.forkCount}</div>
                            <div className="text-xs text-muted-foreground">Times forked</div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold flex items-center space-x-1">
                              <span>0</span>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="text-xs text-muted-foreground">Favorite count</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Template Composition */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Template Composition</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="font-medium mb-2">Components</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">MCP Servers</span>
                                  <Badge variant="outline">{template.mcpServers ? template.mcpServers.length : 0}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">Execution Environment</span>
                                  <Badge variant="outline">{template.executionEnvironment ? template.executionEnvironment.length : 0}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">Parameters</span>
                                  <Badge variant="outline">{template.promptConfig?.parameters?.length || 0}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">Dependencies</span>
                                  <Badge variant="outline">{template.metadata?.dependencies?.length || 0}</Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Metadata</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">Complexity</span>
                                  <Badge variant={
                                    template.metadata.complexity === 'beginner' ? 'default' :
                                    template.metadata.complexity === 'intermediate' ? 'secondary' :
                                    'destructive'
                                  }>
                                    {template.metadata.complexity}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">Runtime (est.)</span>
                                  <Badge variant="outline">{template.metadata.estimatedRuntime}min</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">Category</span>
                                  <Badge variant="outline">{template.metadata.category}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">Industry</span>
                                  <Badge variant="outline">{template.industry}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Usage Trend */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Usage Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center mb-4">
                              <div className="text-muted-foreground">
                                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm">Usage analytics chart would appear here</p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              This template has been used {template.usageCount} times and has been favorited by the community
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="configuration" className="mt-4 data-[state=active]:block hidden">
                <TemplateInfoSections template={template} mode="view" />
              </TabsContent>

              <TabsContent value="code" className="space-y-6 mt-4 data-[state=active]:block hidden">
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