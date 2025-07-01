'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter, Star, Users, Clock, Zap } from 'lucide-react'
import { TemplateCard } from '@/components/template-card'
import { IndustryFilter } from '@/components/industry-filter'
import { CreateTemplateDialog } from '@/components/create-template-dialog'

// Mock data for initial development
const mockTemplates = [
  {
    id: '1',
    title: 'Short Drama Production Assistant',
    description: 'Automated script generation, character development, and scene planning for short-form video content',
    industry: 'Media & Entertainment',
    useCase: 'Short Drama Production',
    author: 'John Doe',
    rating: 4.8,
    usageCount: 1250,
    lastUpdated: '2024-01-15',
    tags: ['video', 'script', 'automation', 'content-creation'],
    mcpServers: ['firecrawl', 'content-analyzer'],
    saasIntegrations: ['openai', 'elevenlabs'],
    status: 'published' as const,
  },
  {
    id: '2',
    title: 'ASMR Content Creator',
    description: 'Generate personalized ASMR scripts with trigger identification and audio optimization',
    industry: 'Media & Entertainment',
    useCase: 'ASMR Content Creation',
    author: 'Sarah Wilson',
    rating: 4.6,
    usageCount: 890,
    lastUpdated: '2024-01-12',
    tags: ['audio', 'asmr', 'personalization', 'wellness'],
    mcpServers: ['audio-processor', 'content-analyzer'],
    saasIntegrations: ['openai', 'murf'],
    status: 'published' as const,
  },
  {
    id: '3',
    title: 'Clinical Documentation Assistant',
    description: 'Automated medical report generation and patient summary creation with HIPAA compliance',
    industry: 'Healthcare & Life Science',
    useCase: 'Clinical Documentation',
    author: 'Dr. Michael Chen',
    rating: 4.9,
    usageCount: 2100,
    lastUpdated: '2024-01-18',
    tags: ['healthcare', 'documentation', 'compliance', 'automation'],
    mcpServers: ['medical-nlp', 'compliance-checker'],
    saasIntegrations: ['anthropic', 'secure-api'],
    status: 'published' as const,
  },
]

const industryStats = [
  { name: 'Media & Entertainment', count: 45, color: 'purple' },
  { name: 'Healthcare & Life Science', count: 32, color: 'green' },
  { name: 'Retail', count: 28, color: 'blue' },
  { name: 'Manufacturing', count: 19, color: 'orange' },
  { name: 'Automotive', count: 15, color: 'red' },
  { name: 'Financial Services', count: 22, color: 'yellow' },
  { name: 'Gaming', count: 18, color: 'pink' },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesIndustry = !selectedIndustry || template.industry === selectedIndustry

    return matchesSearch && matchesIndustry
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">
          AI Prompt Gallery Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Create, share, and deploy sophisticated AI-powered application templates with 
          MCP server integration and containerized sandbox environments
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
          <Button variant="outline" size="lg">
            <Search className="mr-2 h-4 w-4" />
            Explore Gallery
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">179</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sandbox Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,432</div>
            <p className="text-xs text-muted-foreground">+25% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">Across all templates</p>
          </CardContent>
        </Card>
      </section>

      {/* Search and Filter Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates, industries, or use cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        {/* Industry Filter */}
        <IndustryFilter
          industries={industryStats}
          selectedIndustry={selectedIndustry}
          onIndustrySelect={setSelectedIndustry}
        />
      </section>

      {/* Templates Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {selectedIndustry ? `${selectedIndustry} Templates` : 'Featured Templates'}
          </h2>
          <Badge variant="secondary">
            {filteredTemplates.length} templates
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setSelectedIndustry(null)
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* Create Template Dialog */}
      <CreateTemplateDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  )
}