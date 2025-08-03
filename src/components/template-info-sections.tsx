"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PromptTemplate } from '@/types'
import { Brain, MessageSquare, Database, Cloud, Settings, Package } from 'lucide-react'

interface TemplateInfoSectionsProps {
  template: PromptTemplate
  mode?: 'view' | 'edit'
}

export function TemplateInfoSections({ template, mode = 'view' }: TemplateInfoSectionsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Basic Information</span>
          </CardTitle>
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
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Runtime (est.)</h4>
              <p className="text-sm">{template.metadata.estimatedRuntime || 'N/A'}min</p>
            </div>
          </div>
          
          {template.tags && template.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Configuration */}
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
                  {template.promptConfig?.model?.provider || 
                   template.executionEnvironment?.find(s => s.infrastructure)?.infrastructure || 'OpenAI'}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-xs text-muted-foreground mb-1">Model</h4>
              <div className="bg-muted px-3 py-2 rounded-md">
                <p className="text-sm font-medium text-left truncate">
                  {template.promptConfig?.model?.name || 
                   template.executionEnvironment?.find(s => s.infrastructure)?.requirements || 'gpt-4'}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-xs text-muted-foreground mb-1">Temperature</h4>
              <div className="bg-muted px-3 py-2 rounded-md">
                <p className="text-sm font-mono font-medium text-left">
                  {template.promptConfig?.model?.parameters?.temperature || 
                   template.promptConfig?.constraints?.temperature || 0.7}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-xs text-muted-foreground mb-1">Max Tokens</h4>
              <div className="bg-muted px-3 py-2 rounded-md">
                <p className="text-sm font-mono font-medium text-left">
                  {template.promptConfig?.model?.parameters?.maxTokens || 
                   template.promptConfig?.constraints?.maxTokens || 4096}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-xs text-muted-foreground mb-1">Top P</h4>
              <div className="bg-muted px-3 py-2 rounded-md">
                <p className="text-sm font-mono font-medium text-left">
                  {template.promptConfig?.model?.parameters?.topP || 
                   template.promptConfig?.constraints?.topP || 1.0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prompt Configuration */}
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
                {template.promptConfig?.systemPrompt || "No system prompt configured"}
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
                {template.promptConfig?.userPromptTemplate || "No user prompt template configured"}
              </pre>
            </div>
          </div>
          {template.promptConfig?.parameters && template.promptConfig.parameters.length > 0 && (
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
                    Template Parameters ({template.promptConfig?.parameters?.length || 0})
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

      {/* MCP Servers */}
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
          {template.mcpServers && template.mcpServers.length > 0 ? (
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
                    <Badge variant="outline">{server.tools?.length || 0} tools</Badge>
                  </div>
                  {mode === 'view' && (
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
                  )}
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

      {/* Execution Environment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cloud className="h-4 w-4 text-primary" />
            </div>
            <span>Execution Environment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {template.executionEnvironment && template.executionEnvironment.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {template.executionEnvironment.map((environment, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium capitalize">
                        {environment?.infrastructure?.replace('-', ' ') || 'Unknown'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {typeof environment?.requirements === 'string' 
                          ? environment.requirements 
                          : environment?.requirements || 'No specific requirements'}
                      </p>
                    </div>
                    <Badge variant="outline">Infrastructure</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm text-muted-foreground mb-1">Infrastructure</h5>
                      <p className="text-sm bg-muted p-2 rounded capitalize">
                        {environment?.infrastructure?.replace('-', ' ') || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-muted-foreground mb-1">Requirements</h5>
                      <p className="text-sm bg-muted p-2 rounded font-mono text-xs break-all">
                        {typeof environment?.requirements === 'string' 
                          ? environment.requirements 
                          : JSON.stringify(environment?.requirements || 'No specific requirements')}
                      </p>
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
              <p className="text-sm">No execution environment configured</p>
              <p className="text-xs mt-1">This template operates with standard runtime capabilities only</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span>Dependencies</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {template.metadata?.dependencies && template.metadata.dependencies.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {template.metadata.dependencies.map((dependency, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {dependency}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="h-12 w-12 rounded-lg bg-muted mx-auto mb-3 flex items-center justify-center">
                <div className="h-6 w-6 rounded-sm bg-muted-foreground/20" />
              </div>
              <p className="text-sm">No external dependencies</p>
              <p className="text-xs mt-1">This template operates with built-in capabilities only</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}