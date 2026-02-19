'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Loader2, Paperclip } from 'lucide-react'
import { MagicStar, DocumentText, CloseCircle } from '@hackhyre/ui/icons'
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

function ChatInputArea({
  sendMessage,
  status,
  isRecording,
  audioStream,
  setIsRecording,
  setAudioStream,
  pendingFile,
  uploading,
  onFileSelect,
  onRemoveFile,
}: {
  sendMessage: (msg: { text: string }) => void
  status: string
  isRecording: boolean
  audioStream: MediaStream | null
  setIsRecording: (v: boolean) => void
  setAudioStream: (v: MediaStream | null) => void
  pendingFile: { url: string; filename: string } | null
  uploading: boolean
  onFileSelect: (file: File) => void
  onRemoveFile: () => void
}) {
  const { textInput } = usePromptInputController()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isLoading = status === 'streaming' || status === 'submitted'

  const handleTranscription = useCallback(
    (text: string) => {
      const current = textInput.value
      textInput.setInput(current ? `${current} ${text}` : text)
    },
    [textInput]
  )

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
          if (fileInputRef.current) fileInputRef.current.value = ''
        }}
      />

      {pendingFile && (
        <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border px-3 py-1.5">
          <DocumentText
            size={14}
            variant="Bold"
            className="text-primary shrink-0"
          />
          <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">
            {pendingFile.filename}
          </span>
          <button
            type="button"
            onClick={onRemoveFile}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <CloseCircle size={14} variant="Linear" />
          </button>
        </div>
      )}

      <PromptInput
        onSubmit={({ text }) => {
          if (!text.trim() && !pendingFile) return
          const msg = pendingFile
            ? `${text}\n\n[Attached file: ${pendingFile.filename}](${pendingFile.url})`
            : text
          sendMessage({ text: msg })
          onRemoveFile()
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
          <button
            type="button"
            disabled={uploading || !!pendingFile || isLoading}
            onClick={() => fileInputRef.current?.click()}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40"
          >
            {uploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Paperclip className="size-3.5" />
            )}
            {uploading ? 'Uploading...' : 'File'}
          </button>
          <div className="flex gap-2">
            <VoiceInputButton
              onTranscriptionChange={handleTranscription}
              onAudioStreamChange={setAudioStream}
              onRecordingStateChange={setIsRecording}
              disabled={isLoading}
            />
            <PromptInputSubmit
              status={status as 'streaming' | 'submitted' | 'ready' | 'error'}
            />
          </div>
        </PromptInputFooter>
      </PromptInput>
    </>
  )
}

export function AiMode() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [jobPreview, setJobPreview] = useState<JobPreviewData>({})
  const [pendingFile, setPendingFile] = useState<{
    url: string
    filename: string
  } | null>(null)
  const [uploading, setUploading] = useState(false)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/recuriters/chat',
    }),
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'markJobCreationComplete') {
        router.push('/recuriter/jobs')
      }
      if (
        toolCall.toolName === 'updateJobDraft' ||
        toolCall.toolName === 'parseJobDescription'
      ) {
        setJobPreview((prev) => ({
          ...prev,
          ...(toolCall.input as JobPreviewData),
        }))
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

  async function handleFileSelect(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/recuriters/chat/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Upload failed')
      }

      const { url, filename } = await res.json()
      setPendingFile({ url, filename })
    } catch {
      setPendingFile(null)
    } finally {
      setUploading(false)
    }
  }

  const visibleMessages = messages.filter((m) => {
    if (m.role !== 'user' && m.role !== 'assistant') return false
    const text = getTextFromParts(
      m.parts as Array<{ type: string; text?: string }>
    )
    return text.length > 0
  })

  return (
    <div className="grid h-full grid-rows-1 grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Chat panel */}
      <div className="lg:col-span-3">
        <div className="border-border/40 bg-card flex h-full flex-col overflow-hidden rounded-xl border">
          {/* Header */}
          <div className="border-border/40 flex items-center gap-3 border-b px-5 py-3.5">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <MagicStar size={16} variant="Bold" className="text-primary" />
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
            className="flex-1 space-y-6 overflow-y-auto px-5 py-4 scrollbar-hide"
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
                pendingFile={pendingFile}
                uploading={uploading}
                onFileSelect={handleFileSelect}
                onRemoveFile={() => setPendingFile(null)}
              />
            </PromptInputProvider>
          </div>
        </div>
      </div>

      {/* Preview panel */}
      <div className="overflow-y-auto lg:col-span-2 scrollbar-hide">
        <JobPreview data={jobPreview} />
      </div>
    </div>
  )
}
