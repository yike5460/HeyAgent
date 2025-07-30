"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TemplateCard } from '@/components/template-card'
import { TemplateDetailsPanel } from '@/components/template-details-panel'
import { CreateTemplateDialog } from '@/components/create-template-dialog'
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
import { Brain, Database, Settings, Workflow, Plus, Upload, Download, TrendingUp, BarChart3, Activity, Star } from 'lucide-react'

export default function MyTemplatesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [templateToEdit, setTemplateToEdit] = useState<PromptTemplate | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<PromptTemplate | null>(null)
  const [templateFavorites, setTemplateFavorites] = useState<Record<string, { isFavorite: boolean, count: number }>>({})

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
      
      // Load favorite information for each template if user is logged in
      if (session?.user && validTemplates.length > 0) {
        loadTemplateFavorites(validTemplates)
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

  const loadTemplateFavorites = async (templates: PromptTemplate[]) => {
    try {
      const favoritePromises = templates.map(async (template) => {
        const response = await fetch(`/api/templates/${template.id}/favorite`)
        const data = await response.json()
        return {
          templateId: template.id,
          isFavorite: data.success ? data.data.isFavorite : false,
          count: data.success ? data.data.favoriteCount : 0
        }
      })
      
      const favoriteResults = await Promise.all(favoritePromises)
      
      const favoritesMap = favoriteResults.reduce((acc, result) => {
        acc[result.templateId] = {
          isFavorite: result.isFavorite,
          count: result.count
        }
        return acc
      }, {} as Record<string, { isFavorite: boolean, count: number }>)
      
      setTemplateFavorites(favoritesMap)
    } catch (error) {
      console.error('Error loading template favorites:', error)
    }
  }

  const handleStar = async (template: PromptTemplate) => {
    try {
      const response = await fetch(`/api/templates/${template.id}/favorite`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Added to Favorites",
          description: `Template "${template.title}" has been added to your favorites.`
        })
        // Update the template's favorite status and count
        setTemplateFavorites(prev => ({
          ...prev,
          [template.id]: {
            isFavorite: true,
            count: data.data.favoriteCount
          }
        }))
      } else {
        toast({
          title: "Failed to Add to Favorites",
          description: data.error?.message || "Failed to add to favorites",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Failed to Add to Favorites",
        description: "An error occurred while adding to favorites",
        variant: "destructive"
      })
    }
  }

  const handleUnstar = async (template: PromptTemplate) => {
    try {
      const response = await fetch(`/api/templates/${template.id}/favorite`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Removed from Favorites",
          description: `Template "${template.title}" has been removed from your favorites.`
        })
        // Update the template's favorite status and count
        setTemplateFavorites(prev => ({
          ...prev,
          [template.id]: {
            isFavorite: false,
            count: data.data.favoriteCount
          }
        }))
      } else {
        toast({
          title: "Failed to Remove from Favorites",
          description: data.error?.message || "Failed to remove from favorites",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Failed to Remove from Favorites",
        description: "An error occurred while removing from favorites",
        variant: "destructive"
      })
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
        userId: session?.user?.id || 'current-user',
        author: session?.user?.name || session?.user?.email || 'Current User',
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

  const handleTemplateEditSave = async (templateData: Partial<PromptTemplate>) => {
    if (!templateToEdit) return
    
    try {
      const existingTemplate = templates.find(t => t.id === templateToEdit.id)
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
        prev.map(t => t.id === templateToEdit.id ? savedTemplate : t)
      )
      
      if (selectedTemplate?.id === templateToEdit.id) {
        setSelectedTemplate(savedTemplate)
      }
      
      // Close the edit dialog and clear the template being edited
      setIsEditDialogOpen(false)
      setTemplateToEdit(null)
      
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

  const handleTemplatePublish = async (template: PromptTemplate) => {
    try {
      const updatedTemplate = {
        ...template,
        status: 'published' as const,
        isPublic: true
      };
      
      const savedTemplate = await templateService.saveTemplate(updatedTemplate);
      
      setTemplates(prev => 
        prev.map(t => t.id === template.id ? savedTemplate : t)
      );
      
      if (selectedTemplate?.id === template.id) {
        setSelectedTemplate(savedTemplate);
      }
      
      toast({
        title: "Template Published",
        description: "Your template is now publicly available in the gallery."
      });
    } catch (error) {
      console.error('Error publishing template:', error);
      toast({
        title: "Error",
        description: "Failed to publish template.",
        variant: "destructive"
      });
    }
  };
  
  const handleTemplateUnpublish = async (template: PromptTemplate) => {
    try {
      const updatedTemplate = {
        ...template,
        status: 'draft' as const,
        isPublic: false
      };
      
      const savedTemplate = await templateService.saveTemplate(updatedTemplate);
      
      setTemplates(prev => 
        prev.map(t => t.id === template.id ? savedTemplate : t)
      );
      
      if (selectedTemplate?.id === template.id) {
        setSelectedTemplate(savedTemplate);
      }
      
      toast({
        title: "Template Unpublished",
        description: "Your template has been moved back to drafts."
      });
    } catch (error) {
      console.error('Error unpublishing template:', error);
      toast({
        title: "Error",
        description: "Failed to unpublish template.",
        variant: "destructive"
      });
    }
  };

  const handleTemplateDeleteRequest = (template: PromptTemplate) => {
    setTemplateToDelete(template)
    setIsDeleteDialogOpen(true)
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

  const handleTemplateEdit = (template: PromptTemplate) => {
    // Set the template to edit and open the edit dialog
    setTemplateToEdit(template)
    setIsEditDialogOpen(true)
  }

  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      // Clear the template being edited when dialog is closed
      setTemplateToEdit(null)
    }
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
          <TabsTrigger value="analytic">Analytic</TabsTrigger>
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

          {/* Analytics Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Template Analytics</span>
              </CardTitle>
              <CardDescription>Performance metrics and insights for your templates</CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first template to get started with AI prompt management.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {templates.slice(0, 5).map((template, index) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">#{index + 1}</span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium truncate">{template.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">{template.industry}</Badge>
                              <Badge variant="outline" className="text-xs">{template.metadata?.complexity || 'Unknown'}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 ml-4">
                        {/* Usage Count */}
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                            <Activity className="h-3 w-3" />
                            <span>Usage</span>
                          </div>
                          <div className="text-sm font-bold">{(template.usageCount || 0).toLocaleString()}</div>
                        </div>
                        
                        {/* Fork Count */}
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                            <Database className="h-3 w-3" />
                            <span>Forks</span>
                          </div>
                          <div className="text-sm font-bold">{template.forkCount || 0}</div>
                        </div>
                        
                        {/* Favorites */}
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                            <Star className="h-3 w-3" />
                            <span>Favorites</span>
                          </div>
                          <div className="text-sm font-bold">0</div>
                        </div>
                        
                        {/* Trending Indicator */}
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Trend</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-8 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
                                style={{ 
                                  width: `${Math.min(100, (template.usageCount / Math.max(...templates.map(t => t.usageCount || 0).filter(count => count > 0), 1)) * 100)}%` 
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium text-green-600">
                              {(template.usageCount || 0) > templates.reduce((sum, t) => sum + (t.usageCount || 0), 0) / templates.length ? '↑' : '→'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {templates.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        // Switch to management tab
                        const managementTab = document.querySelector('[value="management"]') as HTMLElement
                        managementTab?.click()
                      }}>
                        View All {templates.length} Templates
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create Template Dialog - Available in Overview Tab */}
          <CreateTemplateDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onTemplateCreate={handleTemplateCreate}
          />

          {/* Edit Template Dialog - Available in Overview Tab */}
          <CreateTemplateDialog
            open={isEditDialogOpen}
            onOpenChange={handleEditDialogClose}
            onTemplateCreate={handleTemplateEditSave}
            editingTemplate={templateToEdit || undefined}
            isEditing={true}
          />

          {/* Template Details Panel - Available in Overview Tab */}
          <TemplateDetailsPanel
            template={selectedTemplate}
            isOpen={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            onUseTemplate={(template) => {
              toast({
                title: "Use Template",
                description: `Template "${template.title}" will be used in sandbox.`
              })
            }}
            onForkTemplate={(template) => handleTemplateClone(template.id)}
          />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Template Management</h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExportAll}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
            {templates.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No templates found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first template to get started
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            ) : (
              templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={(template) => {
                    setSelectedTemplate(template)
                    setIsPreviewOpen(true)
                  }}
                  onEdit={handleTemplateEdit}
                  onFork={(template) => handleTemplateClone(template.id)}
                  onExport={(template) => {
                    const blob = new Blob([JSON.stringify(template, null, 2)], {
                      type: 'application/json'
                    })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${template.title.replace(/\s+/g, '_').toLowerCase()}.json`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                    
                    toast({
                      title: "Export Complete",
                      description: `Template "${template.title}" exported successfully.`
                    })
                  }}
                  onDelete={handleTemplateDeleteRequest}
                  onPublish={handleTemplatePublish}
                  onUnpublish={handleTemplateUnpublish}
                  showPublishStatus={true}
                  currentUserId={session?.user?.id || 'current-user'}
                  isFavorite={templateFavorites[template.id]?.isFavorite || false}
                  favoriteCount={templateFavorites[template.id]?.count || 0}
                />
              ))
            )}
          </div>


          
          {/* Create Template Dialog - Added to Management Tab */}
          <CreateTemplateDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onTemplateCreate={handleTemplateCreate}
          />

          {/* Edit Template Dialog - Added to Management Tab */}
          <CreateTemplateDialog
            open={isEditDialogOpen}
            onOpenChange={handleEditDialogClose}
            onTemplateCreate={handleTemplateEditSave}
            editingTemplate={templateToEdit || undefined}
            isEditing={true}
          />

          {/* Template Details Panel - Added to Management Tab */}
          <TemplateDetailsPanel
            template={selectedTemplate}
            isOpen={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            onUseTemplate={(template) => {
              toast({
                title: "Use Template",
                description: `Template "${template.title}" will be used in sandbox.`
              })
            }}
            onForkTemplate={(template) => handleTemplateClone(template.id)}
          />
        </TabsContent>

        <TabsContent value="analytic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Template Analytics Dashboard</span>
              </CardTitle>
              <CardDescription>Detailed insights and performance metrics for your templates</CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
                  <p className="text-muted-foreground text-center">
                    Create templates to see detailed analytics and performance insights.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Template Performance Metrics */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Top Performing Template</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const topTemplate = templates.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))[0]
                          return (
                            <div>
                              <div className="text-lg font-bold truncate">{topTemplate.title}</div>
                              <div className="text-sm text-muted-foreground">{topTemplate.usageCount || 0} uses</div>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Most Forked</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const mostForked = templates.sort((a, b) => (b.forkCount || 0) - (a.forkCount || 0))[0]
                          return (
                            <div>
                              <div className="text-lg font-bold truncate">{mostForked.title}</div>
                              <div className="text-sm text-muted-foreground">{mostForked.forkCount || 0} forks</div>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Most Used</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const mostUsed = templates.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))[0]
                          return (
                            <div>
                              <div className="text-lg font-bold truncate">{mostUsed?.title || 'None'}</div>
                              <div className="text-sm text-muted-foreground">{mostUsed?.usageCount || 0} uses</div>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Category Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Template Distribution by Industry</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(() => {
                          const industryCount = templates.reduce((acc, template) => {
                            acc[template.industry] = (acc[template.industry] || 0) + 1
                            return acc
                          }, {} as Record<string, number>)
                          
                          const total = templates.length
                          return Object.entries(industryCount).map(([industry, count]) => (
                            <div key={industry} className="flex items-center justify-between">
                              <span className="text-sm font-medium">{industry}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${(count / total) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-8">{count}</span>
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
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