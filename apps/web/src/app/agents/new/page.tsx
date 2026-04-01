'use client'

import { useAccount } from 'wagmi'
import { AgentRegistrationForm } from '@/components/agents/agent-registration-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WalletConnect } from '@/components/layout/wallet-connect'

export default function NewAgentPage() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              You need to connect your wallet to register an agent
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Register New Agent</h1>
        <p className="text-muted-foreground mt-2">
          Add your AI agent to the VeriChain registry
        </p>
      </div>
      
      <AgentRegistrationForm />
    </div>
  )
}