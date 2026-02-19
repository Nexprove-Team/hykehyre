'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { MagicStar } from '@hackhyre/ui/icons'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@hackhyre/ui/components/ai-elements/message'
import {
  PromptInput,
  PromptInputProvider,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
  usePromptInputController,
} from '@hackhyre/ui/components/ai-elements/prompt-input'

import { LiveWaveform } from '@/components/ai/live-waveform'
import { VoiceInputButton } from './voice-input-button'
import { JobPreview } from './job-preview'

interface JobPreviewData {
  title?: string
  description?: string
  employmentType?: string
  experienceLevel?: string
  location?: string
  isRemote?: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  requirements?: string[]
  responsibilities?: string[]
  skills?: string[]
}

function getTextFromParts(
  parts: Array<{ type: string; text?: string }>
): string {
  return parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text!)
    .join('')
}

function extractJobPreviewFromMessages(
  messages: Array<{
    role: string
    parts: Array<{
      type: string
      toolInvocation?: { toolName: string; result?: unknown }
    }>
  }>
): JobPreviewData {
  let preview: JobPreviewData = {}

  for (const msg of messages) {
    if (msg.role !== 'assistant') continue
    for (const part of msg.parts) {
      if (part.type !== 'tool-invocation' || !part.toolInvocation) continue
      const { toolName, result } = part.toolInvocation
      if (toolName === 'updateJobDraft' && result) {
        const r = result as { updated?: boolean; draft?: JobPreviewData }
        if (r.draft) preview = { ...preview, ...r.draft }
      }
      if (toolName === 'parseJobDescription' && result) {
        const r = result as { parsed?: boolean; job?: JobPreviewData }
        if (r.job) preview = { ...preview, ...r.job }
      }
    }
  }

  return preview
}

function ChatInputArea({
  sendMessage,
  status,
  isRecording,
  audioStream,
  setIsRecording,
  setAudioStream,
}: {
  sendMessage: (msg: { text: string }) => void
  status: string
  isRecording: boolean
  audioStream: MediaStream | null
  setIsRecording: (v: boolean) => void
  setAudioStream: (v: MediaStream | null) => void
}) {
  const { textInput } = usePromptInputController()
  const isLoading = status === 'streaming' || status === 'submitted'

  const handleTranscription = useCallback(
    (text: string) => {
      const current = textInput.value
      textInput.setInput(current ? `${current} ${text}` : text)
    },
    [textInput]
  )

  return (
    <PromptInput
      onSubmit={({ text }) => {
        if (!text.trim()) return
        sendMessage({ text })
      }}
      className="border-t-0"
    >
      {isRecording ? (
        <div className="flex min-h-16 items-center justify-center px-4">
          <LiveWaveform
            audioStream={audioStream}
            barCount={24}
            minHeight={4}
            maxHeight={32}
            className="text-primary"
          />
        </div>
      ) : (
        <PromptInputTextarea placeholder="Type your message or paste a job description..." />
      )}
      <PromptInputFooter>
        <VoiceInputButton
          onTranscriptionChange={handleTranscription}
          onAudioStreamChange={setAudioStream}
          onRecordingStateChange={setIsRecording}
          disabled={isLoading}
        />
        <PromptInputSubmit status={status as 'streaming' | 'submitted' | 'ready' | 'error'} />
      </PromptInputFooter>
    </PromptInput>
  )
}

export function AiMode() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/recuriters/chat',
    }),
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'markJobCreationComplete') {
        router.push('/recuriter/jobs')
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const didInit = useRef(false)
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    sendMessage({
      text: "I'd like to create a new job listing.",
    })
  }, [sendMessage])

  const visibleMessages = messages.filter((m) => {
    if (m.role !== 'user' && m.role !== 'assistant') return false
    const text = getTextFromParts(
      m.parts as Array<{ type: string; text?: string }>
    )
    return text.length > 0
  })

  const jobPreview = extractJobPreviewFromMessages(
    messages as Array<{
      role: string
      parts: Array<{
        type: string
        toolInvocation?: { toolName: string; result?: unknown }
      }>
    }>
  )

  return (
    <div className="grid h-[calc(100vh-15rem)] grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Chat panel */}
      <div className="lg:col-span-3">
        <div className="border-border/40 bg-card flex h-full flex-col overflow-hidden rounded-xl border">
          {/* Header */}
          <div className="border-border/40 flex items-center gap-3 border-b px-5 py-3.5">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <MagicStar
                size={16}
                variant="Bold"
                className="text-primary"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold">Hyre AI</h3>
              <p className="text-muted-foreground text-xs">
                Create your job listing through conversation
              </p>
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-6 overflow-y-auto px-5 py-4"
          >
            <motion.div className="flex flex-col gap-6">
              {visibleMessages.map((message) => {
                const content = getTextFromParts(
                  message.parts as Array<{ type: string; text?: string }>
                )
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Message from={message.role as 'user' | 'assistant'}>
                      <MessageContent>
                        <MessageResponse>{content}</MessageResponse>
                      </MessageContent>
                    </Message>
                  </motion.div>
                )
              })}
              {isLoading &&
                visibleMessages[visibleMessages.length - 1]?.role ===
                  'user' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Message from="assistant">
                      <MessageContent className="flex flex-row items-center gap-2">
                        <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
                        <span className="text-muted-foreground">
                          Hyre is thinking...
                        </span>
                      </MessageContent>
                    </Message>
                  </motion.div>
                )}
            </motion.div>
          </div>

          {/* Input area */}
          <div className="border-border/40 border-t px-4 py-3">
            <PromptInputProvider>
              <ChatInputArea
                sendMessage={sendMessage}
                status={status}
                isRecording={isRecording}
                audioStream={audioStream}
                setIsRecording={setIsRecording}
                setAudioStream={setAudioStream}
              />
            </PromptInputProvider>
          </div>
        </div>
      </div>

      {/* Preview panel */}
      <div className="space-y-4 lg:col-span-2">
        <JobPreview data={jobPreview} />
      </div>
    </div>
  )
}
