import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, length = 6): string {
  if (!address) return ''
  return `${address.slice(0, length)}...${address.slice(-4)}`
}

export function formatCapabilities(capabilities: string[]): string {
  return capabilities.join(', ')
}

export function parseCapabilities(input: string): string[] {
  return input
    .split(',')
    .map(cap => cap.trim())
    .filter(cap => cap.length > 0)
}