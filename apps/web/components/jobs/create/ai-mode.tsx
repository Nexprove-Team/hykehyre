'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'

import { useCreateJob } from '@/hooks/use-jobs'
import type { CreateJobInput } from '@/actions/job-mutations'

import { Button } from '@hackhyre/ui/components/button'
import { Spinner } from '@hackhyre/ui/components/spinner'
import { ScrollArea } from '@hackhyre/ui/components/scroll-area'
import { TickCircle, MagicStar } from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'

import { ChatBubble, TypingIndicator, type ChatMessage } from './chat-bubble'
import { ChatInput } from './chat-input'
import { JobPreview } from './job-preview'
import { VOICE_AI_SCRIPT } from '@/lib/mock-data'

interface ConstructedJob {
  companyId?: string
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

export function AiMode() {
  const router = useRouter()
  const { mutateAsync, isPending: isCreating } = useCreateJob()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [scriptIndex, setScriptIndex] = useState(0)
  const [constructedJob, setConstructedJob] = useState<ConstructedJob>({})
  const [isComplete, setIsComplete] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Send initial AI greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstScript = VOICE_AI_SCRIPT[0]
      if (firstScript) {
        setMessages([
          {
            id: 'ai-0',
            role: 'ai',
            content: firstScript.response,
          },
        ])
        setScriptIndex(1)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const processUserMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping || isComplete) return

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
      }
      setMessages((prev) => [...prev, userMsg])
      setInput('')

      const currentScript = VOICE_AI_SCRIPT[scriptIndex - 1]
      if (currentScript?.field) {
        const userText = text.trim()
        setConstructedJob((prev) => {
          const updated = { ...prev }
          switch (currentScript.field) {
            case 'title':
              updated.title = userText
              break
            case 'employmentType':
              if (userText.toLowerCase().includes('full'))
                updated.employmentType = 'full_time'
              else if (userText.toLowerCase().includes('part'))
                updated.employmentType = 'part_time'
              else if (userText.toLowerCase().includes('contract'))
                updated.employmentType = 'contract'
              else if (userText.toLowerCase().includes('intern'))
                updated.employmentType = 'internship'
              else updated.employmentType = 'full_time'
              break
            case 'experienceLevel':
              if (userText.toLowerCase().includes('entry'))
                updated.experienceLevel = 'entry'
              else if (userText.toLowerCase().includes('mid'))
                updated.experienceLevel = 'mid'
              else if (userText.toLowerCase().includes('senior'))
                updated.experienceLevel = 'senior'
              else if (userText.toLowerCase().includes('lead'))
                updated.experienceLevel = 'lead'
              else if (userText.toLowerCase().includes('exec'))
                updated.experienceLevel = 'executive'
              else updated.experienceLevel = 'mid'
              break
            case 'location':
              updated.location = userText
              updated.isRemote =
                userText.toLowerCase().includes('remote') ||
                userText.toLowerCase().includes('yes')
              break
            case 'salary': {
              const nums = userText.match(/\d[\d,]*/g)
              if (nums && nums.length >= 2) {
                updated.salaryMin = parseInt(nums[0]!.replace(/,/g, ''), 10)
                updated.salaryMax = parseInt(nums[1]!.replace(/,/g, ''), 10)
              } else if (nums && nums.length === 1) {
                const val = parseInt(nums[0]!.replace(/,/g, ''), 10)
                updated.salaryMin = val
                updated.salaryMax = Math.round(val * 1.3)
              }
              updated.salaryCurrency = 'USD'
              break
            }
            case 'responsibilities':
              updated.responsibilities = userText
                .split(/[,;\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
              break
            case 'requirements':
              updated.requirements = userText
                .split(/[,;\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
              break
            case 'skills':
              updated.skills = userText
                .split(/[,;\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
              break
          }
          return updated
        })
      }

      // Show typing indicator, then AI response
      setIsTyping(true)
      const nextScript = VOICE_AI_SCRIPT[scriptIndex]

      setTimeout(() => {
        setIsTyping(false)
        if (nextScript) {
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              role: 'ai',
              content: nextScript.response,
            },
          ])
          setScriptIndex((prev) => prev + 1)

          if (scriptIndex >= VOICE_AI_SCRIPT.length - 1) {
            setIsComplete(true)
          }
        }
      }, 1200)
    },
    [scriptIndex, isTyping, isComplete]
  )

  function handleSend() {
    processUserMessage(input)
  }

  function toggleRecording() {
    if (isRecording) {
      setIsRecording(false)
      setTimeout(() => {
        processUserMessage('Senior Full Stack Engineer')
      }, 300)
    } else {
      setIsRecording(true)
      setTimeout(() => setIsRecording(false), 3000)
    }
  }

  async function handleCreateJob() {
    try {
      await mutateAsync({
        title: constructedJob.title ?? 'Untitled Job',
        description: constructedJob.description ?? '',
        companyId: constructedJob.companyId,
        employmentType:
          constructedJob.employmentType as CreateJobInput['employmentType'],
        experienceLevel:
          constructedJob.experienceLevel as CreateJobInput['experienceLevel'],
        location: constructedJob.location,
        isRemote: constructedJob.isRemote,
        salaryMin: constructedJob.salaryMin,
        salaryMax: constructedJob.salaryMax,
        salaryCurrency: constructedJob.salaryCurrency,
        requirements: constructedJob.requirements,
        responsibilities: constructedJob.responsibilities,
        skills: constructedJob.skills,
        status: 'draft',
      })
      toast.success('Job created!', {
        description: `"${constructedJob.title}" has been saved as a draft.`,
      })
      router.push('/recuriter/jobs')
    } catch (error) {
      toast.error('Failed to create job', {
        description:
          error instanceof Error ? error.message : 'Something went wrong',
      })
    }
  }

  const hasContent = Object.keys(constructedJob).length > 0

  return (
    <div className="grid h-[calc(100vh-15rem)] grid-cols-1 gap-6 lg:grid-cols-5">
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
            {isComplete && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                Complete
              </motion.div>
            )}
          </div>

          {/* Messages area */}
          <ScrollArea className="min-h-0 flex-1" ref={scrollRef}>
            <div className="space-y-4 px-5 py-4">
              {/* Welcome hint — visible only before first AI message */}
              {messages.length === 0 && (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-muted-foreground/40 text-center">
                    <MagicStar
                      size={32}
                      variant="Bulk"
                      className="mx-auto mb-3"
                    />
                    <p className="text-sm">Starting conversation...</p>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              <AnimatePresence>
                {isTyping && <TypingIndicator />}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-border/40 border-t px-4 py-3">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
              onMicToggle={toggleRecording}
              isRecording={isRecording}
              disabled={isTyping || isComplete}
              placeholder={
                isComplete
                  ? 'Conversation complete — review your listing'
                  : 'Type your response or use the mic...'
              }
            />
            <p className="text-muted-foreground/50 mt-2 px-1 text-[11px]">
              Press Enter to send &middot; Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Preview panel */}
      <div className="space-y-4 lg:col-span-2">
        <JobPreview data={constructedJob} />

        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                className={cn(
                  'w-full',
                  'bg-primary hover:bg-primary/90 relative overflow-hidden'
                )}
                size="lg"
                onClick={handleCreateJob}
                disabled={isCreating}
              >
                {isCreating ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <TickCircle size={18} variant="Bold" className="mr-2" />
                )}
                {isCreating ? 'Creating...' : 'Create Job'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
