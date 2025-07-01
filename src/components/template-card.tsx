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
  Database
} from "lucide-react"
import { formatDate, formatNumber } from "@/lib/utils"

interface TemplateCardProps {
  template: {
    id: string
    title: string
    description: string
    industry: string
    useCase: string
    author: string
    rating: number
    usageCount: number
    lastUpdated: string
    tags: string[]
    mcpServers: string[]
    saasIntegrations: string[]
    status: 'draft' | 'published' | 'archived'
  }
}

export function TemplateCard({ template }: TemplateCardProps) {
  const getIndustryColor = (industry: string) => {
    const colors: Record<string, string> = {
      'Media & Entertainment': 'industry-media',
      'Healthcare & Life Science': 'industry-healthcare',
      'Retail': 'industry-retail',
      'Manufacturing': 'industry-manufacturing',
      'Automotive': 'industry-automotive',
      'Financial Services': 'industry-financial',
      'Gaming': 'industry-gaming',
    }
    return colors[industry] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Card className="template-card group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg leading-tight hover:text-primary cursor-pointer">
              <Link href={`/templates/${template.id}`}>
                {template.title}
              </Link>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={getIndustryColor(template.industry)}>
                {template.industry}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {template.useCase}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <CardDescription className="line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* MCP Servers & Integrations */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Database className="h-3 w-3" />
            <span>MCP Servers:</span>
            <div className="flex space-x-1">
              {template.mcpServers.slice(0, 2).map((server) => (
                <Badge key={server} variant="outline" className="text-xs">
                  {server}
                </Badge>
              ))}
              {template.mcpServers.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{template.mcpServers.length - 2}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>Integrations:</span>
            <div className="flex space-x-1">
              {template.saasIntegrations.slice(0, 2).map((integration) => (
                <Badge key={integration} variant="outline" className="text-xs">
                  {integration}
                </Badge>
              ))}
              {template.saasIntegrations.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{template.saasIntegrations.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{template.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{formatNumber(template.usageCount)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(template.lastUpdated)}</span>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="" alt={template.author} />
            <AvatarFallback className="text-xs">
              {template.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">by {template.author}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1">
            <Play className="h-3 w-3 mr-1" />
            Run in Sandbox
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="h-3 w-3 mr-1" />
            Clone
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}