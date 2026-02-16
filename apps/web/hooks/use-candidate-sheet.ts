import { create } from 'zustand'

interface CandidateSheetState {
  isOpen: boolean
  candidateId: string | null
  candidateIds: string[]
  open: (candidateId: string, candidateIds?: string[]) => void
  close: () => void
  navigateNext: () => void
  navigatePrev: () => void
}

export const useCandidateSheet = create<CandidateSheetState>((set, get) => ({
  isOpen: false,
  candidateId: null,
  candidateIds: [],
  open: (candidateId, candidateIds) =>
    set({
      isOpen: true,
      candidateId,
      ...(candidateIds ? { candidateIds } : {}),
    }),
  close: () => set({ isOpen: false, candidateId: null }),
  navigateNext: () => {
    const { candidateId, candidateIds } = get()
    if (!candidateId || candidateIds.length === 0) return
    const idx = candidateIds.indexOf(candidateId)
    if (idx === -1 || idx >= candidateIds.length - 1) return
    set({ candidateId: candidateIds[idx + 1] })
  },
  navigatePrev: () => {
    const { candidateId, candidateIds } = get()
    if (!candidateId || candidateIds.length === 0) return
    const idx = candidateIds.indexOf(candidateId)
    if (idx <= 0) return
    set({ candidateId: candidateIds[idx - 1] })
  },
}))
