import { create } from 'zustand'
import type { Agent } from '@/lib/types'

interface AppState {
  selectedAgent: Agent | null
  setSelectedAgent: (agent: Agent | null) => void
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedAgent: null,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}))