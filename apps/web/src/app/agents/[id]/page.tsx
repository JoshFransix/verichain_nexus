'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useReadContract } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { truncateAddress } from '@/lib/utils'
import { ExternalLink, Send } from 'lucide-react'
import { agentRegistryContract } from '@/lib/web3/contract'
import type { Agent } from '@/lib/types'

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = BigInt(params.id as string)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [isInteracting, setIsInteracting] = useState(false)

  const { data, isLoading, isError } = useReadContract({
    ...agentRegistryContract,
    functionName: 'getAgentById',
    args: [agentId],
  })

  const agent = data as Agent | undefined

  const handleRunAgent = async () => {
    if (!prompt.trim() || !agent) return
    setIsInteracting(true)
    setResponse(null)
    try {
      const res = await fetch(agent.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const body = await res.text()
      if (!res.ok) {
        toast.error('Agent returned an error', { description: body })
      } else {
        setResponse(body)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error('Failed to reach agent endpoint', { description: message })
    } finally {
      setIsInteracting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleRunAgent()
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6 space-y-3">
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !agent) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Agent Not Found</h1>
        <p className="text-muted-foreground mt-2">
          This agent does not exist or could not be loaded.
        </p>
      </div>
    )
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
              onKeyDown={handleKeyDown}
              disabled={isInteracting}
            />
            <Button
              onClick={handleRunAgent}
              disabled={!prompt.trim() || isInteracting || !agent.isActive}
              isLoading={isInteracting}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isInteracting ? 'Sending...' : 'Send'}</span>
            </Button>
            {!agent.isActive && (
              <p className="text-sm text-muted-foreground">This agent is inactive and cannot receive prompts.</p>
            )}
          </div>

          {response && (
            <div className="p-4 rounded-md border bg-muted border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Response</h4>
                <button
                  onClick={() => { setResponse(null); setPrompt('') }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
              <p className="text-sm whitespace-pre-wrap font-mono">
                {response}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}