'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@hackhyre/ui/components/button'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import { Ranking, CloseCircle } from '@hackhyre/ui/icons'
import { useCandidateComparison } from '@/hooks/use-candidate-comparison'
import type { RecruiterCandidateListItem } from '@/actions/recruiter-candidates'

interface ComparisonFloatingBarProps {
  candidates: RecruiterCandidateListItem[]
}

export function ComparisonFloatingBar({
  candidates,
}: ComparisonFloatingBarProps) {
  const router = useRouter()
  const { selectedIds, clearSelection } = useCandidateComparison()

  const selectedCandidates = selectedIds
    .map((id) => candidates.find((c) => c.bestApplicationId === id))
    .filter(Boolean) as RecruiterCandidateListItem[]

  const canCompare = selectedIds.length >= 2

  function handleCompare() {
    if (!canCompare) return
    const params = selectedIds.map((id) => `id=${id}`).join('&')
    router.push(`/recuriter/candidates/compare?${params}`)
  }

  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit items-center gap-3 rounded-xl border bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm"
        >
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {selectedCandidates.map((c) => {
              const initials = c.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
              return (
                <Avatar
                  key={c.bestApplicationId}
                  className="h-8 w-8 border-2 border-background"
                >
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )
            })}
          </div>

          <span className="text-[13px] font-medium">
            {selectedIds.length} selected
          </span>

          <Button
            size="sm"
            onClick={handleCompare}
            disabled={!canCompare}
            className="h-8 gap-1.5 text-[12px]"
          >
            <Ranking size={14} variant="Bold" />
            Compare
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-muted-foreground h-8 gap-1 text-[12px]"
          >
            <CloseCircle size={14} variant="Linear" />
            Clear
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
