import { useEffect, useState, useCallback } from 'react'
import { PromptTemplate } from '@/types'
import { templateEvents } from '@/lib/template-events'

// Simple hook to refresh template data when notified of updates
export function useTemplateRefresh(templateId: string, initialTemplate?: PromptTemplate) {
  const [template, setTemplate] = useState<PromptTemplate | null>(initialTemplate || null)
  const [loading, setLoading] = useState(false)

  // Function to fetch latest template data
  const refreshTemplate = useCallback(async () => {
    if (!templateId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/templates/${templateId}`)
      const data = await response.json()
      
      if (data.success) {
        setTemplate(data.data)
      }
    } catch (error) {
      console.error('Error refreshing template:', error)
    } finally {
      setLoading(false)
    }
  }, [templateId])

  // Listen for template update events
  useEffect(() => {
    if (!templateId) return

    const unsubscribe = templateEvents.subscribe((updatedTemplateId) => {
      if (updatedTemplateId === templateId) {
        refreshTemplate()
      }
    })

    return unsubscribe
  }, [templateId, refreshTemplate])

  // Load initial data if not provided
  useEffect(() => {
    if (!template && templateId) {
      refreshTemplate()
    }
  }, [template, templateId, refreshTemplate])

  return {
    template,
    loading,
    refreshTemplate
  }
}

// Utility function to notify about template updates (used by edit panel)
export function notifyTemplateUpdate(templateId: string) {
  templateEvents.notifyUpdate(templateId)
}