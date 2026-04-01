'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { parseCapabilities } from '@/lib/utils'
import { AGENT_REGISTRY_ABI, CONTRACT_ADDRESS } from '@/lib/web3'
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

  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.endpoint.trim()) {
      newErrors.endpoint = 'Endpoint is required'
    }
    if (!capabilitiesInput.trim()) {
      newErrors.capabilities = 'At least one capability is required'
    }

    try {
      new URL(formData.endpoint)
    } catch {
      newErrors.endpoint = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const capabilities = parseCapabilities(capabilitiesInput)
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: AGENT_REGISTRY_ABI,
      functionName: 'registerAgent',
      args: [
        formData.name,
        formData.description,
        formData.endpoint,
        capabilities,
      ],
    })
  }

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-500">Success!</CardTitle>
          <CardDescription>
            Your agent has been registered successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => router.push('/agents')}
            className="w-full"
          >
            View All Agents
          </Button>
        </CardContent>
      </Card>
    )
  }

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
            isLoading={isPending || isConfirming}
            disabled={isPending || isConfirming}
          >
            {isPending ? 'Confirming...' : isConfirming ? 'Waiting for confirmation...' : 'Register Agent'}
          </Button>
          
          {error && (
            <p className="text-sm text-destructive mt-2">
              {error.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}