'use client'

import Link from 'next/link'
import { WalletConnect } from './wallet-connect'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">VeriChain Nexus</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/agents" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Agents
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/agents/new">
            <Button size="sm" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Register Agent</span>
            </Button>
          </Link>
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}