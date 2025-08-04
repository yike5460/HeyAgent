"use client"

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  Database, 
  Settings, 
  Network,
  Maximize2,
  Play,
  RotateCcw
} from 'lucide-react'
import { PromptTemplate } from '@/types'
const anime = require('animejs')

// Workflow Node Component
interface WorkflowNodeProps {
  id: string
  type: 'prompt' | 'llm' | 'mcp' | 'tool' | 'env' | 'dependency'
  label: string
  subtitle?: string
  className?: string
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ id, type, label, subtitle, className = '' }) => {
  const iconMap = {
    prompt: MessageSquare,
    llm: Brain,
    mcp: Database,
    tool: Zap,
    env: Settings,
    dependency: Network
  }
  
  const colorMap = {
    prompt: 'from-green-500 to-teal-600 border-green-300',
    llm: 'from-blue-500 to-purple-600 border-blue-300',
    mcp: 'from-orange-500 to-red-600 border-orange-300',
    tool: 'from-yellow-500 to-amber-600 border-yellow-300',
    env: 'from-indigo-500 to-purple-600 border-indigo-300',
    dependency: 'from-gray-500 to-slate-600 border-gray-300'
  }
  
  const Icon = iconMap[type]
  
  return (
    <div 
      id={id}
      className={`workflow-node opacity-0 px-4 py-3 bg-gradient-to-r ${colorMap[type]} text-white rounded-lg shadow-lg border-2 min-w-[140px] transform scale-50 ${className}`}
    >
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4" />
        <div>
          <div className="font-bold text-sm">{label}</div>
          {subtitle && <div className="text-xs opacity-80">{subtitle}</div>}
        </div>
      </div>
    </div>
  )
}

// Connection Arrow Component
const ConnectionArrow: React.FC<{ id: string; className?: string }> = ({ id, className = '' }) => {
  return (
    <div 
      id={id}
      className={`connection-arrow opacity-0 flex items-center space-x-2 ${className}`}
    >
      <div className="h-0.5 bg-gray-400 flex-1 transform scale-x-0 origin-left"></div>
      <div className="w-0 h-0 border-l-8 border-l-gray-400 border-t-4 border-t-transparent border-b-4 border-b-transparent transform scale-0"></div>
    </div>
  )
}

interface TemplateVisualizationProps {
  template: PromptTemplate
  className?: string
}

// Fixed Workflow Animation Component
function AnimatedWorkflowVisualization({ template }: { template: PromptTemplate }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const timelineRef = useRef<any>(null)

  // Extract workflow data from template
  const workflowData = useMemo(() => {
    const model = template.promptConfig?.model?.name || 'GPT-4'
    const mcpServers = template.mcpServers.slice(0, 3) // Limit to first 3 for layout
    const tools = template.mcpServers.flatMap(server => server.tools.slice(0, 2)) // Limit tools
    const environments = template.executionEnvironment.slice(0, 2)
    const dependencies = template.metadata?.dependencies?.slice(0, 3) || []
    
    return {
      model,
      mcpServers,
      tools,
      environments,
      dependencies
    }
  }, [template])

  const startAnimation = useCallback(() => {
    if (!containerRef.current || isAnimating) return
    
    setIsAnimating(true)
    
    // Create timeline animation
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 800,
      complete: () => {
        setIsAnimating(false)
      }
    })

    // Reset all elements
    anime({
      targets: '.workflow-node',
      opacity: 0,
      scale: 0.5,
      translateY: 30,
      duration: 0
    })
    
    anime({
      targets: '.connection-arrow',
      opacity: 0,
      duration: 0
    })
    
    anime({
      targets: '.connection-arrow .h-0\\.5',
      scaleX: 0,
      duration: 0
    })
    
    anime({
      targets: '.connection-arrow .w-0',
      scale: 0,
      duration: 0
    })

    // Animate workflow sequence
    tl.add({
      targets: '#prompt-node',
      opacity: [0, 1],
      scale: [0.5, 1],
      translateY: [30, 0],
      delay: 200
    })
    .add({
      targets: '#arrow-1 .h-0\.5',
      scaleX: [0, 1],
      duration: 600
    }, '-=200')
    .add({
      targets: '#arrow-1 .w-0',
      scale: [0, 1],
      duration: 300
    }, '-=100')
    .add({
      targets: '#arrow-1',
      opacity: [0, 1],
      duration: 200
    }, '-=500')
    .add({
      targets: '#llm-node',
      opacity: [0, 1],
      scale: [0.5, 1.1, 1],
      translateY: [30, 0],
      duration: 1000
    }, '-=200')
    .add({
      targets: '#arrow-2 .h-0\.5',
      scaleX: [0, 1],
      duration: 600
    }, '-=200')
    .add({
      targets: '#arrow-2 .w-0',
      scale: [0, 1],
      duration: 300
    }, '-=100')
    .add({
      targets: '#arrow-2',
      opacity: [0, 1],
      duration: 200
    }, '-=500')
    .add({
      targets: '.mcp-node',
      opacity: [0, 1],
      scale: [0.5, 1],
      translateY: [30, 0],
      delay: anime.stagger(200)
    }, '-=200')
    .add({
      targets: '#arrow-3 .h-0\.5',
      scaleX: [0, 1],
      duration: 600
    }, '-=200')
    .add({
      targets: '#arrow-3 .w-0',
      scale: [0, 1],
      duration: 300
    }, '-=100')
    .add({
      targets: '#arrow-3',
      opacity: [0, 1],
      duration: 200
    }, '-=500')
    .add({
      targets: '.tool-node',
      opacity: [0, 1],
      scale: [0.5, 1],
      translateY: [30, 0],
      delay: anime.stagger(100)
    }, '-=200')
    .add({
      targets: '#arrow-4 .h-0\.5',
      scaleX: [0, 1],
      duration: 600
    }, '-=200')
    .add({
      targets: '#arrow-4 .w-0',
      scale: [0, 1],
      duration: 300
    }, '-=100')
    .add({
      targets: '#arrow-4',
      opacity: [0, 1],
      duration: 200
    }, '-=500')
    .add({
      targets: '.env-node',
      opacity: [0, 1],
      scale: [0.5, 1],
      translateY: [30, 0],
      delay: anime.stagger(150)
    }, '-=200')
    .add({
      targets: '#arrow-5 .h-0\.5',
      scaleX: [0, 1],
      duration: 600
    }, '-=200')
    .add({
      targets: '#arrow-5 .w-0',
      scale: [0, 1],
      duration: 300
    }, '-=100')
    .add({
      targets: '#arrow-5',
      opacity: [0, 1],
      duration: 200
    }, '-=500')
    .add({
      targets: '.dependency-node',
      opacity: [0, 1],
      scale: [0.5, 1],
      translateY: [30, 0],
      delay: anime.stagger(100)
    }, '-=200')

    timelineRef.current = tl
  }, [isAnimating])

  const resetAnimation = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.restart()
      setIsAnimating(true)
    }
  }, [])

  useEffect(() => {
    // Auto-start animation on mount
    const timer = setTimeout(startAnimation, 500)
    return () => clearTimeout(timer)
  }, [startAnimation])

  return (
    <div ref={containerRef} className="relative h-full w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-auto">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <Button
          size="sm"
          variant="outline"
          onClick={startAnimation}
          disabled={isAnimating}
          className="bg-white/80 backdrop-blur-sm"
        >
          <Play className="h-4 w-4 mr-1" />
          Play
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={resetAnimation}
          disabled={isAnimating}
          className="bg-white/80 backdrop-blur-sm"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Workflow Visualization */}
      <div className="flex flex-col space-y-8 items-center py-8">
        {/* Step 1: Prompt Input */}
        <div className="flex flex-col items-center space-y-4">
          <WorkflowNode 
            id="prompt-node"
            type="prompt"
            label="Prompt Processing"
            subtitle="User & System Prompts"
          />
          <ConnectionArrow id="arrow-1" />
        </div>

        {/* Step 2: LLM */}
        <div className="flex flex-col items-center space-y-4">
          <WorkflowNode 
            id="llm-node"
            type="llm"
            label="Language Model"
            subtitle={workflowData.model}
            className="transform-gpu"
          />
          <ConnectionArrow id="arrow-2" />
        </div>

        {/* Step 3: MCP Servers */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            {workflowData.mcpServers.map((server, index) => (
              <WorkflowNode 
                key={server.serverId}
                id={`mcp-${index}`}
                type="mcp"
                label={server.serverId}
                subtitle={server.serverType}
                className="mcp-node"
              />
            ))}
            {workflowData.mcpServers.length === 0 && (
              <WorkflowNode 
                id="mcp-0"
                type="mcp"
                label="No MCP Servers"
                subtitle="Direct Processing"
                className="mcp-node opacity-50"
              />
            )}
          </div>
          {workflowData.tools.length > 0 && <ConnectionArrow id="arrow-3" />}
        </div>

        {/* Step 4: Tools (if any) */}
        {workflowData.tools.length > 0 && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center gap-3">
              {workflowData.tools.map((tool, index) => (
                <WorkflowNode 
                  key={`${tool.name}-${index}`}
                  id={`tool-${index}`}
                  type="tool"
                  label={tool.name}
                  subtitle="MCP Tool"
                  className="tool-node"
                />
              ))}
            </div>
            <ConnectionArrow id="arrow-4" />
          </div>
        )}

        {/* Step 5: Execution Environment */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            {workflowData.environments.map((env, index) => (
              <WorkflowNode 
                key={`env-${index}`}
                id={`env-${index}`}
                type="env"
                label={env.infrastructure || 'Cloud Environment'}
                subtitle="Execution Environment"
                className="env-node"
              />
            ))}
            {workflowData.environments.length === 0 && (
              <WorkflowNode 
                id="env-0"
                type="env"
                label="Default Environment"
                subtitle="Standard Runtime"
                className="env-node opacity-50"
              />
            )}
          </div>
          {workflowData.dependencies.length > 0 && <ConnectionArrow id="arrow-5" />}
        </div>

        {/* Step 6: Dependencies (if any) */}
        {workflowData.dependencies.length > 0 && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center gap-3">
              {workflowData.dependencies.map((dep, index) => (
                <WorkflowNode 
                  key={`dep-${index}`}
                  id={`dep-${index}`}
                  type="dependency"
                  label={dep}
                  subtitle="Dependency"
                  className="dependency-node"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Legacy Network Diagram - kept for reference
function LegacyNetworkDiagram({ template }: { template: PromptTemplate }) {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
      <p className="text-gray-500 text-center">
        Legacy network view replaced with animated workflow visualization.
        <br />
        <span className="text-sm">Use the animated view for better user experience.</span>
      </p>
    </div>
  )
}

export function TemplateVisualization({ template, className = '' }: TemplateVisualizationProps) {
  const [viewMode, setViewMode] = React.useState<'animated' | 'legacy'>('animated')

  return (
    <Card className={`template-visualization ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Template Workflow</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'animated' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('animated')}
            >
              <Play className="h-4 w-4 mr-1" />
              Animated View
            </Button>
            <Button
              variant={viewMode === 'legacy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('legacy')}
            >
              Legacy View
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4" />
                  Expand
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Template Workflow - {template.title}</DialogTitle>
                </DialogHeader>
                <div className="h-[70vh]">
                  {viewMode === 'animated' ? (
                    <AnimatedWorkflowVisualization template={template} />
                  ) : (
                    <LegacyNetworkDiagram template={template} />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          {viewMode === 'animated' ? (
            <AnimatedWorkflowVisualization template={template} />
          ) : (
            <LegacyNetworkDiagram template={template} />
          )}
        </div>
        
        {/* Updated Legend for Workflow */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-600 rounded"></div>
            <span className="text-xs">Prompts</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <span className="text-xs">LLM</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-600 rounded"></div>
            <span className="text-xs">MCP Servers</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded"></div>
            <span className="text-xs">Tools</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded"></div>
            <span className="text-xs">Environment</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gradient-to-r from-gray-500 to-slate-600 rounded"></div>
            <span className="text-xs">Dependencies</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 