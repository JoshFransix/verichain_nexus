'use client'

import { useState, useRef, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { truncateAddress } from '@/lib/utils'
import { Wallet, ChevronDown } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted) {
    return (
      <Button className="flex items-center space-x-2" disabled>
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
        <ChevronDown className="h-3 w-3" />
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 rounded-md bg-muted px-3 py-2 border border-border">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-foreground">{truncateAddress(address)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    )
  }

  // Deduplicate connectors by name (wagmi can register duplicates)
  const uniqueConnectors = connectors.filter(
    (c, i, arr) => arr.findIndex((x) => x.name === c.name) === i
  )

  return (
    <div className="relative" ref={ref}>
      <Button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2"
        disabled={isPending}
      >
        <Wallet className="h-4 w-4" />
        <span>{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-md border border-border bg-card shadow-lg z-50">
          <div className="p-1 space-y-0.5">
            {uniqueConnectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector })
                  setOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-muted transition-colors flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span>{connector.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}