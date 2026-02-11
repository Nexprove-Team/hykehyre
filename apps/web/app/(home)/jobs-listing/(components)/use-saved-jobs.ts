import { create } from 'zustand'
import { MOCK_JOBS } from './mock-data'

interface SavedJobsState {
  saved: Record<string, boolean>
  toggle: (id: string) => void
  isSaved: (id: string) => boolean
}

export const useSavedJobs = create<SavedJobsState>((set, get) => ({
  saved: Object.fromEntries(MOCK_JOBS.map((j) => [j.id, j.saved])),
  toggle: (id) =>
    set((state) => ({
      saved: { ...state.saved, [id]: !state.saved[id] },
    })),
  isSaved: (id) => get().saved[id] ?? false,
}))
