"use client"

export const runtime = 'edge'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TemplateDetailsPanel } from '@/components/template-details-panel'
import { CreateTemplateDialog } from '@/components/create-template-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { PromptTemplate } from '@/types'
import { templateService } from '@/services/template-service'
import { notifyTemplateUpdate } from '@/hooks/use-template-refresh'
import { ArrowLeft, Edit, Save, X, Eye, Star, GitFork, Download, Share2 } from 'lucide-react'

export default function TemplatePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  
  const templateId = params.id as string
  const isEditMode = searchParams.get('edit') === 'true'
  
  const [template, setTemplate] = useState<PromptTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(isEditMode)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(0)

  useEffect(() => {
    if (templateId) {
      loadTemplate()
    }
  }, [templateId])

  useEffect(() => {
    if (template && session?.user) {
      loadFavoriteStatus()
    }
  }, [template, session])

  const loadTemplate = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/templates/${templateId}`)
      const data = await response.json()
      
      if (data.success) {
        setTemplate(data.data)
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Template not found",
          variant: "destructive"
        })
        router.push('/templates')
      }
    } catch (error) {
      console.error('Error loading template:', error)
      toast({
        title: "Error",
        description: "Failed to load template",
        variant: "destructive"
      })
      router.push('/templates')
    } finally {
      setLoading(false)
    }
  }

  const loadFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/favorite`)
      const data = await response.json()
      if (data.success) {
        setIsFavorite(data.data.isFavorite)
        setFavoriteCount(data.data.favoriteCount)
      }
    } catch (error) {
      console.error('Error loading favorite status:', error)
    }
  }

  const handleTemplateUpdate = async (templateData: Partial<PromptTemplate>) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateData)
      })

      const data = await response.json()
      
      if (data.success) {
        setTemplate(data.data)
        setIsEditDialogOpen(false)
        setIsEditing(false)
        
        // Notify other components about the update
        notifyTemplateUpdate(templateId)
        
        toast({
          title: "Template Updated",
          description: "Your template has been updated successfully."
        })
        router.replace(`/templates/${templateId}`)
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to update template",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating template:', error)
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive"
      })
    }
  }

  const handleFavoriteToggle = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to favorite templates",
        variant: "destructive"
      })
      return
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const response = await fetch(`/api/templates/${templateId}/favorite`, {
        method
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsFavorite(!isFavorite)
        setFavoriteCount(data.data.favoriteCount)
        toast({
          title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
          description: `Template "${template?.title}" has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`
        })
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to update favorites",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      })
    }
  }

  const handleFork = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/fork`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: `${template?.title} (Fork)`
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Template Forked",
          description: "Template has been forked to your collection."
        })
        router.push(`/templates/${data.data.id}?edit=true`)
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to fork template",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error forking template:', error)
      toast({
        title: "Error",
        description: "Failed to fork template",
        variant: "destructive"
      })
    }
  }

  const handleExport = () => {
    if (!template) return

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
  }

  const canEdit = template && session?.user?.id === template.userId

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading template...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
          <p className="text-muted-foreground mb-4">The template you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/templates')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleFavoriteToggle}
            className={isFavorite ? "bg-yellow-50 text-yellow-600 border-yellow-200" : ""}
          >
            <Star className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
            {favoriteCount}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleFork}>
            <GitFork className="h-4 w-4 mr-1" />
            Fork
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          {canEdit && (
            <>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditDialogOpen(true)}
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false)
                    router.replace(`/templates/${templateId}`)
                  }}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel Edit
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Template Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">{template.title}</CardTitle>
              <CardDescription className="text-lg">{template.description}</CardDescription>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{template.industry}</Badge>
                <Badge variant="outline">{template.status}</Badge>
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              By {template.author} • Created {new Date(template.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-4">
              <span>{template.usageCount} uses</span>
              <span>{template.forkCount} forks</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground">Template details and configuration information.</p>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {canEdit && (
        <CreateTemplateDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onTemplateCreate={handleTemplateUpdate}
          editingTemplate={template}
          isEditing={true}
        />
      )}
    </div>
  )
}