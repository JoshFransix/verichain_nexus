'use client'

import { useAccount, useReadContract } from 'wagmi'
import { AgentList } from '@/components/agents/agent-list'
import { Button } from '@/components/ui/button'
import { agentRegistryContract } from '@/lib/web3/contract'
import { WalletConnect } from '@/components/layout/wallet-connect'
import type { Agent } from '@/lib/types'
import Link from 'next/link'
import { Plus } from 'lucide-react'

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

export default function MyAgentsPage() {
  const { address, isConnected } = useAccount()

  const { data, isLoading } = useReadContract({
    ...agentRegistryContract,
    functionName: 'getAgentsByOwner',
    args: [address!],
    query: { enabled: !!address },
  })

  const agents: Agent[] = data ? mapAgents(data as ContractAgent[]) : []

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <h1 className="text-2xl font-bold">My Agents</h1>
        <p className="text-muted-foreground">Connect your wallet to view your registered agents.</p>
        <WalletConnect />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Agents</h1>
          <p className="text-muted-foreground mt-1">Agents registered by your wallet</p>
        </div>
        <Link href="/agents/new">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Register Agent</span>
          </Button>
        </Link>
      </div>

      <AgentList agents={agents} isLoading={isLoading} />
    </div>
  )
}
