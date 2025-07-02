"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  Users, 
  Clock, 
  Play, 
  Copy, 
  MoreHorizontal,
  Zap,
  Database,
  GitBranch,
  Eye,
  Download
} from "lucide-react"
import { formatDate, formatNumber } from "@/lib/utils"
import { PromptTemplate } from "@/types"

interface TemplateCardProps {
  template: PromptTemplate
  onPreview?: (template: PromptTemplate) => void
  onClone?: (template: PromptTemplate) => void
  onFork?: (template: PromptTemplate) => void
  onExport?: (template: PromptTemplate) => void
  variant?: 'default' | 'compact'
}

export function TemplateCard({ 
  template, 
  onPreview, 
  onClone, 
  onFork, 
  onExport,
  variant = 'default' 
}: TemplateCardProps) {
  const getIndustryColor = (industry: string) => {
    const colors: Record<string, string> = {
      'Media & Entertainment': 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15',
      'Healthcare & Life Science': 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-400/20',
      'Retail': 'bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/15 dark:text-blue-400 dark:border-blue-400/20',
      'Manufacturing': 'bg-slate-500/10 text-slate-700 border-slate-500/20 hover:bg-slate-500/15 dark:text-slate-400 dark:border-slate-400/20',
      'Automotive': 'bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/15 dark:text-orange-400 dark:border-orange-400/20',
      'Financial Services': 'bg-violet-500/10 text-violet-700 border-violet-500/20 hover:bg-violet-500/15 dark:text-violet-400 dark:border-violet-400/20',
      'Gaming': 'bg-pink-500/10 text-pink-700 border-pink-500/20 hover:bg-pink-500/15 dark:text-pink-400 dark:border-pink-400/20',
    }
    return colors[industry] || 'bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70'
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner':
        return 'bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/15 dark:text-green-400 dark:border-green-400/20'
      case 'intermediate':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/15 dark:text-amber-400 dark:border-amber-400/20'
      case 'advanced':
        return 'bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/15 dark:text-red-400 dark:border-red-400/20'
      default:
        return 'bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70'
    }
  }

  const mcpServers = template.mcpServers || []
  const saasIntegrations = template.saasIntegrations || []

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card relative overflow-hidden h-[340px] flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0 px-4 pt-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 flex-1 min-w-0">
            <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors cursor-pointer leading-tight">
              <Link href={`/templates/${template.id}`}>
                {template.title}
              </Link>
            </CardTitle>
            <div className="flex items-center space-x-1.5 flex-wrap gap-1">
              <Badge 
                variant="outline" 
                className={`${getIndustryColor(template.industry)} transition-colors text-xs font-medium px-2 py-0.5`}
              >
                {template.industry}
              </Badge>
              <Badge 
                variant="outline" 
                className={`${getComplexityColor(template.metadata.complexity)} transition-colors text-xs font-medium px-2 py-0.5`}
              >
                {template.metadata.complexity}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground flex-shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
            <span className="font-medium text-xs">{template.rating}</span>
          </div>
        </div>
        
        <CardDescription className="line-clamp-2 text-xs leading-relaxed">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-3 min-h-0 px-4 pb-3">
        {/* Main content area with flex-grow */}
        <div className="space-y-2.5 flex-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className={`text-xs font-normal transition-colors px-1.5 py-0.5 ${
                  index % 3 === 0 ? 'bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary/30' :
                  index % 3 === 1 ? 'bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30' :
                  'bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70'
                }`}
              >
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs font-normal bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors px-1.5 py-0.5"
              >
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* MCP Servers & Integrations */}
          {(mcpServers.length > 0 || saasIntegrations.length > 0) && (
            <div className="space-y-1.5">
              {mcpServers.length > 0 && (
                <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                  <Database className="h-3 w-3 flex-shrink-0 text-secondary" />
                  <span className="font-medium">MCP:</span>
                  <div className="flex space-x-1 flex-wrap min-w-0">
                    {mcpServers.slice(0, 2).map((server) => (
                      <Badge 
                        key={server.serverId} 
                        variant="outline" 
                        className="text-xs bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/15 transition-colors px-1.5 py-0.5"
                      >
                        {server.serverType}
                      </Badge>
                    ))}
                    {mcpServers.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/15 transition-colors px-1.5 py-0.5"
                      >
                        +{mcpServers.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {saasIntegrations.length > 0 && (
                <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3 flex-shrink-0 text-primary" />
                  <span className="font-medium">SaaS:</span>
                  <div className="flex space-x-1 flex-wrap min-w-0">
                    {saasIntegrations.slice(0, 2).map((integration) => (
                      <Badge 
                        key={integration.provider} 
                        variant="outline" 
                        className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors px-1.5 py-0.5"
                      >
                        {integration.provider}
                      </Badge>
                    ))}
                    {saasIntegrations.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors px-1.5 py-0.5"
                      >
                        +{saasIntegrations.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed bottom section */}
        <div className="space-y-2.5 flex-shrink-0">
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-primary" />
                <span className="font-medium">{template.usageCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitBranch className="h-3 w-3 text-secondary" />
                <span className="font-medium">{template.forkCount}</span>
              </div>
            </div>
            <span className="text-xs truncate max-w-[100px]">by {template.author}</span>
          </div>

          {/* Actions - Always at bottom */}
          <div className="flex space-x-1 w-full">
            {onPreview && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onPreview(template)}
                className="group/btn hover:border-primary/30 hover:bg-primary/5 flex-1 h-7"
              >
                <Eye className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-primary" />
              </Button>
            )}
            {onClone && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onClone(template)}
                className="group/btn hover:border-secondary/30 hover:bg-secondary/5 flex-1 h-7"
              >
                <Copy className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-secondary" />
              </Button>
            )}
            {onFork && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onFork(template)}
                className="group/btn hover:border-accent/30 hover:bg-accent/5 flex-1 h-7"
              >
                <GitBranch className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-accent-foreground" />
              </Button>
            )}
            {onExport && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onExport(template)}
                className="group/btn hover:border-muted-foreground/30 hover:bg-muted/50 flex-1 h-7"
              >
                <Download className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Hover effect bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Card>
  )
}