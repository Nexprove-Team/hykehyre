import { create } from 'zustand'

interface CompanySheetState {
  isOpen: boolean
  companyName: string | null
  open: (name: string) => void
  close: () => void
}

export const useCompanySheet = create<CompanySheetState>((set) => ({
  isOpen: false,
  companyName: null,
  open: (name) => set({ isOpen: true, companyName: name }),
  close: () => set({ isOpen: false, companyName: null }),
}))
