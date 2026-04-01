'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCapabilities, truncateAddress } from '@/lib/utils'
import { ExternalLink, Play } from 'lucide-react'
import type { Agent } from '@/lib/types'

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{agent.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {agent.description}
            </CardDescription>
          </div>
          <div className={`h-2 w-2 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Capabilities</h4>
            <p className="text-sm text-muted-foreground">
              {formatCapabilities(agent.capabilities)}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Owner</h4>
            <p className="text-sm font-mono text-muted-foreground">
              {truncateAddress(agent.owner)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Link href={`/agents/${agent.id}`} className="flex-1">
              <Button size="sm" className="w-full flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>View</span>
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(agent.endpoint, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}