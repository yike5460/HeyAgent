"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface IndustryFilterProps {
  industries: Array<{
    name: string
    count: number
    color: string
  }>
  selectedIndustry: string | null
  onIndustrySelect: (industry: string | null) => void
}

export function IndustryFilter({ 
  industries, 
  selectedIndustry, 
  onIndustrySelect 
}: IndustryFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Filter by Industry</h3>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedIndustry === null ? "default" : "outline"}
          size="sm"
          onClick={() => onIndustrySelect(null)}
          className="h-8"
        >
          All Industries
          <Badge variant="secondary" className="ml-2">
            {industries.reduce((total, industry) => total + industry.count, 0)}
          </Badge>
        </Button>
        
        {industries.map((industry) => (
          <Button
            key={industry.name}
            variant={selectedIndustry === industry.name ? "default" : "outline"}
            size="sm"
            onClick={() => onIndustrySelect(industry.name)}
            className={cn(
              "h-8",
              selectedIndustry === industry.name && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {industry.name}
            <Badge variant="secondary" className="ml-2">
              {industry.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  )
}