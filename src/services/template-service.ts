import { PromptTemplate, TemplateImportResult, ConflictResolution } from '@/types'
import { localStorageService } from './local-storage'

class TemplateService {
  private useDatabase(): boolean {
    // Use database in production, localStorage in development
    return process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_DATABASE === 'true'
  }

  // Template CRUD Operations
  async getAllTemplates(includeUserTemplates: boolean = false): Promise<PromptTemplate[]> {
    if (this.useDatabase()) {
      try {
        // Try to get from local cache first for faster loading
        const cachedTemplates = await localStorageService.getAllTemplates()
        
        // Fetch from API in background
        const url = includeUserTemplates ? '/api/templates?includeUserTemplates=true' : '/api/templates'
        const response = await fetch(url)
        if (!response.ok) {
          console.error('Failed to fetch templates from API:', response.status)
          // Return cached templates if API fails
          return cachedTemplates
        }
        
        const result = await response.json()
        const apiTemplates = result?.data || result || []
        
        // Update local cache with fresh data
        if (Array.isArray(apiTemplates) && apiTemplates.length > 0) {
          // Store each template in local cache for faster access next time
          for (const template of apiTemplates) {
            if (template && template.id) {
              await localStorageService.saveTemplate(template).catch(() => {
                // Ignore cache errors, don't break the main flow
              })
            }
          }
        }
        
        return Array.isArray(apiTemplates) ? apiTemplates : []
      } catch (error) {
        console.error('Error fetching templates from API:', error)
        // Fallback to cached templates
        return await localStorageService.getAllTemplates()
      }
    } else {
      return await localStorageService.getAllTemplates()
    }
  }

  async getUserTemplates(): Promise<PromptTemplate[]> {
    if (this.useDatabase()) {
      try {
        // Try to get from local cache first for faster loading
        const cachedTemplates = await localStorageService.getAllTemplates()
        
        // Fetch from API in background - use userTemplatesOnly parameter
        const response = await fetch('/api/templates?userTemplatesOnly=true')
        if (!response.ok) {
          console.error('Failed to fetch user templates from API:', response.status)
          // Return cached templates if API fails
          return cachedTemplates.filter(t => t.userId === 'current-user') // Filter cached templates too
        }
        
        const result = await response.json()
        const apiTemplates = result?.data || result || []
        
        // Update local cache with fresh data
        if (Array.isArray(apiTemplates) && apiTemplates.length > 0) {
          // Store each template in local cache for faster access next time
          for (const template of apiTemplates) {
            if (template && template.id) {
              await localStorageService.saveTemplate(template).catch(() => {
                // Ignore cache errors, don't break the main flow
              })
            }
          }
        }
        
        return Array.isArray(apiTemplates) ? apiTemplates : []
      } catch (error) {
        console.error('Error fetching user templates from API:', error)
        // Fallback to cached templates filtered by user
        const cachedTemplates = await localStorageService.getAllTemplates()
        return cachedTemplates.filter(t => t.userId === 'current-user')
      }
    } else {
      const allTemplates = await localStorageService.getAllTemplates()
      return allTemplates.filter(t => t.userId === 'current-user')
    }
  }

  async getTemplate(id: string): Promise<PromptTemplate | null> {
    if (this.useDatabase()) {
      try {
        // Try local cache first
        const cachedTemplate = await localStorageService.getTemplate(id)
        
        // Fetch from API
        const response = await fetch(`/api/templates/${id}`)
        if (!response.ok) {
          if (response.status === 404) return cachedTemplate // Return cached if exists
          console.error('Failed to fetch template from API:', response.status)
          return cachedTemplate // Return cached if API fails
        }
        
        const result = await response.json()
        const apiTemplate = result?.data || result
        
        // Update local cache
        if (apiTemplate) {
          await localStorageService.saveTemplate(apiTemplate).catch(() => {
            // Ignore cache errors
          })
        }
        
        return apiTemplate
      } catch (error) {
        console.error('Error fetching template from API:', error)
        // Fallback to cached template
        return await localStorageService.getTemplate(id)
      }
    } else {
      return await localStorageService.getTemplate(id)
    }
  }

  async saveTemplate(template: PromptTemplate): Promise<PromptTemplate> {
    if (this.useDatabase()) {
      try {
        // Check if template exists in database first
        let isNewTemplate = !template.id || template.id.startsWith('template-')
        
        // If template has an ID, try to fetch it to determine if it exists
        if (template.id && !template.id.startsWith('template-')) {
          try {
            const existingTemplate = await this.getTemplate(template.id)
            isNewTemplate = !existingTemplate
          } catch (error) {
            // If fetch fails, assume it's new
            isNewTemplate = true
          }
        }
        
        const method = isNewTemplate ? 'POST' : 'PUT'
        const url = isNewTemplate ? '/api/templates' : `/api/templates/${template.id}`
        
        // For new templates, remove the client-generated ID to let server generate it
        const templateData = isNewTemplate ? 
          { ...template, id: undefined } : 
          template
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateData)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(`Failed to save template: ${response.status} - ${JSON.stringify(errorData)}`)
        }

        const result = await response.json()
        const savedTemplate = result?.data || result // Handle both { data: template } and direct template responses
        
        // Update local cache with the saved template
        await localStorageService.saveTemplate(savedTemplate).catch(() => {
          // Ignore cache errors, don't break the main flow
        })
        
        return savedTemplate
      } catch (error) {
        console.error('Error saving template to API:', error)
        throw error
      }
    } else {
      return await localStorageService.saveTemplate(template)
    }
  }

  async deleteTemplate(id: string): Promise<boolean> {
    if (this.useDatabase()) {
      try {
        const response = await fetch(`/api/templates/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Remove from local cache too
          await localStorageService.deleteTemplate(id).catch(() => {
            // Ignore cache errors
          })
        }
        
        return response.ok
      } catch (error) {
        console.error('Error deleting template from API:', error)
        return false
      }
    } else {
      return await localStorageService.deleteTemplate(id)
    }
  }

  // Template Cloning
  async cloneTemplate(
    sourceId: string, 
    newTitle: string,
    inheritanceConfig?: {
      inheritedComponents: string[]
      mergeStrategy: 'override' | 'merge' | 'append'
    }
  ): Promise<PromptTemplate | null> {
    if (this.useDatabase()) {
      try {
        const response = await fetch(`/api/templates/${sourceId}/clone`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newTitle,
            inheritanceConfig
          })
        })

        if (!response.ok) {
          console.error('Failed to clone template:', response.status)
          return null
        }

        return await response.json()
      } catch (error) {
        console.error('Error cloning template:', error)
        return null
      }
    } else {
      return await localStorageService.cloneTemplate(sourceId, newTitle, inheritanceConfig)
    }
  }

  // Import/Export Operations
  async exportTemplate(id: string): Promise<string | null> {
    if (this.useDatabase()) {
      try {
        const response = await fetch(`/api/templates/${id}/export`)
        if (!response.ok) return null
        
        const blob = await response.blob()
        return await blob.text()
      } catch (error) {
        console.error('Error exporting template:', error)
        return null
      }
    } else {
      return await localStorageService.exportTemplate(id)
    }
  }

  async importTemplate(jsonData: string): Promise<TemplateImportResult> {
    if (this.useDatabase()) {
      try {
        const response = await fetch('/api/templates/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jsonData })
        })

        if (!response.ok) {
          return {
            success: false,
            errors: [`Import failed: ${response.status}`],
            warnings: []
          }
        }

        return await response.json()
      } catch (error) {
        return {
          success: false,
          errors: [`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`],
          warnings: []
        }
      }
    } else {
      return await localStorageService.importTemplate(jsonData)
    }
  }

  // Preview Generation
  async generatePreview(template: PromptTemplate): Promise<{
    sampleInputs: Record<string, any>
    expectedOutputs: Record<string, any>
    executionFlow: Array<{
      stepId: string
      name: string
      type: string
      duration: number
      status: string
    }>
    estimatedCost: number
    estimatedTime: number
  }> {
    // This functionality is the same for both environments
    return await localStorageService.generatePreview(template)
  }

  // Batch Operations
  async batchDelete(ids: string[]): Promise<{ deleted: string[], failed: string[] }> {
    if (this.useDatabase()) {
      try {
        const response = await fetch('/api/templates/batch-delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids })
        })

        if (!response.ok) {
          return { deleted: [], failed: ids }
        }

        return await response.json()
      } catch (error) {
        console.error('Error in batch delete:', error)
        return { deleted: [], failed: ids }
      }
    } else {
      return await localStorageService.batchDelete(ids)
    }
  }

  async searchTemplates(query: string, filters?: {
    industry?: string
    tags?: string[]
    status?: string
  }): Promise<PromptTemplate[]> {
    if (this.useDatabase()) {
      try {
        const params = new URLSearchParams()
        if (query) params.append('q', query)
        if (filters?.industry) params.append('industry', filters.industry)
        if (filters?.tags) params.append('tags', filters.tags.join(','))
        if (filters?.status) params.append('status', filters.status)

        const response = await fetch(`/api/templates/search?${params}`)
        if (!response.ok) {
          console.error('Search failed:', response.status)
          return []
        }

        return await response.json()
      } catch (error) {
        console.error('Error searching templates:', error)
        return []
      }
    } else {
      return await localStorageService.searchTemplates(query, filters)
    }
  }

  // Clear all data (for development/testing)
  async clearAllData(): Promise<void> {
    if (this.useDatabase()) {
      // Don't implement this for production database
      console.warn('clearAllData not available in database mode')
      return
    } else {
      return await localStorageService.clearAllData()
    }
  }
}

export const templateService = new TemplateService()