import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'fallback-id',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
})

export const AGENT_REGISTRY_ABI = [
  {
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_description', type: 'string' },
      { name: '_endpoint', type: 'string' },
      { name: '_capabilities', type: 'string[]' }
    ],
    name: 'registerAgent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'agents',
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'endpoint', type: 'string' },
      { name: 'owner', type: 'address' },
      { name: 'isActive', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'agentCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_agentId', type: 'uint256' }],
    name: 'getAgentCapabilities',
    outputs: [{ name: '', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'getAgentsByOwner',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0'