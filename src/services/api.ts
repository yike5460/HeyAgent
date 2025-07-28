import { APIResponse, PromptTemplate, SearchFilters, SortOptions } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class APIService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed')
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  // Template Management
  async getTemplates(
    filters?: SearchFilters,
    sort?: SortOptions,
    page = 1,
    limit = 20
  ): Promise<APIResponse<PromptTemplate[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters) {
      if (filters.industry) params.append('industry', filters.industry.join(','))
      if (filters.tags) params.append('tags', filters.tags.join(','))
      if (filters.complexity) params.append('complexity', filters.complexity)
      if (filters.author) params.append('author', filters.author)
      if (filters.dateRange) {
        params.append('dateStart', filters.dateRange.start)
        params.append('dateEnd', filters.dateRange.end)
      }
    }

    if (sort) {
      params.append('sortField', sort.field)
      params.append('sortDirection', sort.direction)
    }

    return this.request<PromptTemplate[]>(`/templates?${params}`)
  }

  async getTemplate(id: string): Promise<APIResponse<PromptTemplate>> {
    return this.request<PromptTemplate>(`/templates/${id}`)
  }

  async createTemplate(template: Partial<PromptTemplate>): Promise<APIResponse<PromptTemplate>> {
    return this.request<PromptTemplate>('/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    })
  }

  async updateTemplate(
    id: string,
    template: Partial<PromptTemplate>
  ): Promise<APIResponse<PromptTemplate>> {
    return this.request<PromptTemplate>(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    })
  }

  async deleteTemplate(id: string): Promise<APIResponse<void>> {
    return this.request<void>(`/templates/${id}`, {
      method: 'DELETE',
    })
  }

  async cloneTemplate(id: string, customizations?: Partial<PromptTemplate>): Promise<APIResponse<PromptTemplate>> {
    return this.request<PromptTemplate>(`/templates/${id}/clone`, {
      method: 'POST',
      body: JSON.stringify(customizations || {}),
    })
  }

  async importTemplates(templates: PromptTemplate[]): Promise<APIResponse<PromptTemplate[]>> {
    return this.request<PromptTemplate[]>('/templates', {
      method: 'POST',
      body: JSON.stringify({ action: 'import', templates }),
    })
  }

  async exportTemplate(templateId: string): Promise<APIResponse<PromptTemplate>> {
    return this.request<PromptTemplate>(`/templates/${templateId}`)
  }

  async exportAllTemplates(): Promise<APIResponse<PromptTemplate[]>> {
    return this.request<PromptTemplate[]>('/templates?limit=1000')
  }

  // Sandbox Management
  async startSandbox(templateId: string): Promise<APIResponse<{ sessionId: string }>> {
    return this.request<{ sessionId: string }>('/sandbox/start', {
      method: 'POST',
      body: JSON.stringify({ templateId }),
    })
  }

  async stopSandbox(sessionId: string): Promise<APIResponse<void>> {
    return this.request<void>(`/sandbox/stop/${sessionId}`, {
      method: 'POST',
    })
  }

  async getSandboxStatus(sessionId: string): Promise<APIResponse<any>> {
    return this.request<any>(`/sandbox/status/${sessionId}`)
  }

  async getSandboxLogs(sessionId: string): Promise<APIResponse<string[]>> {
    return this.request<string[]>(`/sandbox/logs/${sessionId}`)
  }

  // Analytics
  async getUsageAnalytics(
    templateId?: string,
    dateRange?: { start: string; end: string }
  ): Promise<APIResponse<any>> {
    const params = new URLSearchParams()
    if (templateId) params.append('templateId', templateId)
    if (dateRange) {
      params.append('dateStart', dateRange.start)
      params.append('dateEnd', dateRange.end)
    }

    return this.request<any>(`/analytics/usage?${params}`)
  }

  async getPerformanceMetrics(
    templateId?: string
  ): Promise<APIResponse<any>> {
    const params = templateId ? `?templateId=${templateId}` : ''
    return this.request<any>(`/analytics/performance${params}`)
  }

  // User Management
  async getUserProfile(): Promise<APIResponse<any>> {
    return this.request<any>('/users')
  }

  async updateUserProfile(profile: any): Promise<APIResponse<any>> {
    return this.request<any>('/users', {
      method: 'PUT',
      body: JSON.stringify(profile),
    })
  }

  // Collaboration
  async inviteCollaborator(
    templateId: string,
    email: string,
    role: string
  ): Promise<APIResponse<any>> {
    return this.request<any>(`/templates/${templateId}/collaborators`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    })
  }

  async getCollaborators(templateId: string): Promise<APIResponse<any[]>> {
    return this.request<any[]>(`/templates/${templateId}/collaborators`)
  }

  async removeCollaborator(
    templateId: string,
    userId: string
  ): Promise<APIResponse<void>> {
    return this.request<void>(`/templates/${templateId}/collaborators/${userId}`, {
      method: 'DELETE',
    })
  }

  // Search
  async searchTemplates(query: string): Promise<APIResponse<PromptTemplate[]>> {
    const params = new URLSearchParams({ q: query })
    return this.request<PromptTemplate[]>(`/search?${params}`)
  }

  async getSearchSuggestions(query: string): Promise<APIResponse<string[]>> {
    const params = new URLSearchParams({ q: query })
    return this.request<string[]>(`/search/suggestions?${params}`)
  }

  // File Upload
  async uploadFile(file: File, type: 'template' | 'asset'): Promise<APIResponse<{ url: string }>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return this.request<{ url: string }>('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    })
  }

  // Health Check
  async healthCheck(): Promise<APIResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/health')
  }
}

export const apiService = new APIService()
export default apiService