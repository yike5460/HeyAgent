"use client"

import { useState, useEffect } from 'react'
import { TemplateManager } from '@/components/template-manager'
import { TemplateVisualization } from '@/components/template-visualization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PromptTemplate } from '@/types'
import { templateService } from '@/services/template-service'
import { Brain, Database, Settings, Workflow, Plus, Upload, Download } from 'lucide-react'

export default function MyTemplatesPage() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<PromptTemplate | null>(null)

  // Load templates from local storage on component mount
  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const userTemplates = await templateService.getUserTemplates()
      // API now handles user authentication and returns appropriate templates
      const validTemplates = Array.isArray(userTemplates) ? userTemplates.filter(t => t && t.id) : []
      setTemplates(validTemplates)
      if (validTemplates.length > 0 && !selectedTemplate) {
        setSelectedTemplate(validTemplates[0])
      }
    } catch (error) {
      console.error('Error loading templates:', error)
      toast({
        title: "Error",
        description: "Failed to load templates from database.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateCreate = async (templateData: Partial<PromptTemplate>) => {
    try {
      const newTemplate: PromptTemplate = {
        ...templateData,
        id: `template-${Date.now()}`,
        version: 1,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'current-user',
        author: 'Current User',
        rating: 0,
        usageCount: 0,
        forkCount: 0,
        isForked: false,
        collaborators: [],
        isPublic: false,
        license: 'MIT'
      } as PromptTemplate

      const savedTemplate = await templateService.saveTemplate(newTemplate)
      setTemplates(prev => [...prev, savedTemplate])
      
      toast({
        title: "Template Created",
        description: "Your template has been created and saved to the database."
      })
    } catch (error) {
      console.error('Error creating template:', error)
      toast({
        title: "Error",
        description: "Failed to create template.",
        variant: "destructive"
      })
    }
  }

  const handleTemplateUpdate = async (id: string, templateData: Partial<PromptTemplate>) => {
    try {
      const existingTemplate = templates.find(t => t.id === id)
      if (!existingTemplate) {
        throw new Error('Template not found')
      }

      const updatedTemplate = {
        ...existingTemplate,
        ...templateData,
        updatedAt: new Date().toISOString()
      }

      const savedTemplate = await templateService.saveTemplate(updatedTemplate)
      
      setTemplates(prev => 
        prev.map(t => t.id === id ? savedTemplate : t)
      )
      
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(savedTemplate)
      }
      
      toast({
        title: "Template Updated",
        description: "Your template has been updated successfully."
      })
    } catch (error) {
      console.error('Error updating template:', error)
      toast({
        title: "Error",
        description: "Failed to update template.",
        variant: "destructive"
      })
    }
  }

  const handleTemplateDeleteRequest = (id: string) => {
    const template = templates.find(t => t.id === id)
    if (template) {
      setTemplateToDelete(template)
      setIsDeleteDialogOpen(true)
    }
  }

  const handleTemplateDelete = async () => {
    if (!templateToDelete) return
    
    try {
      const success = await templateService.deleteTemplate(templateToDelete.id)
      if (success) {
        setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id))
        if (selectedTemplate?.id === templateToDelete.id) {
          const remainingTemplates = templates.filter(t => t.id !== templateToDelete.id)
          setSelectedTemplate(remainingTemplates.length > 0 ? remainingTemplates[0] : null)
        }
        toast({
          title: "Template Deleted",
          description: "Template has been deleted successfully."
        })
      } else {
        throw new Error('Template not found')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast({
        title: "Error",
        description: "Failed to delete template.",
        variant: "destructive"
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  }

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false)
    setTemplateToDelete(null)
  }

  const handleTemplateClone = async (id: string) => {
    try {
      const templateToClone = templates.find(t => t.id === id)
      if (!templateToClone) {
        throw new Error('Template not found')
      }

      const clonedTemplate = await templateService.cloneTemplate(
        id,
        `${templateToClone.title} (Copy)`
      )

      if (clonedTemplate) {
        setTemplates(prev => [...prev, clonedTemplate])
        toast({
          title: "Template Cloned",
          description: "Template has been cloned successfully."
        })
      }
    } catch (error) {
      console.error('Error cloning template:', error)
      toast({
        title: "Error",
        description: "Failed to clone template.",
        variant: "destructive"
      })
    }
  }

  const handleTemplateImport = async (importedTemplates: PromptTemplate[]) => {
    try {
      const importResults = []
      
      for (const template of importedTemplates) {
        const result = await templateService.importTemplate(JSON.stringify(template))
        importResults.push(result)
      }

      const successfulImports = importResults.filter(r => r.success)
      const failedImports = importResults.filter(r => !r.success)

      if (successfulImports.length > 0) {
        await loadTemplates() // Reload templates from storage
        toast({
          title: "Templates Imported",
          description: `Successfully imported ${successfulImports.length} templates.`
        })
      }

      if (failedImports.length > 0) {
        toast({
          title: "Import Warnings",
          description: `${failedImports.length} templates failed to import. Check console for details.`,
          variant: "destructive"
        })
        console.error('Failed imports:', failedImports)
      }
    } catch (error) {
      console.error('Error importing templates:', error)
      toast({
        title: "Import Error",
        description: "Failed to import templates.",
        variant: "destructive"
      })
    }
  }

  const handleExportAll = async () => {
    try {
      const exportData = templates.map(template => ({
        ...template,
        exportMetadata: {
          exportedAt: new Date().toISOString(),
          exportedBy: 'current-user',
          version: template.version,
          includeSecrets: false,
          format: 'json' as const,
          checksum: 'generated-checksum'
        }
      }))

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `my_templates_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Export Complete",
        description: `${templates.length} templates exported successfully.`
      })
    } catch (error) {
      console.error('Error exporting templates:', error)
      toast({
        title: "Export Error",
        description: "Failed to export templates.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your templates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">My Templates</h1>
          <p className="text-lg text-muted-foreground">
            Create, manage, and organize your AI prompt templates with cloud database persistence.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportAll} disabled={templates.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Templates</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{templates.length}</div>
                <p className="text-xs text-muted-foreground">
                  Templates in your workspace
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Draft Templates</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {templates.filter(t => t.status === 'draft').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Templates in draft status
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {templates.filter(t => t.status === 'published').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Published templates
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
                <Workflow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {templates.reduce((sum, t) => sum + (t.forkCount || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Times your templates were forked
                </p>
              </CardContent>
            </Card>
          </div>

          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle>Featured Template: {selectedTemplate.title}</CardTitle>
                <CardDescription>{selectedTemplate.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>{selectedTemplate.industry}</Badge>
                  <Badge variant="outline">{selectedTemplate.useCase}</Badge>
                  <Badge variant="outline">{selectedTemplate.metadata?.complexity || 'Unknown'}</Badge>
                  <Badge variant="outline" className={
                    selectedTemplate.status === 'published' ? 'bg-green-100 text-green-800' :
                    selectedTemplate.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {selectedTemplate.status}
                  </Badge>
                  {selectedTemplate.isForked && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      Forked
                    </Badge>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.tags && selectedTemplate.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Statistics</h4>
                    <div className="space-y-1 text-sm">
                      <div>Usage Count: {selectedTemplate.usageCount || 0}</div>
                      <div>Fork Count: {selectedTemplate.forkCount || 0}</div>
                      <div>Rating: {selectedTemplate.rating || 0}/5</div>
                      <div>Created: {new Date(selectedTemplate.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first template to get started with AI prompt management.
                </p>
                <Button onClick={() => {
                  // Switch to management tab
                  const managementTab = document.querySelector('[value="management"]') as HTMLElement
                  managementTab?.click()
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="management">
          <TemplateManager
            templates={templates}
            onTemplateCreate={handleTemplateCreate}
            onTemplateUpdate={handleTemplateUpdate}
            onTemplateDelete={handleTemplateDeleteRequest}
            onTemplateClone={handleTemplateClone}
            onTemplateImport={handleTemplateImport}
          />
        </TabsContent>

        <TabsContent value="visualization">
          {selectedTemplate ? (
            <TemplateVisualization template={selectedTemplate} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Workflow className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Template Selected</h3>
                <p className="text-muted-foreground text-center">
                  Select a template from the management tab to view its visualization.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.title}"? This action cannot be undone and will permanently remove the template and all its configurations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteDialogClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTemplateDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}