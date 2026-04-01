export interface Agent {
  id: bigint
  name: string
  description: string
  endpoint: string
  capabilities: string[]
  owner: `0x${string}`
  isActive: boolean
  createdAt: bigint
}

export interface AgentInput {
  name: string
  description: string
  endpoint: string
  capabilities: string[]
}

export interface AgentResponse {
  success: boolean
  message: string
  data?: any
}

export interface WalletConnection {
  address: string | undefined
  isConnected: boolean
  isConnecting: boolean
  chainId: number | undefined
}