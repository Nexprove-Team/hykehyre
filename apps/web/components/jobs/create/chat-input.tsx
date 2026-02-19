'use client'

import {
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@hackhyre/ui/components/button'
import { Microphone2, Send, Pause } from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onMicToggle?: () => void
  isRecording?: boolean
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onMicToggle,
  isRecording = false,
  disabled = false,
  placeholder = 'Describe the job you want to create...',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    // Clamp between 1 line (~24px) and ~6 lines (~144px)
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`
  }, [])

  useEffect(() => {
    resize()
  }, [value, resize])

  // Focus on mount
  useEffect(() => {
    if (!disabled) textareaRef.current?.focus()
  }, [disabled])

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) onSend()
    }
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div
      className={cn(
        'border-border/60 bg-background relative flex items-end gap-1 rounded-2xl border px-1.5 py-1.5 transition-colors',
        'focus-within:border-ring/40 focus-within:ring-ring/10 focus-within:ring-2',
        disabled && 'opacity-50'
      )}
    >
      {/* Mic button */}
      {onMicToggle && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'text-muted-foreground hover:text-foreground h-8 w-8 shrink-0 rounded-xl transition-all',
            isRecording &&
              'bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
          )}
          onClick={onMicToggle}
          disabled={disabled}
        >
          <AnimatePresence mode="wait">
            {isRecording ? (
              <motion.span
                key="stop"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Pause size={16} variant="Bold" />
              </motion.span>
            ) : (
              <motion.span
                key="mic"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Microphone2 size={16} variant="Linear" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      )}

      {/* Recording indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex items-center gap-2 overflow-hidden"
          >
            <span className="bg-destructive inline-block h-2 w-2 shrink-0 animate-pulse rounded-full" />
            <span className="text-destructive shrink-0 text-xs font-medium">
              Listening...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      {!isRecording && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'placeholder:text-muted-foreground/60 max-h-36 min-h-6 flex-1 resize-none overflow-hidden bg-transparent py-1 px-1.5 text-sm leading-6 outline-none',
            'disabled:cursor-not-allowed'
          )}
        />
      )}

      {/* Send button */}
      <Button
        type="button"
        size="icon"
        className={cn(
          'h-8 w-8 shrink-0 rounded-xl transition-all',
          canSend
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-muted text-muted-foreground pointer-events-none'
        )}
        onClick={onSend}
        disabled={!canSend}
      >
        <Send size={16} variant="Bold" />
      </Button>
    </div>
  )
}
