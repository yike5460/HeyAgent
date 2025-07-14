"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Database, 
  Settings, 
  Workflow, 
  Users, 
  User,
  ArrowRight,
  Star,
  GitBranch,
  Zap,
  MessageSquare,
  Network,
  TrendingUp,
  Activity,
  Sparkles,
  Play,
  ChevronRight,
  Code2,
  Globe,
  Container,
  Layers3
} from 'lucide-react'
import Link from 'next/link'

interface DashboardHeroProps {
  publicStats: {
    totalTemplates: number
    totalUsage: number
    averageRating: number
    totalForks: number
  }
  myTemplatesCount: number
  myDraftCount: number
  loading: boolean
}

export function DashboardHero({ 
  publicStats, 
  myTemplatesCount, 
  myDraftCount, 
  loading 
}: DashboardHeroProps) {
  const { data: session } = useSession()
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border-2 border-primary/10 shadow-lg">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-foreground leading-tight">
                  Marketplace for
                  <br />
                  <span className="text-primary">Agentic Templates</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Centralized repository for deterministic agent prototyping with model provider, production-tested prompts and MCP servers.
                </p>
              </div>
            </div>

            {/* Right Side - Agentic Template Architecture Diagram */}
            <div className="relative">
              <div className="relative w-full h-80 flex items-center justify-center p-4">
                {/* Agentic Template Workflow SVG */}
                <div className="w-full h-full flex items-center justify-center">
                  <svg 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 702.025390625 418.3671875" 
                    className="w-full h-full max-w-lg max-h-72"
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
                  >
                    <rect x="0" y="0" width="702.025390625" height="418.3671875" fill="transparent"></rect>
                    
                    {/* Prompt Box */}
                    <g strokeLinecap="round" transform="translate(10 158.59765625) rotate(0 86.5234375 31.48828125)">
                      <path d="M15.74 0 C69.93 0.35, 128.26 -2.67, 157.3 0 M15.74 0 C55.11 2, 97.06 0.7, 157.3 0 M157.3 0 C168.88 1.93, 172.04 5.27, 173.05 15.74 M157.3 0 C168.12 2.03, 171.57 4.06, 173.05 15.74 M173.05 15.74 C171.93 25.17, 174.49 33.6, 173.05 47.23 M173.05 15.74 C173.69 26.02, 172.96 37.02, 173.05 47.23 M173.05 47.23 C174.79 59.37, 166.27 62.99, 157.3 62.98 M173.05 47.23 C170.79 58.13, 167.53 63.23, 157.3 62.98 M157.3 62.98 C102.97 61.8, 50.23 62.76, 15.74 62.98 M157.3 62.98 C116.95 62.3, 75.77 62.73, 15.74 62.98 M15.74 62.98 C4.54 61.51, -1.94 59.37, 0 47.23 M15.74 62.98 C3.87 62.72, 0.61 57.89, 0 47.23 M0 47.23 C0.55 40.95, -0.51 29.38, 0 15.74 M0 47.23 C-0.54 37.54, 0.44 26.8, 0 15.74 M0 15.74 C-1.63 5.68, 5.04 0.14, 15.74 0 M0 15.74 C1.61 6.77, 5.22 0.8, 15.74 0" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"></path>
                    </g>
                    <g transform="translate(61.893455505371094 177.5859375) rotate(0 34.629981994628906 12.5)">
                      <text x="34.629981994628906" y="17.619999999999997" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20px" fill="hsl(var(--foreground))" textAnchor="middle" style={{whiteSpace: 'pre'}} direction="ltr" dominantBaseline="alphabetic">Prompt</text>
                    </g>

                    {/* Model Box */}
                    <g strokeLinecap="round" transform="translate(238.34765625 157.82421875) rotate(0 86.5234375 31.48828125)">
                      <path d="M15.74 0 C57.54 -2.11, 97.74 -1.57, 157.3 0 M15.74 0 C58.62 0.49, 100.67 1.75, 157.3 0 M157.3 0 C169.27 0.74, 171.61 3.35, 173.05 15.74 M157.3 0 C168.9 2.29, 173.89 5.9, 173.05 15.74 M173.05 15.74 C173.15 23.58, 172.71 33.36, 173.05 47.23 M173.05 15.74 C172.66 26.45, 172.24 38.06, 173.05 47.23 M173.05 47.23 C171.47 55.77, 167.2 64.1, 157.3 62.98 M173.05 47.23 C173.14 59.65, 167.77 64.95, 157.3 62.98 M157.3 62.98 C123.92 61.72, 89.29 63.59, 15.74 62.98 M157.3 62.98 C110.05 63.74, 62.09 62.78, 15.74 62.98 M15.74 62.98 C4.45 62.14, -1.23 55.85, 0 47.23 M15.74 62.98 C6.11 64.83, -2.06 59.37, 0 47.23 M0 47.23 C-0.61 38.56, -0.48 30.59, 0 15.74 M0 47.23 C0.18 35.04, 1.07 23.38, 0 15.74 M0 15.74 C1.12 3.57, 3.5 1.87, 15.74 0 M0 15.74 C0.22 4.97, 4.87 1.64, 15.74 0" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"></path>
                    </g>
                    <g transform="translate(297.5411071777344 176.8125) rotate(0 27.329986572265625 12.5)">
                      <text x="27.329986572265625" y="17.619999999999997" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20px" fill="hsl(var(--foreground))" textAnchor="middle" style={{whiteSpace: 'pre'}} direction="ltr" dominantBaseline="alphabetic">Model</text>
                    </g>

                    {/* Tool/MCP Server Box */}
                    <g strokeLinecap="round" transform="translate(479 65.31640625) rotate(0 86.5234375 31.48828125)">
                      <path d="M15.74 0 C68.84 1.09, 125.53 -2.36, 157.3 0 M15.74 0 C54.19 1.57, 92.49 1.59, 157.3 0 M157.3 0 C169.17 1.07, 172.9 5.4, 173.05 15.74 M157.3 0 C169.48 -1.64, 172.46 3.32, 173.05 15.74 M173.05 15.74 C174.61 23.86, 174.11 30.63, 173.05 47.23 M173.05 15.74 C173.94 25.64, 173.86 34.82, 173.05 47.23 M173.05 47.23 C171.62 59.1, 168.26 63.84, 157.3 62.98 M173.05 47.23 C171.84 58.38, 168.66 61.08, 157.3 62.98 M157.3 62.98 C125.33 62.31, 91.37 62.31, 15.74 62.98 M157.3 62.98 C113.8 63.88, 69.21 64.15, 15.74 62.98 M15.74 62.98 C6.1 62.61, 0.55 58.74, 0 47.23 M15.74 62.98 C5.97 64.82, -0.78 56.61, 0 47.23 M0 47.23 C-0.94 39.09, 1.19 31.73, 0 15.74 M0 47.23 C0.77 35.76, -0.06 25.06, 0 15.74 M0 15.74 C0.1 5.77, 3.52 1.8, 15.74 0 M0 15.74 C-2 3, 5.26 -1.71, 15.74 0" stroke="hsl(var(--secondary))" strokeWidth="2" fill="none"></path>
                    </g>
                    <g transform="translate(517.0634613037109 71.8046875) rotate(0 48.45997619628906 25)">
                      <text x="48.45997619628906" y="17.619999999999997" fontFamily="system-ui, -apple-system, sans-serif" fontSize="18px" fill="hsl(var(--foreground))" textAnchor="middle" style={{whiteSpace: 'pre'}} direction="ltr" dominantBaseline="alphabetic">Tool/MCP</text>
                      <text x="48.45997619628906" y="40.62" fontFamily="system-ui, -apple-system, sans-serif" fontSize="18px" fill="hsl(var(--foreground))" textAnchor="middle" style={{whiteSpace: 'pre'}} direction="ltr" dominantBaseline="alphabetic">Server</text>
                    </g>

                    {/* SaaS API Box */}
                    <g strokeLinecap="round" transform="translate(481.2109375 162.10546875) rotate(0 86.5234375 31.48828125)">
                      <path d="M15.74 0 C55.5 2.05, 91.57 0.61, 157.3 0 M15.74 0 C44.31 1.67, 75.55 1.61, 157.3 0 M157.3 0 C168.98 0.72, 172.46 3.46, 173.05 15.74 M157.3 0 C165.59 0.91, 171.34 5.93, 173.05 15.74 M173.05 15.74 C174.09 24.26, 171.96 34.01, 173.05 47.23 M173.05 15.74 C173.46 22.15, 172.14 30.39, 173.05 47.23 M173.05 47.23 C173.75 57.22, 167.97 62.48, 157.3 62.98 M173.05 47.23 C171.2 56.23, 166.64 60.9, 157.3 62.98 M157.3 62.98 C127.74 65.23, 94.03 61.98, 15.74 62.98 M157.3 62.98 C108.25 62.29, 60.54 60.77, 15.74 62.98 M15.74 62.98 C5.63 62.87, 0.93 56.86, 0 47.23 M15.74 62.98 C3.5 60.84, 1.24 56.51, 0 47.23 M0 47.23 C-0.97 39.57, -0.49 27.45, 0 15.74 M0 47.23 C0.29 40.31, -0.79 34.71, 0 15.74 M0 15.74 C1.41 4.06, 4.28 -1.34, 15.74 0 M0 15.74 C-0.92 5.25, 5.84 1.85, 15.74 0" stroke="hsl(var(--accent))" strokeWidth="2" fill="none"></path>
                    </g>
                    <g transform="translate(520.5844116210938 181.09375) rotate(0 47.14996337890625 12.5)">
                      <text x="47.14996337890625" y="17.619999999999997" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20px" fill="hsl(var(--foreground))" textAnchor="middle" style={{whiteSpace: 'pre'}} direction="ltr" dominantBaseline="alphabetic">SaaS API</text>
                    </g>

                    {/* Orchestration Container */}
                    <g strokeLinecap="round" transform="translate(213.525390625 45.66796875) rotate(0 239.25 139.83203125)">
                      <path d="M32 0 C185.16 -0.28, 338.9 0.62, 446.5 0 M32 0 C138.2 -1.74, 244.93 -1.07, 446.5 0 M446.5 0 C466.82 1.63, 476.59 10.14, 478.5 32 M446.5 0 C468.75 -0.85, 478.91 8.51, 478.5 32 M478.5 32 C478.59 112.76, 477.92 191.57, 478.5 247.66 M478.5 32 C477.23 108.19, 475.94 185.45, 478.5 247.66 M478.5 247.66 C476.8 269.33, 468.77 280.71, 446.5 279.66 M478.5 247.66 C477.12 270.07, 468.73 281.06, 446.5 279.66 M446.5 279.66 C347.96 277.59, 249.18 277.08, 32 279.66 M446.5 279.66 C341.47 279.51, 236.32 279.77, 32 279.66 M32 279.66 C10.97 279.33, 0.52 268.72, 0 247.66 M32 279.66 C9.49 278.96, 0.08 266.78, 0 247.66 M0 247.66 C-0.32 195.65, -0.61 143.34, 0 32 M0 247.66 C-1.27 200.82, -1.17 155.14, 0 32 M0 32 C0.84 9.37, 9.66 -1.52, 32 0 M0 32 C0.46 11.67, 11.63 1.81, 32 0" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                    </g>
                    <g transform="translate(244.68289184570312 10) rotate(0 67.53994750976562 12.5)">
                      <text x="0" y="17.619999999999997" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20px" fill="hsl(var(--foreground))" textAnchor="start" style={{whiteSpace: 'pre'}} direction="ltr" dominantBaseline="alphabetic">Orchestration</text>
                    </g>

                    {/* Memory/Vector Database Box */}
                    <g strokeLinecap="round" transform="translate(481.59765625 248.1640625) rotate(0 86.5234375 31.48828125)">
                      <path d="M15.74 0 C53.11 -2.45, 92 0.3, 157.3 0 M15.74 0 C48.95 -1.67, 84.01 -1.49, 157.3 0 M157.3 0 C168.74 0.18, 171.54 5.83, 173.05 15.74 M157.3 0 C169.32 2.04, 170.82 5.37, 173.05 15.74 M173.05 15.74 C174.84 26.7, 172.02 36.58, 173.05 47.23 M173.05 15.74 C173.8 23.64, 172.69 33.61, 173.05 47.23 M173.05 47.23 C173.03 56.62, 168.59 62.32, 157.3 62.98 M173.05 47.23 C173.98 59.73, 166.55 65.1, 157.3 62.98 M157.3 62.98 C106.52 61.39, 58.59 62.05, 15.74 62.98 M157.3 62.98 C101.88 63.28, 47.56 63.35, 15.74 62.98 M15.74 62.98 C3.26 61.46, 1.73 57.67, 0 47.23 M15.74 62.98 C3.92 63.9, -1.89 55.87, 0 47.23 M0 47.23 C0.66 38.88, 1.21 26.89, 0 15.74 M0 47.23 C0.71 37.73, 0.8 26.5, 0 15.74 M0 15.74 C0.57 6.27, 4.04 0.71, 15.74 0 M0 15.74 C-0.64 6.33, 7.05 -1.48, 15.74 0" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                    </g>
                    <g transform="translate(495.7511444091797 254.65234375) rotate(0 72.36994934082031 25)">
                      <text x="72.36994934082031" y="17.619999999999997" fontFamily="system-ui, -apple-system, sans-serif" fontSize="18px" fill="hsl(var(--foreground))" textAnchor="middle" style={{whiteSpace: 'pre'}} direction="ltr" dominantBaseline="alphabetic">Memory/Vector</text>
                      <text x="72.36994934082031" y="40.62" fontFamily="system-ui, -apple-system, sans-serif" fontSize="18px" fill="hsl(var(--foreground))" textAnchor="middle" style={{whiteSpace: 'pre'}} direction="ltr" dominantBaseline="alphabetic">Database</text>
                    </g>

                    {/* Connection Arrows */}
                    <g strokeLinecap="round">
                      <g transform="translate(416.39453125 189.2125000000001) rotate(0 28.802734375 -46.25390625)">
                        <path d="M0 0 C4.75 0.48, 8.38 0.18, 14.4 0 M0 0 C3.59 0.31, 5.61 -0.46, 14.4 0 M14.4 0 C22.73 0.76, 28.81 -5.25, 28.8 -14.4 M14.4 0 C22.52 -0.65, 30.74 -5.28, 28.8 -14.4 M28.8 -14.4 C29.08 -25.86, 28.04 -41.94, 28.8 -78.11 M28.8 -14.4 C28.2 -36.36, 28.7 -57.63, 28.8 -78.11 M28.8 -78.11 C30.05 -88.42, 34.37 -93.16, 43.2 -92.51 M28.8 -78.11 C30.76 -86.45, 33.38 -92.39, 43.2 -92.51 M43.2 -92.51 C48.16 -93.19, 51.65 -93.05, 57.61 -92.51 M43.2 -92.51 C48.04 -92.58, 53.21 -91.96, 57.61 -92.51" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                      <g transform="translate(416.39453125 189.2125000000001) rotate(0 28.802734375 -46.25390625)">
                        <path d="M44.36 -86.85 C48.8 -87.74, 52.14 -89.41, 57.61 -92.51 M44.36 -86.85 C47.73 -87.7, 49.51 -89.63, 57.61 -92.51" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                      <g transform="translate(416.39453125 189.2125000000001) rotate(0 28.802734375 -46.25390625)">
                        <path d="M43.82 -96.69 C48.46 -95.2, 51.93 -94.5, 57.61 -92.51 M43.82 -96.69 C47.29 -95.52, 49.18 -95.43, 57.61 -92.51" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                    </g>

                    <g strokeLinecap="round">
                      <g transform="translate(416.39453125 194.25) rotate(0 29.908203125 -0.3781249999999545)">
                        <path d="M0 0 C23.64 -2.23, 47.88 -1.99, 59.82 -0.76 M0 0 C14.55 0.37, 30.34 0.53, 59.82 -0.76" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                      <g transform="translate(416.39453125 194.25) rotate(0 29.908203125 -0.3781249999999545)">
                        <path d="M36.63 8.6 C46.23 3.19, 56.35 0.12, 59.82 -0.76 M36.63 8.6 C41.94 6.45, 48.56 4.46, 59.82 -0.76" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                      <g transform="translate(416.39453125 194.25) rotate(0 29.908203125 -0.3781249999999545)">
                        <path d="M36.04 -8.49 C45.72 -7.31, 56.06 -3.79, 59.82 -0.76 M36.04 -8.49 C41.63 -6.35, 48.4 -4.07, 59.82 -0.76" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                    </g>

                    <g strokeLinecap="round">
                      <g transform="translate(416.39453125 201.84765625) rotate(0 30.1015625 38.852343750000045)">
                        <path d="M0 0 C4.47 -0.35, 8.03 -0.06, 19 0 M0 0 C7.83 0.27, 14.54 -0.92, 19 0 M19 0 C27.87 1.61, 36.73 6.14, 35 16 M19 0 C27.96 0.1, 34.17 5.54, 35 16 M35 16 C33.68 32.62, 34.41 52.63, 35 65.1 M35 16 C34.44 29.56, 34.26 44.44, 35 65.1 M35 65.1 C35.59 71.76, 37.34 76.84, 47.6 77.7 M35 65.1 C33.15 74.72, 37.3 79.74, 47.6 77.7 M47.6 77.7 C52.03 78.22, 54.15 77.71, 60.2 77.7 M47.6 77.7 C50.34 77.55, 53.51 77.88, 60.2 77.7" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                      <g transform="translate(416.39453125 201.84765625) rotate(0 30.1015625 38.852343750000045)">
                        <path d="M48.4 82.12 C51.13 80.74, 53.28 79.79, 60.2 77.7 M48.4 82.12 C53.32 80.65, 57.47 78.2, 60.2 77.7" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                      <g transform="translate(416.39453125 201.84765625) rotate(0 30.1015625 38.852343750000045)">
                        <path d="M48.32 73.5 C51.13 74.35, 53.3 75.64, 60.2 77.7 M48.32 73.5 C53.21 75.27, 57.4 76.06, 60.2 77.7" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                    </g>

                    <g strokeLinecap="round">
                      <g transform="translate(188.046875 189.9859375000001) rotate(0 22.650390625 -0.38671875)">
                        <path d="M0 0 C14.48 0.1, 27.01 -0.83, 45.3 -0.77 M0 0 C17.8 -0.49, 35.02 -0.34, 45.3 -0.77" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                      <g transform="translate(188.046875 189.9859375000001) rotate(0 22.650390625 -0.38671875)">
                        <path d="M24.21 7.49 C31.41 5.45, 36.69 2.28, 45.3 -0.77 M24.21 7.49 C32.75 4.23, 40.72 1.52, 45.3 -0.77" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                      <g transform="translate(188.046875 189.9859375000001) rotate(0 22.650390625 -0.38671875)">
                        <path d="M23.83 -8.01 C31.18 -5.4, 36.57 -3.93, 45.3 -0.77 M23.83 -8.01 C32.51 -5.34, 40.62 -2.13, 45.3 -0.77" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none"></path>
                      </g>
                    </g>

                    {/* E2B/Sandbox Box */}
                    <g strokeLinecap="round" transform="translate(12.80078125 345.390625) rotate(0 338.931640625 31.48828125)">
                      <path d="M15.74 0 C239.72 1.15, 463.94 0.99, 662.12 0 M662.12 0 C672.46 -1.88, 675.93 6.13, 677.86 15.74 M677.86 15.74 C678.82 26.06, 678.44 36.4, 677.86 47.23 M677.86 47.23 C678.75 57.76, 671.85 63.76, 662.12 62.98 M662.12 62.98 C478.3 63.1, 295.25 64.03, 15.74 62.98 M15.74 62.98 C3.61 62.67, 0.66 56.43, 0 47.23 M0 47.23 C0.26 39.86, 2.23 33.32, 0 15.74 M0 15.74 C1.31 6.67, 6.91 0.19, 15.74 0" stroke="hsl(var(--primary))" strokeWidth="2.5" fill="none" strokeDasharray="8 10"></path>
                    </g>
                    <g transform="translate(283.89246368408203 364.37890625) rotate(0 67.83995819091797 12.5)">
                      <text x="67.83995819091797" y="17.619999999999997" fontFamily="system-ui, -apple-system, sans-serif" fontSize="20px" fill="hsl(var(--foreground))" textAnchor="middle" style={{whiteSpace: 'pre'}} direction="ltr" dominantBaseline="alphabetic">E2B/Sandbox</text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card border-dashed border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center space-x-2 text-foreground">
                <Workflow className="h-5 w-5 text-primary" />
                <span>Ready to build your first AI workflow?</span>
              </h3>
              <p className="text-muted-foreground">
                Start with a template or create from scratch with our visual editor
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = '/gallery'} 
                variant="outline" 
                className="group border-primary/20 hover:bg-primary/5 hover:border-primary/40"
              >
                <Database className="h-4 w-4 mr-2" />
                Browse Templates
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => {
                  // Check if user is authenticated
                  if (session) {
                    // If authenticated, go to create template page
                    window.location.href = '/mine';
                  } else {
                    // If not authenticated, redirect to sign in page
                    window.location.href = '/signin';
                  }
                }}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Settings className="h-4 w-4 mr-2" />
                Create New
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}