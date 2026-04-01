'use client'

import { useReadContract } from 'wagmi'
import { AgentList } from '@/components/agents/agent-list'
import { AGENT_REGISTRY_ABI, CONTRACT_ADDRESS } from '@/lib/web3'
import type { Agent } from '@/lib/types'

export default function AgentsPage() {
  const { data: agentCount = 0n, isLoading: isLoadingCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AGENT_REGISTRY_ABI,
    functionName: 'agentCount',
  })

  // For demo purposes, let's create some mock agents
  // In a real app, you'd fetch these from the contract
  const mockAgents: Agent[] = [
    {
      id: 1n,
      name: 'CodeReviewer AI',
      description: 'Advanced AI agent that provides comprehensive code reviews, security analysis, and optimization suggestions.',
      endpoint: 'https://api.codereview.ai/v1',
      capabilities: ['code-review', 'security-analysis', 'optimization'],
      owner: '0x742d35cc6544953d9c000b5b85eb3e8e5e1e0e26',
      isActive: true,
    },
    {
      id: 2n,
      name: 'TextGen Pro',
      description: 'Professional text generation agent for creating high-quality content, documentation, and creative writing.',
      endpoint: 'https://api.textgen.pro/v2',
      capabilities: ['text-generation', 'content-creation', 'documentation'],
      owner: '0x8ba1f109551bD432803012645Hac136c9969B7A',
      isActive: true,
    },
    {
      id: 3n,
      name: 'ImageAnalyzer',
      description: 'Powerful image analysis agent capable of object detection, classification, and visual understanding.',
      endpoint: 'https://vision.imageanalyzer.com/api',
      capabilities: ['image-analysis', 'object-detection', 'classification'],
      owner: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
      isActive: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Agent Registry</h1>
        <p className="text-muted-foreground mt-2">
          Discover and interact with verified AI agents on the blockchain
        </p>
      </div>
      
      <AgentList 
        agents={mockAgents} 
        isLoading={isLoadingCount}
      />
    </div>
  )
}