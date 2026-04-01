'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { parseCapabilities } from '@/lib/utils'
import { agentRegistryContract } from '@/lib/web3/contract'
import type { AgentInput } from '@/lib/types'

export function AgentRegistrationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<AgentInput>({
    name: '',
    description: '',
    endpoint: '',
    capabilities: [],
  })
  const [capabilitiesInput, setCapabilitiesInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pendingSubmit, setPendingSubmit] = useState(false)

  const { writeContract, data: hash, error, isPending, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const isWrongNetwork = chainId !== sepolia.id

  useEffect(() => {
    if (isSuccess) {
      router.push('/agents')
    }
  }, [isSuccess, router])

  // Once chain switches to Sepolia, auto-submit if user was waiting
  useEffect(() => {
    if (pendingSubmit && !isWrongNetwork) {
      setPendingSubmit(false)
      submitToContract()
    }
  }, [chainId]) // eslint-disable-line react-hooks/exhaustive-deps

  const submitToContract = useCallback(() => {
    writeContract({
      ...agentRegistryContract,
      functionName: 'registerAgent',
      chainId: sepolia.id,
      args: [
        formData.name,
        formData.description,
        formData.endpoint,
        parseCapabilities(capabilitiesInput),
      ],
    })
  }, [writeContract, formData, capabilitiesInput])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!capabilitiesInput.trim()) newErrors.capabilities = 'At least one capability is required'

    if (!formData.endpoint.trim()) {
      newErrors.endpoint = 'Endpoint is required'
    } else {
      try {
        new URL(formData.endpoint)
      } catch {
        newErrors.endpoint = 'Please enter a valid URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    reset()

    if (!validateForm()) return

    if (isWrongNetwork) {
      setPendingSubmit(true)
      switchChain({ chainId: sepolia.id })
      return
    }

    submitToContract()
  }

  const errorMessage = error
    ? (error.message.includes('User rejected') || error.message.includes('user rejected')
        ? 'Transaction rejected in wallet.'
        : (() => {
            // wagmi wraps the revert reason — extract it from 'reverted with the following reason:\n<reason>'
            const reasonMatch = error.message.match(/following reason:\s*\n([^\n]+)/)
            if (reasonMatch) return reasonMatch[1].trim()
            // fallback: first non-empty line
            const firstLine = error.message.split('\n').find(l => l.trim())
            return firstLine ?? error.message
          })())
    : null

  const buttonLabel = isSwitching
    ? 'Switching Network...'
    : isPending
    ? 'Check Wallet...'
    : isConfirming
    ? 'Confirming on-chain...'
    : isWrongNetwork
    ? 'Switch to Sepolia'
    : 'Register Agent'

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Register New Agent</CardTitle>
        <CardDescription>
          Submit your AI agent to the VeriChain registry
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isWrongNetwork && (
            <div className="rounded-md border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-500">
              You are on the wrong network. Click Register to switch to Sepolia.
            </div>
          )}
          <Input
            label="Agent Name"
            placeholder="My AI Assistant"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
          />
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe what your agent does..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
          
          <Input
            label="Endpoint URL"
            placeholder="https://api.myagent.com"
            value={formData.endpoint}
            onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
            error={errors.endpoint}
          />
          
          <Input
            label="Capabilities"
            placeholder="text-generation, image-analysis, code-review"
            value={capabilitiesInput}
            onChange={(e) => setCapabilitiesInput(e.target.value)}
            error={errors.capabilities}
          />
          <p className="text-xs text-muted-foreground">
            Separate multiple capabilities with commas
          </p>
          
          <Button
            type="submit"
            className="w-full"
            isLoading={isPending || isConfirming || isSwitching}
            disabled={isPending || isConfirming || isSwitching}
          >
            {buttonLabel}
          </Button>

          {errorMessage && (
            <p className="text-sm text-destructive mt-2">{errorMessage}</p>
          )}

          {hash && !isSuccess && (
            <p className="text-sm text-muted-foreground mt-2 font-mono break-all">
              Tx: {hash}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}