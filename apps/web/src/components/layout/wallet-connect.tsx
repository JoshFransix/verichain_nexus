'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { truncateAddress } from '@/lib/utils'
import { Wallet, ChevronDown } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 rounded-md bg-muted px-3 py-2 border border-border">
          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-medium text-foreground">{truncateAddress(address)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    )
  }

  // Use the first available connector (usually injected/MetaMask)
  const primaryConnector = connectors[0]
  
  return (
    <Button
      onClick={() => connect({ connector: primaryConnector })}
      className="flex items-center space-x-2"
    >
      <Wallet className="h-4 w-4" />
      <span>Connect Wallet</span>
    </Button>
  )
}