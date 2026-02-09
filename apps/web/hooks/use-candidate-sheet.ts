import { create } from "zustand";

interface CandidateSheetState {
  isOpen: boolean;
  candidateId: string | null;
  open: (candidateId: string) => void;
  close: () => void;
}

export const useCandidateSheet = create<CandidateSheetState>((set) => ({
  isOpen: false,
  candidateId: null,
  open: (candidateId) => set({ isOpen: true, candidateId }),
  close: () => set({ isOpen: false, candidateId: null }),
}));
