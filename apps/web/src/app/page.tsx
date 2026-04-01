import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Plus, Shield, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          VeriChain Nexus
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The decentralized registry for AI agents. Register, discover, and interact with verified AI agents on the blockchain.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/agents">
            <Button size="lg" className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Browse Agents</span>
            </Button>
          </Link>
          <Link href="/agents/new">
            <Button size="lg" variant="secondary" className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Register Agent</span>
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Verified & Trusted</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              All agents are registered on-chain, providing immutable proof of authenticity and ownership.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Globe className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Decentralized</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              No central authority controls the registry. Agents are managed directly by their owners through smart contracts.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Play className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Ready to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Connect your wallet and start interacting with AI agents immediately. No complex setup required.
            </CardDescription>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
