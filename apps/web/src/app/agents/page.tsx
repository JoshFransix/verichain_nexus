'use client'

import { useReadContract } from 'wagmi'
import { AgentList } from '@/components/agents/agent-list'
import { agentRegistryContract } from '@/lib/web3/contract'
import type { Agent } from '@/lib/types'

type ContractAgent = {
  id: bigint
  name: string
  description: string
  endpoint: string
  capabilities: string[]
  owner: `0x${string}`
  isActive: boolean
  createdAt: bigint
}

function mapAgents(data: readonly ContractAgent[]): Agent[] {
  return data.map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    endpoint: a.endpoint,
    capabilities: [...a.capabilities],
    owner: a.owner,
    isActive: a.isActive,
    createdAt: a.createdAt,
  }))
}

export default function AgentsPage() {
  const { data, isLoading, isError } = useReadContract({
    ...agentRegistryContract,
    functionName: 'getActiveAgents',
  })

  const agents: Agent[] = data ? mapAgents(data as ContractAgent[]) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Agent Registry</h1>
        <p className="text-muted-foreground mt-2">
          Discover and interact with verified AI agents on the blockchain
        </p>
      </div>

      {isError ? (
        <div className="text-center py-12">
          <p className="text-destructive font-medium">Failed to load agents from contract.</p>
          <p className="text-muted-foreground text-sm mt-1">Make sure your wallet is connected to Sepolia.</p>
        </div>
      ) : (
        <AgentList agents={agents} isLoading={isLoading} />
      )}
    </div>
  )
}