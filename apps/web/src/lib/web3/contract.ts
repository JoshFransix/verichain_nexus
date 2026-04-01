import { AGENT_REGISTRY_ABI } from './abi'

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS is not set')
}

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

export const agentRegistryContract = {
  address: CONTRACT_ADDRESS,
  abi: AGENT_REGISTRY_ABI,
} as const

export { AGENT_REGISTRY_ABI }
