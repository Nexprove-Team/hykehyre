'use client'

import { motion } from 'motion/react'
import { MagicStar, User } from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { Spinner } from '@hackhyre/ui/components/spinner'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
}

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isAI = message.role === 'ai'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn('group flex gap-3', !isAI && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
          isAI
            ? 'bg-primary/10 text-primary'
            : 'bg-foreground/5 text-muted-foreground'
        )}
      >
        {isAI ? (
          <MagicStar size={14} variant="Bold" />
        ) : (
          <User size={14} variant="Bold" />
        )}
      </div>

      {/* Message content */}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isAI
            ? 'bg-muted/70 text-foreground rounded-tl-md'
            : 'bg-primary/8 text-foreground rounded-tr-md'
        )}
      >
        {message.content}
      </div>
    </motion.div>
  )
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-3"
    >
      <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
        <MagicStar size={14} variant="Bold" />
      </div>
      <div className="bg-muted/70 flex items-center gap-2 rounded-2xl rounded-tl-md px-4 py-2.5">
        <Spinner className="h-3.5 w-3.5" />
        <span className="text-muted-foreground text-xs">Thinking...</span>
      </div>
    </motion.div>
  )
}
