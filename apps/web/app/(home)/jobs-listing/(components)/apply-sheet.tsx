'use client'

import { useState, useRef } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@hackhyre/ui/components/sheet'
import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Label } from '@hackhyre/ui/components/label'
import { Textarea } from '@hackhyre/ui/components/textarea'
import { Checkbox } from '@hackhyre/ui/components/checkbox'
import { Separator } from '@hackhyre/ui/components/separator'
import { Badge } from '@hackhyre/ui/components/badge'
import {
  Send,
  TickCircle,
  DocumentText,
  LinkIcon,
  Sms,
  User,
  Briefcase,
  Star,
  CloseCircle,
  ArrowRight,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { useApplySheet } from './use-apply-sheet'

// ── Force light mode via CSS variable overrides ───────────────────────

const LIGHT_VARS: React.CSSProperties = {
  '--background': 'oklch(0.985 0 0)',
  '--foreground': 'oklch(0.145 0.005 285)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.145 0.005 285)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.145 0.005 285)',
  '--secondary': 'oklch(0.955 0.003 260)',
  '--secondary-foreground': 'oklch(0.205 0.005 260)',
  '--muted': 'oklch(0.955 0.003 260)',
  '--muted-foreground': 'oklch(0.52 0.01 260)',
  '--accent': 'oklch(0.955 0.04 155)',
  '--accent-foreground': 'oklch(0.145 0.005 285)',
  '--destructive': 'oklch(0.58 0.22 25)',
  '--destructive-foreground': 'oklch(0.985 0 0)',
  '--border': 'oklch(0.92 0.005 260)',
  '--input': 'oklch(0.92 0.005 260)',
  colorScheme: 'light',
} as React.CSSProperties

// ── Mock relevance results ────────────────────────────────────────────

interface RelevanceResult {
  score: number
  feedback: string
  strengths: string[]
  gaps: string[]
}

function generateMockRelevance(): RelevanceResult {
  const score = Math.round((0.6 + Math.random() * 0.35) * 100) / 100
  const percentage = Math.round(score * 100)

  const allStrengths = [
    'Relevant industry experience matches role requirements',
    'Strong technical skills aligned with job description',
    'Educational background is a great fit for this position',
    'Portfolio demonstrates relevant project work',
    'Leadership experience adds value to this role',
  ]
  const allGaps = [
    'Consider highlighting specific metrics and achievements',
    'Adding more detail about relevant tools would strengthen your application',
    'A more tailored cover letter could improve your score',
  ]

  const strengths = allStrengths
    .sort(() => Math.random() - 0.5)
    .slice(0, 2 + Math.floor(Math.random() * 2))
  const gaps =
    percentage >= 80
      ? allGaps.slice(0, 1)
      : allGaps
          .sort(() => Math.random() - 0.5)
          .slice(0, 1 + Math.floor(Math.random() * 2))

  let feedback: string
  if (percentage >= 85) {
    feedback =
      'Excellent match! Your profile strongly aligns with this role. The hiring team will be reviewing your application shortly.'
  } else if (percentage >= 70) {
    feedback =
      'Good match! Your skills and experience are relevant to this position. A few enhancements could strengthen your application further.'
  } else {
    feedback =
      'Your application has been submitted. While there are some gaps, your background shows potential. Consider the suggestions below.'
  }

  return { score, feedback, strengths, gaps }
}

// ── Score Ring ─────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const percentage = Math.round(score * 100)
  const circumference = 2 * Math.PI * 40
  const offset = circumference - score * circumference

  const color =
    percentage >= 80
      ? 'text-emerald-500'
      : percentage >= 65
        ? 'text-amber-500'
        : 'text-rose-500'

  const strokeColor =
    percentage >= 80
      ? 'stroke-emerald-500'
      : percentage >= 65
        ? 'stroke-amber-500'
        : 'stroke-rose-500'

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg
        className="-rotate-90"
        width="112"
        height="112"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          className={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-2xl font-bold tabular-nums', color)}>
          {percentage}%
        </span>
        <span className="text-[10px] font-medium text-neutral-500">Match</span>
      </div>
    </div>
  )
}

// ── Form State ─────────────────────────────────────────────────────────

interface FormData {
  name: string
  email: string
  linkedinUrl: string
  coverLetter: string
  talentPoolOptIn: boolean
  resumeFile: File | null
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  linkedinUrl: '',
  coverLetter: '',
  talentPoolOptIn: false,
  resumeFile: null,
}

// ── Sheet ─────────────────────────────────────────────────────────────

const SHEET_CLASSES =
  'w-full sm:w-[520px] sm:max-w-[520px] p-0 flex flex-col inset-0 sm:inset-y-3 sm:right-3 sm:left-auto h-dvh sm:h-[calc(100dvh-1.5rem)] rounded-none sm:rounded-2xl border-0 sm:border bg-white text-neutral-900'

export function ApplySheet() {
  const { isOpen, jobTitle, company, close } = useApplySheet()
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<RelevanceResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (patch: Partial<FormData>) =>
    setForm((prev) => ({ ...prev, ...patch }))

  const isValid = form.name.trim() && form.email.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))
    setResult(generateMockRelevance())
    setSubmitted(true)
    setSubmitting(false)
  }

  const handleClose = () => {
    close()
    // Reset after close animation
    setTimeout(() => {
      setForm(INITIAL_FORM)
      setSubmitted(false)
      setResult(null)
      setSubmitting(false)
    }, 300)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="right"
        className={SHEET_CLASSES}
        style={LIGHT_VARS}
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Apply for {jobTitle}</SheetTitle>

        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-neutral-900">
              {submitted ? 'Application Submitted' : 'Apply for this role'}
            </h3>
            <p className="mt-0.5 truncate text-[12px] text-neutral-500">
              {jobTitle} at {company}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {submitted && result ? (
            <SuccessView result={result} onClose={handleClose} />
          ) : (
            <ApplicationForm
              form={form}
              update={update}
              submitting={submitting}
              isValid={isValid}
              fileInputRef={fileInputRef}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Application Form ──────────────────────────────────────────────────

function ApplicationForm({
  form,
  update,
  submitting,
  isValid,
  fileInputRef,
  onSubmit,
}: {
  form: FormData
  update: (patch: Partial<FormData>) => void
  submitting: boolean
  isValid: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit} className="px-5 py-5">
      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="name"
            className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700"
          >
            <User size={12} variant="Linear" className="text-neutral-400" />
            Full Name <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="John Doe"
            className="focus-visible:ring-primary h-10 rounded-lg border-neutral-200 bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700"
          >
            <Sms size={12} variant="Linear" className="text-neutral-400" />
            Email Address <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="john@example.com"
            className="focus-visible:ring-primary h-10 rounded-lg border-neutral-200 bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        {/* Resume Upload */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700">
            <DocumentText
              size={12}
              variant="Linear"
              className="text-neutral-400"
            />
            Resume
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              update({ resumeFile: file })
            }}
          />
          {form.resumeFile ? (
            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
              <DocumentText
                size={16}
                variant="Bold"
                className="text-primary shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-neutral-900">
                  {form.resumeFile.name}
                </p>
                <p className="text-[10px] text-neutral-500">
                  {(form.resumeFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  update({ resumeFile: null })
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="shrink-0 text-neutral-400 hover:text-neutral-900"
              >
                <CloseCircle size={16} variant="Linear" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="hover:border-primary hover:bg-primary/5 flex w-full flex-col items-center gap-1.5 rounded-lg border border-dashed border-neutral-300 bg-neutral-50/50 px-4 py-5 transition-colors"
            >
              <DocumentText
                size={20}
                variant="Linear"
                className="text-neutral-400"
              />
              <span className="text-[12px] font-medium text-neutral-600">
                Click to upload your resume
              </span>
              <span className="text-[10px] text-neutral-400">
                PDF, DOC, or DOCX (max 5MB)
              </span>
            </button>
          )}
        </div>

        {/* LinkedIn URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor="linkedin"
            className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700"
          >
            <LinkIcon size={12} variant="Linear" className="text-neutral-400" />
            LinkedIn Profile
          </Label>
          <Input
            id="linkedin"
            value={form.linkedinUrl}
            onChange={(e) => update({ linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/yourprofile"
            className="focus-visible:ring-primary h-10 rounded-lg border-neutral-200 bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        {/* Cover Letter */}
        <div className="space-y-1.5">
          <Label
            htmlFor="cover"
            className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700"
          >
            <Briefcase
              size={12}
              variant="Linear"
              className="text-neutral-400"
            />
            Why are you interested?
          </Label>
          <Textarea
            id="cover"
            value={form.coverLetter}
            onChange={(e) => update({ coverLetter: e.target.value })}
            placeholder="Tell us why you're a great fit for this role..."
            rows={4}
            className="focus-visible:ring-primary resize-none rounded-lg border-neutral-200 bg-white text-[13px] text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        <Separator className="bg-neutral-200" />

        {/* Talent Pool Opt-in */}
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3.5">
          <Checkbox
            checked={form.talentPoolOptIn}
            onCheckedChange={(checked) =>
              update({ talentPoolOptIn: !!checked })
            }
            className="data-[state=checked]:border-primary data-[state=checked]:bg-primary mt-0.5 border-neutral-300 bg-white"
          />
          <div>
            <p className="text-[12px] font-medium text-neutral-900">
              Keep me in the talent pool
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500">
              Even if I&apos;m not selected for this role, I&apos;d like to be
              considered for future opportunities that match my profile.
            </p>
          </div>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          disabled={!isValid || submitting}
          className="bg-primary hover:bg-primary/90 w-full gap-2 rounded-lg py-2.5 text-[13px] font-semibold text-neutral-900 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-900/20 border-t-neutral-900" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={14} variant="Linear" />
              Submit Application
            </>
          )}
        </Button>

        <p className="text-center text-[10px] leading-relaxed text-neutral-400">
          By submitting, you agree to our privacy policy. Your data will only be
          shared with the hiring team for this position
          {form.talentPoolOptIn ? ' and for future matching opportunities' : ''}
          .
        </p>
      </div>
    </form>
  )
}

// ── Success View ──────────────────────────────────────────────────────

function SuccessView({
  result,
  onClose,
}: {
  result: RelevanceResult
  onClose: () => void
}) {
  const percentage = Math.round(result.score * 100)

  return (
    <div className="px-5 py-6">
      <div className="flex flex-col items-center text-center">
        <ScoreRing score={result.score} />

        <div className="mt-4">
          <div className="flex items-center justify-center gap-2">
            <TickCircle size={18} variant="Bold" className="text-emerald-500" />
            <h3 className="text-[16px] font-bold text-neutral-900">
              Application Received
            </h3>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'mt-2 px-2.5 py-0.5 text-[11px] font-semibold',
              percentage >= 80
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : percentage >= 65
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
            )}
          >
            {percentage >= 80
              ? 'Strong Match'
              : percentage >= 65
                ? 'Good Match'
                : 'Potential Match'}
          </Badge>
        </div>
      </div>

      <p className="mt-4 text-center text-[12px] leading-relaxed text-neutral-600">
        {result.feedback}
      </p>

      <Separator className="my-5 bg-neutral-200" />

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="mb-4">
          <div className="mb-2.5 flex items-center gap-2">
            <Star size={14} variant="Bold" className="text-emerald-500" />
            <h4 className="text-[12px] font-semibold text-neutral-900">
              What stood out
            </h4>
          </div>
          <ul className="space-y-2">
            {result.strengths.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[12px] text-neutral-600"
              >
                <TickCircle
                  size={13}
                  variant="Bold"
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {result.gaps.length > 0 && (
        <div className="mb-5">
          <div className="mb-2.5 flex items-center gap-2">
            <ArrowRight size={14} variant="Bold" className="text-amber-500" />
            <h4 className="text-[12px] font-semibold text-neutral-900">
              How to improve
            </h4>
          </div>
          <ul className="space-y-2">
            {result.gaps.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[12px] text-neutral-600"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator className="my-5 bg-neutral-200" />

      {/* What happens next */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <h4 className="mb-2 text-[12px] font-semibold text-neutral-900">
          What happens next?
        </h4>
        <div className="space-y-2.5">
          {[
            'Your application is being reviewed by the hiring team',
            "You'll receive an email update within 5 business days",
            "If shortlisted, you'll be contacted for next steps",
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 text-[11px] text-neutral-600"
            >
              <span className="bg-primary/15 text-primary flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onClose}
        className="mt-5 w-full gap-2 rounded-lg bg-neutral-900 text-[13px] font-semibold text-white hover:bg-neutral-800"
      >
        Done
      </Button>
    </div>
  )
}
