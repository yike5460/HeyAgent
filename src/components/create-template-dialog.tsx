"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface CreateTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const industries = [
  "Media & Entertainment",
  "Healthcare & Life Science", 
  "Retail",
  "Manufacturing",
  "Automotive",
  "Financial Services",
  "Gaming"
]

const commonMCPServers = [
  "firecrawl",
  "content-analyzer",
  "audio-processor",
  "medical-nlp",
  "compliance-checker",
  "data-processor"
]

const commonIntegrations = [
  "openai",
  "anthropic",
  "elevenlabs",
  "murf",
  "kling",
  "veo3",
  "secure-api"
]

export function CreateTemplateDialog({ open, onOpenChange }: CreateTemplateDialogProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    industry: "",
    useCase: "",
    tags: [] as string[],
    mcpServers: [] as string[],
    saasIntegrations: [] as string[]
  })
  
  const [newTag, setNewTag] = React.useState("")
  const [selectedMCPServer, setSelectedMCPServer] = React.useState("")
  const [selectedIntegration, setSelectedIntegration] = React.useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddMCPServer = (server: string) => {
    if (server && !formData.mcpServers.includes(server)) {
      setFormData(prev => ({
        ...prev,
        mcpServers: [...prev.mcpServers, server]
      }))
    }
  }

  const handleRemoveMCPServer = (serverToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      mcpServers: prev.mcpServers.filter(server => server !== serverToRemove)
    }))
  }

  const handleAddIntegration = (integration: string) => {
    if (integration && !formData.saasIntegrations.includes(integration)) {
      setFormData(prev => ({
        ...prev,
        saasIntegrations: [...prev.saasIntegrations, integration]
      }))
    }
  }

  const handleRemoveIntegration = (integrationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      saasIntegrations: prev.saasIntegrations.filter(integration => integration !== integrationToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement template creation logic
    console.log("Creating template:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a new AI-powered application template with MCP server integration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Template Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Short Drama Production Assistant"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what your template does and how it helps users..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="useCase">Use Case</Label>
                <Input
                  id="useCase"
                  value={formData.useCase}
                  onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                  placeholder="e.g., Content Creation"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* MCP Servers */}
          <div className="space-y-2">
            <Label>MCP Servers</Label>
            <Select value={selectedMCPServer} onValueChange={(value) => {
              handleAddMCPServer(value)
              setSelectedMCPServer("")
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Add MCP server" />
              </SelectTrigger>
              <SelectContent>
                {commonMCPServers.filter(server => !formData.mcpServers.includes(server)).map((server) => (
                  <SelectItem key={server} value={server}>
                    {server}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {formData.mcpServers.map((server) => (
                <Badge key={server} variant="outline" className="flex items-center gap-1">
                  {server}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveMCPServer(server)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* SaaS Integrations */}
          <div className="space-y-2">
            <Label>SaaS Integrations</Label>
            <Select value={selectedIntegration} onValueChange={(value) => {
              handleAddIntegration(value)
              setSelectedIntegration("")
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Add integration" />
              </SelectTrigger>
              <SelectContent>
                {commonIntegrations.filter(integration => !formData.saasIntegrations.includes(integration)).map((integration) => (
                  <SelectItem key={integration} value={integration}>
                    {integration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              {formData.saasIntegrations.map((integration) => (
                <Badge key={integration} variant="outline" className="flex items-center gap-1">
                  {integration}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveIntegration(integration)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Template</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}