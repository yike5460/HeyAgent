"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useSession } from "next-auth/react"
import { toast } from '@/components/ui/use-toast'
import { 
  Play, 
  Square, 
  Terminal, 
  FileText, 
  Settings, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  Trash2
} from 'lucide-react'

interface SandboxSession {
  id: string
  templateId: string
  templateTitle: string
  status: 'running' | 'stopped' | 'error'
  startTime: Date
  lastActivity: Date
  logs: string[]
}

export default function SandboxPage() {
  const { data: session } = useSession()
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [parameters, setParameters] = useState<Record<string, string>>({})
  const [activeSessions, setActiveSessions] = useState<SandboxSession[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const mockTemplates = [
    { id: '1', title: 'Short Drama Production Assistant', parameters: ['genre', 'duration', 'theme'] },
    { id: '2', title: 'E-commerce Product Description', parameters: ['product', 'features', 'tone'] },
    { id: '3', title: 'Social Media Content Creator', parameters: ['platform', 'audience', 'goal'] }
  ]

  const startSandbox = async () => {
    if (!selectedTemplate) {
      toast({ title: "Please select a template", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const template = mockTemplates.find(t => t.id === selectedTemplate)
      if (!template) throw new Error('Template not found')

      const newSession: SandboxSession = {
        id: `session_${Date.now()}`,
        templateId: selectedTemplate,
        templateTitle: template.title,
        status: 'running',
        startTime: new Date(),
        lastActivity: new Date(),
        logs: [
          `[${new Date().toLocaleTimeString()}] Sandbox session started`,
          `[${new Date().toLocaleTimeString()}] Loading template: ${template.title}`,
          `[${new Date().toLocaleTimeString()}] Initializing environment...`,
          `[${new Date().toLocaleTimeString()}] Ready for execution`
        ]
      }

      setActiveSessions(prev => [...prev, newSession])
      setSelectedSession(newSession.id)
      toast({ title: "Sandbox started successfully" })
    } catch (error) {
      toast({ title: "Failed to start sandbox", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const stopSandbox = async (sessionId: string) => {
    setActiveSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'stopped' as const }
          : session
      )
    )
    toast({ title: "Sandbox stopped" })
  }

  const deleteSandbox = async (sessionId: string) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
    if (selectedSession === sessionId) {
      setSelectedSession(null)
    }
    toast({ title: "Sandbox session deleted" })
  }

  const executePrompt = async () => {
    if (!selectedSession) return
    
    const currentSession = activeSessions.find(s => s.id === selectedSession)
    if (!currentSession) return

    const newLog = `[${new Date().toLocaleTimeString()}] Executing prompt with parameters: ${JSON.stringify(parameters)}`
    
    setActiveSessions(prev => 
      prev.map(session => 
        session.id === selectedSession
          ? { 
              ...session, 
              logs: [...session.logs, newLog, `[${new Date().toLocaleTimeString()}] Execution completed successfully`],
              lastActivity: new Date()
            }
          : session
      )
    )
  }

  const currentSession = activeSessions.find(s => s.id === selectedSession)
  const currentTemplate = mockTemplates.find(t => t.id === selectedTemplate)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sandbox Environment</h1>
          <p className="text-muted-foreground mt-2">
            Test and execute your prompt templates in a safe environment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection & Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Template Configuration
              </CardTitle>
              <CardDescription>
                Select a template and configure parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentTemplate && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Parameters</label>
                  {currentTemplate.parameters.map((param) => (
                    <div key={param}>
                      <Input
                        placeholder={`Enter ${param}`}
                        value={parameters[param] || ''}
                        onChange={(e) => setParameters(prev => ({ ...prev, [param]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={startSandbox} 
                disabled={!selectedTemplate || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Sandbox
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Active Sessions
                </span>
                <Badge variant="secondary">{activeSessions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No active sessions
                  </p>
                ) : (
                  activeSessions.map((sessionItem) => (
                    <div
                      key={sessionItem.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSession === sessionItem.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedSession(sessionItem.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm truncate">
                          {sessionItem.templateTitle}
                        </span>
                        <div className="flex items-center gap-2">
                          {sessionItem.status === 'running' && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            </div>
                          )}
                          {sessionItem.status === 'stopped' && (
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          )}
                          {sessionItem.status === 'error' && (
                            <AlertCircle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Started: {sessionItem.startTime.toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Execution Area */}
        <div className="lg:col-span-2 space-y-6">
          {currentSession ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {currentSession.templateTitle}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={currentSession.status === 'running' ? 'default' : 'secondary'}
                        className={currentSession.status === 'running' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {currentSession.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => stopSandbox(currentSession.id)}
                        disabled={currentSession.status !== 'running'}
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSandbox(currentSession.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Test Input</label>
                    <Textarea
                      placeholder="Enter your test input here..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <Button 
                    onClick={executePrompt}
                    disabled={currentSession.status !== 'running'}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Execute Prompt
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      Session Logs
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                    {currentSession.logs.map((log, index) => (
                      <div key={index} className="mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Session Selected</h3>
                <p className="text-muted-foreground text-center">
                  Start a new sandbox session or select an existing one to begin testing your prompts
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}