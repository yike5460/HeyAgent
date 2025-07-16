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
  Settings,
  Database,
  GitBranch,
  Eye,
  Download,
  Trash2,
  Globe,
  Lock,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { formatDate, formatNumber } from "@/lib/utils"
import { PromptTemplate } from "@/types"
import { useSession } from "next-auth/react"

interface TemplateCardProps {
  template: PromptTemplate
  onPreview?: (template: PromptTemplate) => void
  onClone?: (template: PromptTemplate) => void
  onFork?: (template: PromptTemplate) => void
  onExport?: (template: PromptTemplate) => void
  onDelete?: (template: PromptTemplate) => void
  onPublish?: (template: PromptTemplate) => void
  onUnpublish?: (template: PromptTemplate) => void
  variant?: 'default' | 'compact'
  showPublishStatus?: boolean
  currentUserId?: string
}

export function TemplateCard({ 
  template, 
  onPreview, 
  onClone, 
  onFork, 
  onExport,
  onDelete,
  onPublish,
  onUnpublish,
  variant = 'default',
  showPublishStatus = false,
  currentUserId
}: TemplateCardProps) {
  const { data: session } = useSession()
  const isCurrentUserTemplate = currentUserId ? template.userId === currentUserId : session?.user?.email === template.author
  const isPublished = template.status === 'published'
  const isDraft = template.status === 'draft'
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
  const executionEnvironment = template.executionEnvironment || []

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card relative overflow-hidden">
      {/* Fixed Height Container with Grid Layout */}
      <div className="h-[340px] flex flex-col">
        {/* Header Section - Fixed Height */}
        <div className="flex-shrink-0 p-4 pb-2">
          <div className="flex items-start justify-between mb-2">
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
        </div>

        {/* Content Area - Flexible Height */}
        <div className="flex-1 px-4 min-h-0 flex flex-col">
          {/* Tags Section - Unified Style */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs font-normal rounded-full bg-muted/20 text-muted-foreground border-muted/40 hover:bg-muted/30 transition-colors px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {template.tags && template.tags.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs font-normal rounded-full bg-muted/20 text-muted-foreground border-muted/40 hover:bg-muted/30 transition-colors px-2 py-0.5"
                >
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Configuration Section - Fixed Height */}
          <div className="mb-3 min-h-[60px] flex items-start">
            {(mcpServers.length > 0 || executionEnvironment.length > 0) ? (
              <div className="space-y-1.5 w-full">
                {mcpServers.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-xs">
                    <Database className="h-3 w-3 flex-shrink-0 text-blue-600" />
                    <span className="font-medium text-foreground">MCP:</span>
                    <div className="flex space-x-1 flex-wrap min-w-0">
                      {mcpServers.slice(0, 2).map((server) => (
                        <span 
                          key={server.serverId} 
                          className="text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors px-2 py-1 rounded font-medium dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900"
                        >
                          {server.serverType}
                        </span>
                      ))}
                      {mcpServers.length > 2 && (
                        <span 
                          className="text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors px-2 py-1 rounded font-medium dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900"
                        >
                          +{mcpServers.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {executionEnvironment.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-xs">
                    <Settings className="h-3 w-3 flex-shrink-0 text-purple-600" />
                    <span className="font-medium text-foreground">Env:</span>
                    <div className="flex space-x-1 flex-wrap min-w-0">
                      {executionEnvironment.slice(0, 2).map((env, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors px-2 py-1 rounded font-medium dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900"
                        >
                          {env?.infrastructure?.replace('-', ' ') || 'Unknown'}
                        </span>
                      ))}
                      {executionEnvironment.length > 2 && (
                        <span 
                          className="text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors px-2 py-1 rounded font-medium dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900"
                        >
                          +{executionEnvironment.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full opacity-50">
                <span className="text-xs text-muted-foreground">Standard model integration</span>
              </div>
            )}
          </div>

          {/* Spacer to push bottom content down */}
          <div className="flex-1"></div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0 p-4 pt-0 space-y-2.5">
          {/* Stats Row - Fixed Position */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2.5">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-primary" />
                <span className="font-medium">{template.usageCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitBranch className="h-3 w-3 text-secondary" />
                <span className="font-medium">{template.forkCount}</span>
              </div>
              {showPublishStatus && (
                <div className="flex items-center space-x-1">
                  {isPublished ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 flex items-center space-x-1 h-5 text-[10px]">
                      <Globe className="h-2.5 w-2.5" />
                      <span>Public</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 flex items-center space-x-1 h-5 text-[10px]">
                      <Lock className="h-2.5 w-2.5" />
                      <span>Draft</span>
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <span className="text-xs truncate max-w-[100px]">by {template.author}</span>
          </div>

          {/* Action Buttons - Fixed Position */}
          <div className="flex gap-1 w-full">
            {/* View button - Available to everyone */}
            {onPreview && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onPreview(template)}
                className="group/btn hover:border-primary/30 hover:bg-primary/5 h-7 flex-1 flex items-center justify-center min-w-0"
                title="View Details"
              >
                <Eye className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-primary" />
              </Button>
            )}
            
            {/* Clone/Copy button - Available to everyone */}
            {onClone && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onClone(template)}
                className="group/btn hover:border-secondary/30 hover:bg-secondary/5 h-7 flex-1 flex items-center justify-center min-w-0"
                title="Clone Template"
              >
                <Copy className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-secondary" />
              </Button>
            )}
            
            {/* Fork button - Available to everyone */}
            {onFork && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onFork(template)}
                className="group/btn hover:border-accent/30 hover:bg-accent/5 h-7 flex-1 flex items-center justify-center min-w-0"
                title="Fork Template"
              >
                <GitBranch className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-accent-foreground" />
              </Button>
            )}
            
            {/* Export button - Available to everyone */}
            {onExport && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onExport(template)}
                className="group/btn hover:border-muted-foreground/30 hover:bg-muted/50 h-7 flex-1 flex items-center justify-center min-w-0"
                title="Export Template"
              >
                <Download className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-muted-foreground" />
              </Button>
            )}
            
            {/* Publish/Unpublish button - Only for user's own templates */}
            {isCurrentUserTemplate && isDraft && onPublish && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onPublish(template)}
                className="group/btn hover:border-green-600/30 hover:bg-green-500/5 h-7 flex-1 flex items-center justify-center min-w-0"
                title="Publish Template"
              >
                <Globe className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-green-600" />
              </Button>
            )}
            
            {isCurrentUserTemplate && isPublished && onUnpublish && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onUnpublish(template)}
                className="group/btn hover:border-amber-600/30 hover:bg-amber-500/5 h-7 flex-1 flex items-center justify-center min-w-0"
                title="Unpublish Template"
              >
                <Lock className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-amber-600" />
              </Button>
            )}
            
            {/* Delete button - Only for user's own templates */}
            {isCurrentUserTemplate && onDelete && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onDelete(template)}
                className="group/btn hover:border-red-600/30 hover:bg-red-500/5 h-7 flex-1 flex items-center justify-center min-w-0"
                title="Delete Template"
              >
                <Trash2 className="h-3 w-3 group-hover/btn:scale-110 transition-transform text-red-600" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover effect bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Card>
  )
}