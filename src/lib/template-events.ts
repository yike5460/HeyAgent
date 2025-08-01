// Simple event system for template updates
type TemplateUpdateListener = (templateId: string) => void

class TemplateEvents {
  private listeners: TemplateUpdateListener[] = []

  // Subscribe to template update events
  subscribe(listener: TemplateUpdateListener): () => void {
    this.listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Notify all listeners that a template was updated
  notifyUpdate(templateId: string) {
    this.listeners.forEach(listener => listener(templateId))
  }
}

export const templateEvents = new TemplateEvents()