import { create } from 'zustand'

interface ApplySheetState {
  isOpen: boolean
  jobId: string | null
  jobTitle: string | null
  company: string | null
  open: (jobId: string, jobTitle: string, company: string) => void
  close: () => void
}

export const useApplySheet = create<ApplySheetState>((set) => ({
  isOpen: false,
  jobId: null,
  jobTitle: null,
  company: null,
  open: (jobId, jobTitle, company) =>
    set({ isOpen: true, jobId, jobTitle, company }),
  close: () =>
    set({ isOpen: false, jobId: null, jobTitle: null, company: null }),
}))
