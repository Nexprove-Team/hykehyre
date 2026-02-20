import { create } from 'zustand'

const MAX_SELECTION = 4

interface CandidateComparisonState {
  isSelecting: boolean
  selectedIds: string[]
  toggleSelecting: () => void
  toggleCandidate: (id: string) => void
  clearSelection: () => void
}

export const useCandidateComparison = create<CandidateComparisonState>(
  (set, get) => ({
    isSelecting: false,
    selectedIds: [],
    toggleSelecting: () => {
      const { isSelecting } = get()
      set({ isSelecting: !isSelecting, selectedIds: [] })
    },
    toggleCandidate: (id: string) => {
      const { selectedIds } = get()
      if (selectedIds.includes(id)) {
        set({ selectedIds: selectedIds.filter((s) => s !== id) })
      } else if (selectedIds.length < MAX_SELECTION) {
        set({ selectedIds: [...selectedIds, id] })
      }
    },
    clearSelection: () => set({ selectedIds: [] }),
  })
)
