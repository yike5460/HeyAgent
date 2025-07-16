"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Book, 
  Search, 
  ExternalLink, 
  FileText, 
  Code, 
  Lightbulb, 
  Settings, 
  Users,
  ArrowRight,
  BookOpen,
  Play,
  Zap
} from 'lucide-react'

interface DocSection {
  id: string
  title: string
  description: string
  category: 'getting-started' | 'guides' | 'api' | 'examples'
  icon: React.ElementType
  tags: string[]
}

const docSections: DocSection[] = [
  {
    id: 'quick-start',
    title: 'Quick Start Guide',
    description: 'Get up and running with HeyPrompt in under 5 minutes',
    category: 'getting-started',
    icon: Zap,
    tags: ['beginner', 'setup']
  },
  {
    id: 'template-creation',
    title: 'Creating Your First Template',
    description: 'Learn how to create and configure prompt templates',
    category: 'getting-started',
    icon: FileText,
    tags: ['templates', 'beginner']
  },
  {
    id: 'parameter-configuration',
    title: 'Parameter Configuration',
    description: 'Configure dynamic parameters for flexible prompts',
    category: 'guides',
    icon: Settings,
    tags: ['parameters', 'configuration']
  },
  {
    id: 'template-execution',
    title: 'Template Execution',
    description: 'Execute templates and handle responses effectively',
    category: 'guides',
    icon: Play,
    tags: ['execution', 'api']
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'Complete reference for the HeyPrompt API',
    category: 'api',
    icon: Code,
    tags: ['api', 'reference']
  },
  {
    id: 'authentication',
    title: 'Authentication & Security',
    description: 'Secure your templates and API access',
    category: 'api',
    icon: Users,
    tags: ['auth', 'security']
  },
  {
    id: 'ecommerce-examples',
    title: 'E-commerce Templates',
    description: 'Ready-to-use templates for e-commerce applications',
    category: 'examples',
    icon: Lightbulb,
    tags: ['ecommerce', 'examples']
  },
  {
    id: 'content-creation',
    title: 'Content Creation Templates',
    description: 'Templates for blogs, social media, and marketing content',
    category: 'examples',
    icon: BookOpen,
    tags: ['content', 'marketing']
  }
]

const categories = [
  { id: 'all', label: 'All Documentation', count: docSections.length },
  { id: 'getting-started', label: 'Getting Started', count: docSections.filter(d => d.category === 'getting-started').length },
  { id: 'guides', label: 'Guides', count: docSections.filter(d => d.category === 'guides').length },
  { id: 'api', label: 'API Reference', count: docSections.filter(d => d.category === 'api').length },
  { id: 'examples', label: 'Examples', count: docSections.filter(d => d.category === 'examples').length }
]

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredDocs = docSections.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about creating, managing, and executing prompt templates
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.label}
            <Badge variant="secondary" className="ml-1">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Start
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
            </div>
            <div>
              <p className="font-medium">Create Account</p>
              <p className="text-sm text-muted-foreground">Sign up and get started</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 font-bold">2</span>
            </div>
            <div>
              <p className="font-medium">Create Template</p>
              <p className="text-sm text-muted-foreground">Build your first prompt</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
            </div>
            <div>
              <p className="font-medium">Execute & Test</p>
              <p className="text-sm text-muted-foreground">Run in sandbox mode</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          const IconComponent = doc.icon
          return (
            <Card key={doc.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <span className="group-hover:text-primary transition-colors">
                    {doc.title}
                  </span>
                  <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>{doc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {doc.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No documentation found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or browse different categories
          </p>
        </div>
      )}

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Need More Help?
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Our community and support team are here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Join Discord Community
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              GitHub Issues
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}