import { PromptTemplate, TemplateImportResult, ConflictResolution } from '@/types'

const STORAGE_KEYS = {
  TEMPLATES: 'heyprompt_templates',
  TEMPLATE_COUNTER: 'heyprompt_template_counter',
} as const

export class LocalStorageService {
  private isClient = typeof window !== 'undefined'

  // Template CRUD Operations
  async getAllTemplates(): Promise<PromptTemplate[]> {
    if (!this.isClient) return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATES)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading templates from localStorage:', error)
      return []
    }
  }

  async getTemplate(id: string): Promise<PromptTemplate | null> {
    const templates = await this.getAllTemplates()
    return templates.find(t => t.id === id) || null
  }

  async saveTemplate(template: PromptTemplate): Promise<PromptTemplate> {
    if (!this.isClient) throw new Error('localStorage not available')

    const templates = await this.getAllTemplates()
    const existingIndex = templates.findIndex(t => t.id === template.id)
    
    const updatedTemplate = {
      ...template,
      updatedAt: new Date().toISOString()
    }

    if (existingIndex >= 0) {
      // Update existing template
      templates[existingIndex] = updatedTemplate
    } else {
      // Create new template
      if (!template.id) {
        updatedTemplate.id = this.generateId()
      }
      updatedTemplate.createdAt = new Date().toISOString()
      templates.push(updatedTemplate)
    }

    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates))
    return updatedTemplate
  }

  async deleteTemplate(id: string): Promise<boolean> {
    if (!this.isClient) throw new Error('localStorage not available')

    const templates = await this.getAllTemplates()
    const filteredTemplates = templates.filter(t => t.id !== id)
    
    if (filteredTemplates.length === templates.length) {
      return false // Template not found
    }

    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(filteredTemplates))
    return true
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
    const sourceTemplate = await this.getTemplate(sourceId)
    if (!sourceTemplate) return null

    const clonedTemplate: PromptTemplate = {
      ...sourceTemplate,
      id: this.generateId(),
      title: newTitle,
      parentTemplateId: sourceId,
      isForked: true,
      forkCount: 0,
      version: 1,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      rating: 0,
      inheritanceConfig: inheritanceConfig ? {
        inheritedComponents: inheritanceConfig.inheritedComponents as any,
        customizations: [],
        mergeStrategy: inheritanceConfig.mergeStrategy
      } : undefined
    }

    // Update parent template fork count
    const parentTemplate = await this.getTemplate(sourceId)
    if (parentTemplate) {
      parentTemplate.forkCount = (parentTemplate.forkCount || 0) + 1
      await this.saveTemplate(parentTemplate)
    }

    return await this.saveTemplate(clonedTemplate)
  }

  // Import/Export Operations
  async exportTemplate(id: string): Promise<string | null> {
    const template = await this.getTemplate(id)
    if (!template) return null

    const exportData = {
      ...template,
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'current-user',
        version: template.version,
        includeSecrets: false,
        format: 'json' as const,
        checksum: this.generateChecksum(JSON.stringify(template))
      }
    }

    return JSON.stringify(exportData, null, 2)
  }

  async importTemplate(jsonData: string): Promise<TemplateImportResult> {
    try {
      const templateData = JSON.parse(jsonData) as PromptTemplate
      
      // Validate required fields
      if (!templateData.title || !templateData.description) {
        return {
          success: false,
          errors: ['Template must have title and description'],
          warnings: []
        }
      }

      // Check for conflicts
      const existingTemplates = await this.getAllTemplates()
      const conflicts: ConflictResolution[] = []
      
      // Check for name conflicts
      const nameConflict = existingTemplates.find(t => t.title === templateData.title)
      if (nameConflict) {
        templateData.title = `${templateData.title} (Imported)`
        conflicts.push({
          field: 'title',
          conflict: 'name_exists',
          resolution: 'rename',
          newValue: templateData.title
        })
      }

      // Generate new ID and reset metadata
      const importedTemplate: PromptTemplate = {
        ...templateData,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 0,
        forkCount: 0,
        isForked: false,
        status: 'draft'
      }

      const savedTemplate = await this.saveTemplate(importedTemplate)

      return {
        success: true,
        templateId: savedTemplate.id,
        errors: [],
        warnings: conflicts.length > 0 ? ['Some conflicts were automatically resolved'] : [],
        conflictResolutions: conflicts
      }
    } catch (error) {
      return {
        success: false,
        errors: [`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: []
      }
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
    // Mock preview generation
    return {
      sampleInputs: {
        userInput: "Sample user input for " + template.title,
        parameters: template.promptConfig.parameters.reduce((acc, param) => {
          acc[param.name] = param.defaultValue || `sample_${param.type}`
          return acc
        }, {} as Record<string, any>)
      },
      expectedOutputs: {
        result: "Expected output based on the template configuration",
        metadata: {
          tokensUsed: Math.floor(Math.random() * 1000) + 100,
          processingTime: Math.floor(Math.random() * 5000) + 1000
        }
      },
      executionFlow: [
        {
          stepId: 'prompt_processing',
          name: 'Process System Prompt',
          type: 'prompt',
          duration: 150,
          status: 'completed'
        },
        {
          stepId: 'llm_execution',
          name: 'Execute LLM',
          type: 'llm',
          duration: 2500,
          status: 'completed'
        },
        ...(template.mcpServers || []).map((server, index) => ({
          stepId: `mcp_${index}`,
          name: `Execute ${server.serverId}`,
          type: 'mcp-call',
          duration: Math.floor(Math.random() * 1000) + 500,
          status: 'completed'
        }))
      ],
      estimatedCost: Math.random() * 0.1 + 0.01,
      estimatedTime: Math.floor(Math.random() * 5000) + 2000
    }
  }

  // Utility Methods
  private generateId(): string {
    if (!this.isClient) return Math.random().toString(36).substr(2, 9)
    
    const counter = parseInt(localStorage.getItem(STORAGE_KEYS.TEMPLATE_COUNTER) || '0') + 1
    localStorage.setItem(STORAGE_KEYS.TEMPLATE_COUNTER, counter.toString())
    return `template_${counter}_${Date.now()}`
  }

  private generateChecksum(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }

  // Batch Operations
  async batchDelete(ids: string[]): Promise<{ deleted: string[], failed: string[] }> {
    const deleted: string[] = []
    const failed: string[] = []

    for (const id of ids) {
      const success = await this.deleteTemplate(id)
      if (success) {
        deleted.push(id)
      } else {
        failed.push(id)
      }
    }

    return { deleted, failed }
  }

  async searchTemplates(query: string, filters?: {
    industry?: string
    tags?: string[]
    status?: string
  }): Promise<PromptTemplate[]> {
    const templates = await this.getAllTemplates()
    
    return templates.filter(template => {
      // Text search
      const matchesQuery = !query || 
        template.title.toLowerCase().includes(query.toLowerCase()) ||
        template.description.toLowerCase().includes(query.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))

      // Filter by industry
      const matchesIndustry = !filters?.industry || template.industry === filters.industry

      // Filter by tags
      const matchesTags = !filters?.tags?.length || 
        filters.tags.some(tag => template.tags && template.tags.includes(tag))

      // Filter by status
      const matchesStatus = !filters?.status || template.status === filters.status

      return matchesQuery && matchesIndustry && matchesTags && matchesStatus
    })
  }

  // Clear all data (for development/testing)
  async clearAllData(): Promise<void> {
    if (!this.isClient) return
    
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES)
    localStorage.removeItem(STORAGE_KEYS.TEMPLATE_COUNTER)
  }
}

export const localStorageService = new LocalStorageService()