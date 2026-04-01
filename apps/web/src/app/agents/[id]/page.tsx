'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCapabilities, truncateAddress } from '@/lib/utils'
import { ExternalLink, Play, Send } from 'lucide-react'
import type { Agent } from '@/lib/types'

// Mock agent data - in real app, fetch from contract
const mockAgents: Record<string, Agent> = {
  '1': {
    id: 1n,
    name: 'CodeReviewer AI',
    description: 'Advanced AI agent that provides comprehensive code reviews, security analysis, and optimization suggestions. Built with state-of-the-art language models and trained on millions of code repositories.',
    endpoint: 'https://api.codereview.ai/v1',
    capabilities: ['code-review', 'security-analysis', 'optimization', 'bug-detection'],
    owner: '0x742d35cc6544953d9c000b5b85eb3e8e5e1e0e26',
    isActive: true,
  },
  '2': {
    id: 2n,
    name: 'TextGen Pro',
    description: 'Professional text generation agent for creating high-quality content, documentation, and creative writing.',
    endpoint: 'https://api.textgen.pro/v2',
    capabilities: ['text-generation', 'content-creation', 'documentation'],
    owner: '0x8ba1f109551bD432803012645Hac136c9969B7A',
    isActive: true,
  },
}

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const agent = mockAgents[agentId]

  if (!agent) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-muted-foreground">Agent Not Found</h1>
        <p className="text-muted-foreground mt-2">The requested agent does not exist.</p>
      </div>
    )
  }

  const handleRunAgent = async () => {
    if (!prompt.trim()) return
    
    setIsLoading(true)
    
    // Mock API call - replace with actual agent endpoint call
    setTimeout(() => {
      setResponse(`Mock response from ${agent.name}: I've analyzed your input "${prompt}" and here's my response. This is a simulated interaction for demo purposes.`)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold">{agent.name}</h1>
            <div className={`h-3 w-3 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <p className="text-muted-foreground">{agent.description}</p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(agent.endpoint, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Endpoint
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{truncateAddress(agent.owner, 8)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={agent.isActive ? 'default' : 'secondary'}>
              {agent.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Agent ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">#{agent.id.toString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map((capability) => (
              <Badge key={capability} variant="outline">
                {capability}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interact with Agent</CardTitle>
          <CardDescription>
            Send a prompt to this agent and get a response
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              label="Prompt"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              onClick={handleRunAgent}
              disabled={!prompt.trim() || isLoading}
              isLoading={isLoading}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </div>

          {response && (
            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Response:</h4>
              <p className="text-sm">{response}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}