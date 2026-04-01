'use client'

import { AgentCard } from './agent-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useAppStore } from '@/store'
import type { Agent } from '@/lib/types'

interface AgentListProps {
  agents: Agent[]
  isLoading?: boolean
}

export function AgentList({ agents, isLoading }: AgentListProps) {
  const { searchQuery, setSearchQuery } = useAppStore()

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.capabilities.some(cap => 
      cap.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-10"
            disabled
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search agents by name, description, or capabilities..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">
            {searchQuery ? 'No agents found' : 'No agents registered yet'}
          </h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Be the first to register an AI agent!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id.toString()} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}