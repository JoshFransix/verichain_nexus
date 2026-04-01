'use client'

import './global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/web3'
import { Header } from '@/components/layout/header'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning={true}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-background text-foreground">
              <Header />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
