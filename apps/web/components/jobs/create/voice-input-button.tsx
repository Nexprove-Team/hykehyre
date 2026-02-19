'use client'

import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Microphone2, Pause } from '@hackhyre/ui/icons'
import { Spinner } from '@hackhyre/ui/components/spinner'
import { cn } from '@hackhyre/ui/lib/utils'
import {
  PromptInputButton,
} from '@hackhyre/ui/components/ai-elements/prompt-input'

type VoiceState = 'idle' | 'recording' | 'processing'

interface VoiceInputButtonProps {
  onTranscriptionChange: (text: string) => void
  onAudioStreamChange?: (stream: MediaStream | null) => void
  onRecordingStateChange?: (recording: boolean) => void
  disabled?: boolean
  className?: string
}

export function VoiceInputButton({
  onTranscriptionChange,
  onAudioStreamChange,
  onRecordingStateChange,
  disabled,
  className,
}: VoiceInputButtonProps) {
  const [state, setState] = useState<VoiceState>('idle')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop()
      }
    }
    streamRef.current = null
    onAudioStreamChange?.(null)
    onRecordingStateChange?.(false)
  }, [onAudioStreamChange, onRecordingStateChange])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      onAudioStreamChange?.(stream)
      onRecordingStateChange?.(true)

      const mediaRecorder = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      })

      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        if (audioBlob.size === 0) {
          setState('idle')
          return
        }

        setState('processing')

        try {
          const formData = new FormData()
          formData.append('audio', audioBlob, 'recording.webm')

          const res = await fetch('/api/transcription', {
            method: 'POST',
            body: formData,
          })

          if (!res.ok) throw new Error('Transcription failed')

          const data = await res.json()
          if (data.transcription) {
            onTranscriptionChange(data.transcription)
          }
        } catch {
          // Silently fail — user can retry
        } finally {
          setState('idle')
        }
      })

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setState('recording')
    } catch {
      setState('idle')
      onRecordingStateChange?.(false)
    }
  }, [onAudioStreamChange, onRecordingStateChange, onTranscriptionChange])

  const toggle = useCallback(() => {
    if (state === 'recording') {
      stopRecording()
      // state transitions to 'processing' in the stop handler
    } else if (state === 'idle') {
      startRecording()
    }
  }, [state, startRecording, stopRecording])

  return (
    <PromptInputButton
      type="button"
      tooltip={
        state === 'recording'
          ? 'Stop recording'
          : state === 'processing'
            ? 'Processing...'
            : 'Voice input'
      }
      className={cn(
        state === 'recording' &&
          'text-destructive hover:text-destructive',
        className
      )}
      onClick={toggle}
      disabled={disabled || state === 'processing'}
    >
      <AnimatePresence mode="wait">
        {state === 'processing' ? (
          <motion.span
            key="processing"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Spinner className="size-4" />
          </motion.span>
        ) : state === 'recording' ? (
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
    </PromptInputButton>
  )
}
