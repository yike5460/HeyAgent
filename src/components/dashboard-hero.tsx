"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Database, 
  Settings, 
  Workflow, 
  Users, 
  User,
  ArrowRight,
  Star,
  GitBranch,
  Zap,
  MessageSquare,
  Network,
  TrendingUp,
  Activity,
  Sparkles,
  Play,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface DashboardHeroProps {
  publicStats: {
    totalTemplates: number
    totalUsage: number
    averageRating: number
    totalForks: number
  }
  myTemplatesCount: number
  myDraftCount: number
  loading: boolean
}

export function DashboardHero({ 
  publicStats, 
  myTemplatesCount, 
  myDraftCount, 
  loading 
}: DashboardHeroProps) {
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Workflow Visualization */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border-2 border-primary/10 shadow-lg">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    AI Template Hub
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-foreground">
                  Build Intelligent Workflows
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Create, orchestrate, and deploy AI agents with advanced prompt templates, 
                  MCP server integrations, and workflow automation.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/templates/gallery">
                  <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Play className="h-4 w-4 mr-2" />
                    Explore Templates
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/templates/mine">
                  <Button variant="outline" size="lg" className="group border-primary/20 hover:bg-primary/5 hover:border-primary/40">
                    <User className="h-4 w-4 mr-2" />
                    My Workspace
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Animated Workflow Diagram */}
            <div className="relative">
              <div className="relative w-full h-80 flex items-center justify-center">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                {/* Workflow Nodes */}
                <div className="relative w-full h-full flex items-center justify-between px-4">
                  {/* User Input Node */}
                  <div className={`flex flex-col items-center space-y-2 transition-all duration-1000 ${
                    animationStep >= 0 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                  }`}>
                    <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-center text-foreground">User<br/>Input</span>
                  </div>

                  {/* Arrow 1 */}
                  <div className={`flex-1 flex justify-center transition-all duration-500 ${
                    animationStep >= 1 ? 'opacity-100' : 'opacity-30'
                  }`}>
                    <ArrowRight className={`h-6 w-6 text-primary transition-transform duration-500 ${
                      animationStep >= 1 ? 'translate-x-0' : '-translate-x-4'
                    }`} />
                  </div>

                  {/* AI Agent Node */}
                  <div className={`flex flex-col items-center space-y-2 transition-all duration-1000 ${
                    animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                  }`}>
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-xl relative">
                      <Brain className="h-10 w-10 text-primary-foreground" />
                      {animationStep >= 1 && (
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-center text-foreground">AI<br/>Agent</span>
                  </div>

                  {/* Arrow 2 */}
                  <div className={`flex-1 flex justify-center transition-all duration-500 ${
                    animationStep >= 2 ? 'opacity-100' : 'opacity-30'
                  }`}>
                    <ArrowRight className={`h-6 w-6 text-primary transition-transform duration-500 ${
                      animationStep >= 2 ? 'translate-x-0' : '-translate-x-4'
                    }`} />
                  </div>

                  {/* MCP Tools Node */}
                  <div className={`flex flex-col items-center space-y-2 transition-all duration-1000 ${
                    animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                  }`}>
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                      <Database className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-center text-foreground">MCP<br/>Tools</span>
                  </div>

                  {/* Arrow 3 */}
                  <div className={`flex-1 flex justify-center transition-all duration-500 ${
                    animationStep >= 3 ? 'opacity-100' : 'opacity-30'
                  }`}>
                    <ArrowRight className={`h-6 w-6 text-primary transition-transform duration-500 ${
                      animationStep >= 3 ? 'translate-x-0' : '-translate-x-4'
                    }`} />
                  </div>

                  {/* Output Node */}
                  <div className={`flex flex-col items-center space-y-2 transition-all duration-1000 ${
                    animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                  }`}>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-center text-foreground">Smart<br/>Output</span>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4">
                  <div className="animate-bounce">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="animate-pulse">
                    <Network className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card border-dashed border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2 text-foreground">
                <Workflow className="h-5 w-5 text-primary" />
                <span>Ready to build your first AI workflow?</span>
              </h3>
              <p className="text-muted-foreground">
                Start with a template or create from scratch with our visual editor
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/templates/gallery">
                <Button variant="outline" className="group border-primary/20 hover:bg-primary/5 hover:border-primary/40">
                  <Database className="h-4 w-4 mr-2" />
                  Browse Templates
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/templates/mine">
                <Button className="group bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Settings className="h-4 w-4 mr-2" />
                  Create New
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}