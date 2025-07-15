"use client"

import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  NodeTypes,
  MarkerType,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'
import * as d3 from 'd3'
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
  Maximize2
} from 'lucide-react'
import { PromptTemplate } from '@/types'

// Custom Node Components
const LLMNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg border-2 border-blue-300 min-w-[150px]">
    <div className="flex items-center space-x-2">
      <Brain className="h-4 w-4" />
      <div>
        <div className="font-bold text-sm">{data.label}</div>
        <div className="text-xs opacity-80">{data.model}</div>
      </div>
    </div>
  </div>
)

const PromptNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-lg border-2 border-green-300 min-w-[150px]">
    <div className="flex items-center space-x-2">
      <MessageSquare className="h-4 w-4" />
      <div>
        <div className="font-bold text-sm">{data.label}</div>
        <div className="text-xs opacity-80">{data.type}</div>
      </div>
    </div>
  </div>
)

const MCPNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg shadow-lg border-2 border-orange-300 min-w-[150px]">
    <div className="flex items-center space-x-2">
      <Database className="h-4 w-4" />
      <div>
        <div className="font-bold text-sm">{data.label}</div>
        <div className="text-xs opacity-80">{data.serverType}</div>
      </div>
    </div>
  </div>
)

const ToolNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg shadow-lg border-2 border-yellow-300 min-w-[150px]">
    <div className="flex items-center space-x-2">
      <Zap className="h-4 w-4" />
      <div>
        <div className="font-bold text-sm">{data.label}</div>
        <div className="text-xs opacity-80">{data.category}</div>
      </div>
    </div>
  </div>
)

const SaaSNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg border-2 border-indigo-300 min-w-[150px]">
    <div className="flex items-center space-x-2">
      <Settings className="h-4 w-4" />
      <div>
        <div className="font-bold text-sm">{data.label}</div>
        <div className="text-xs opacity-80">{data.provider}</div>
      </div>
    </div>
  </div>
)

// Node types configuration
const nodeTypes: NodeTypes = {
  llm: LLMNode,
  prompt: PromptNode,
  mcp: MCPNode,
  tool: ToolNode,
  saas: SaaSNode,
}

interface TemplateVisualizationProps {
  template: PromptTemplate
  className?: string
}

function TemplateFlowContent({ template }: { template: PromptTemplate }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Generate nodes and edges from template
  const { generatedNodes, generatedEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    let nodeId = 0

    // LLM Node (central)
    const llmNode: Node = {
      id: `llm-${nodeId++}`,
      type: 'llm',
      position: { x: 400, y: 200 },
      data: { 
        label: 'Language Model',
        model: template.executionEnvironment.find(s => s.infrastructure)?.infrastructure || 'GPT-4'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }
    nodes.push(llmNode)

    // System Prompt Node
    const systemPromptNode: Node = {
      id: `prompt-${nodeId++}`,
      type: 'prompt',
      position: { x: 50, y: 100 },
      data: { 
        label: 'System Prompt',
        type: 'System Context'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }
    nodes.push(systemPromptNode)

    // User Prompt Node
    const userPromptNode: Node = {
      id: `prompt-${nodeId++}`,
      type: 'prompt',
      position: { x: 50, y: 300 },
      data: { 
        label: 'User Prompt',
        type: 'User Input'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }
    nodes.push(userPromptNode)

    // Connect prompts to LLM
    edges.push({
      id: `edge-${systemPromptNode.id}-${llmNode.id}`,
      source: systemPromptNode.id,
      target: llmNode.id,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#10b981' }
    })

    edges.push({
      id: `edge-${userPromptNode.id}-${llmNode.id}`,
      source: userPromptNode.id,
      target: llmNode.id,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#10b981' }
    })

    // MCP Server Nodes
    template.mcpServers.forEach((mcpServer, index) => {
      const mcpNode: Node = {
        id: `mcp-${nodeId++}`,
        type: 'mcp',
        position: { x: 750, y: 50 + index * 120 },
        data: {
          label: mcpServer.serverId,
          serverType: mcpServer.serverType
        },
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
      }
      nodes.push(mcpNode)

      // Connect LLM to MCP Server
      edges.push({
        id: `edge-${llmNode.id}-${mcpNode.id}`,
        source: llmNode.id,
        target: mcpNode.id,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#f97316' }
      })

      // Add tool nodes for each MCP server
      mcpServer.tools.forEach((tool, toolIndex) => {
        const toolNode: Node = {
          id: `tool-${nodeId++}`,
          type: 'tool',
          position: { x: 950, y: 50 + index * 120 + toolIndex * 40 },
          data: {
            label: tool.name,
            category: 'MCP Tool'
          },
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
        }
        nodes.push(toolNode)

        // Connect MCP Server to Tool
        edges.push({
          id: `edge-${mcpNode.id}-${toolNode.id}`,
          source: mcpNode.id,
          target: toolNode.id,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#eab308' }
        })
      })
    })

    // Execution Environment Nodes
    template.executionEnvironment.forEach((env, index) => {
      if (env.infrastructure) {
        const envNode: Node = {
          id: `env-${nodeId++}`,
          type: 'saas',
          position: { x: 750, y: 350 + index * 100 },
          data: {
            label: env.infrastructure.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            infrastructure: env.infrastructure,
          },
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
        }
        nodes.push(envNode)

        // Connect LLM to Execution Environment
        edges.push({
          id: `edge-${llmNode.id}-${envNode.id}`,
          source: llmNode.id,
          target: envNode.id,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#6366f1' }
        })
      }
    })

    return { generatedNodes: nodes, generatedEdges: edges }
  }, [template])

  // Set nodes and edges when they change
  useEffect(() => {
    setNodes(generatedNodes)
    setEdges(generatedEdges)
  }, [generatedNodes, generatedEdges, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls />
        <MiniMap />
        <Background variant={"dots" as any} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

// D3 Network Diagram Component
function D3NetworkDiagram({ template }: { template: PromptTemplate }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear previous content

    const width = 800
    const height = 600

    // Prepare data
    const nodes: any[] = [
      { id: 'llm', type: 'llm', label: 'LLM', group: 1 },
      { id: 'system-prompt', type: 'prompt', label: 'System Prompt', group: 2 },
      { id: 'user-prompt', type: 'prompt', label: 'User Prompt', group: 2 },
    ]

    const links: any[] = [
      { source: 'system-prompt', target: 'llm' },
      { source: 'user-prompt', target: 'llm' },
    ]

    // Add MCP servers
    template.mcpServers.forEach((mcp, index) => {
      const mcpId = `mcp-${index}`
      nodes.push({ id: mcpId, type: 'mcp', label: mcp.serverId, group: 3 })
      links.push({ source: 'llm', target: mcpId })

      // Add tools
      mcp.tools.forEach((tool, toolIndex) => {
        const toolId = `tool-${index}-${toolIndex}`
        nodes.push({ id: toolId, type: 'tool', label: tool.name, group: 4 })
        links.push({ source: mcpId, target: toolId })
      })
    })

    // Add execution environments
    template.executionEnvironment.forEach((env, index) => {
      if (env.infrastructure) {
        const envId = `env-${index}`
        nodes.push({ id: envId, type: 'env', label: env.infrastructure.replace('-', ' '), group: 5 })
        links.push({ source: 'llm', target: envId })
      }
    })

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(['1', '2', '3', '4', '5'])
      .range(['#3b82f6', '#10b981', '#f97316', '#eab308', '#6366f1'])

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))

    // Add links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)

    // Add nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d: any) => d.type === 'llm' ? 20 : 15)
      .attr('fill', (d: any) => color(d.group.toString()) as string)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d: any) => d.label)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('fill', 'white')

    // Add drag behavior
    const drag = d3.drag()
      .on('start', (event: any, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event: any, d: any) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event: any, d: any) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    node.call(drag as any)

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y)
    })

  }, [template])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="400"
      className="border rounded-lg bg-white"
    />
  )
}

export function TemplateVisualization({ template, className = '' }: TemplateVisualizationProps) {
  const [viewMode, setViewMode] = React.useState<'flow' | 'network'>('flow')

  return (
    <Card className={`template-visualization ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Template Architecture</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'flow' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('flow')}
            >
              Flow View
            </Button>
            <Button
              variant={viewMode === 'network' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('network')}
            >
              Network View
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
                  <DialogTitle>Template Architecture - {template.title}</DialogTitle>
                </DialogHeader>
                <div className="h-[70vh]">
                  {viewMode === 'flow' ? (
                    <ReactFlowProvider>
                      <TemplateFlowContent template={template} />
                    </ReactFlowProvider>
                  ) : (
                    <D3NetworkDiagram template={template} />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          {viewMode === 'flow' ? (
            <ReactFlowProvider>
              <TemplateFlowContent template={template} />
            </ReactFlowProvider>
          ) : (
            <D3NetworkDiagram template={template} />
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <span className="text-xs">LLM</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-600 rounded"></div>
            <span className="text-xs">Prompts</span>
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
            <span className="text-xs">SaaS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 