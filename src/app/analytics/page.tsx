"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useSession } from "next-auth/react"
import { BarChart, LineChart, PieChart, TrendingUp, Users, Activity, Clock, Download } from 'lucide-react'

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedTemplate, setSelectedTemplate] = useState('all')

  const mockAnalytics = {
    usage: {
      totalExecutions: 1247,
      uniqueUsers: 89,
      averageExecutionTime: 2.3,
      successRate: 94.2
    },
    topTemplates: [
      { name: 'Short Drama Production', executions: 234, growth: 12.5 },
      { name: 'E-commerce Product Description', executions: 189, growth: 8.3 },
      { name: 'Social Media Content Creator', executions: 156, growth: -2.1 }
    ],
    executionTrends: [
      { date: '2024-01-01', executions: 45 },
      { date: '2024-01-02', executions: 52 },
      { date: '2024-01-03', executions: 48 },
      { date: '2024-01-04', executions: 61 },
      { date: '2024-01-05', executions: 59 },
      { date: '2024-01-06', executions: 67 },
      { date: '2024-01-07', executions: 73 }
    ]
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track usage patterns and performance metrics for your prompt templates
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.usage.totalExecutions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.usage.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.usage.averageExecutionTime}s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+0.3s</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.usage.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Top Performing Templates
            </CardTitle>
            <CardDescription>
              Most executed templates in the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.topTemplates.map((template, index) => (
                <div key={template.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.executions} executions</p>
                    </div>
                  </div>
                  <Badge 
                    variant={template.growth > 0 ? 'default' : 'destructive'}
                    className={template.growth > 0 ? 'bg-green-100 text-green-800' : ''}
                  >
                    {template.growth > 0 ? '+' : ''}{template.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Execution Trends
            </CardTitle>
            <CardDescription>
              Daily execution patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-1">
              {mockAnalytics.executionTrends.map((trend, index) => (
                <div key={trend.date} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-primary/80 w-full rounded-t-sm min-h-[4px]"
                    style={{ height: `${(trend.executions / 80) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">
                    {new Date(trend.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Usage by Industry
          </CardTitle>
          <CardDescription>
            Distribution of template usage across different industries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { industry: 'Media & Entertainment', percentage: 35, executions: 438 },
              { industry: 'E-commerce', percentage: 28, executions: 349 },
              { industry: 'Technology', percentage: 22, executions: 274 },
              { industry: 'Marketing', percentage: 15, executions: 186 }
            ].map((item) => (
              <div key={item.industry} className="text-center">
                <div className="text-2xl font-bold text-primary">{item.percentage}%</div>
                <p className="text-sm font-medium">{item.industry}</p>
                <p className="text-xs text-muted-foreground">{item.executions} executions</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}