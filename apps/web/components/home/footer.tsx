'use client'
import Link from 'next/link'
import {
  InstagramIcon,
  Logo as LogoIcon,
  GithubIcon,
  XIcon,
} from '@hackhyre/ui/icons'
import { usePathname } from 'next/navigation'
import { cn } from '@hackhyre/ui/lib/utils'

const FOOTER_SECTIONS = [
  {
    title: 'For Job Seekers',
    links: [
      { label: 'Browse Jobs', href: '/jobs-listing' },
      { label: 'Career Resources', href: '#' },
      { label: 'Resume Builder', href: '#' },
      { label: 'Salary Insights', href: '#' },
      { label: 'Skill Assessments', href: '#' },
    ],
  },
  {
    title: 'For Employers',
    links: [
      { label: 'Post a Job', href: '#' },
      { label: 'Talent Search', href: '#' },
      { label: 'Hiring Solutions', href: '#' },
      { label: 'Employer Branding', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Webinars', href: '#' },
      { label: 'Community', href: '/community' },
      { label: 'API Docs', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Partners', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
  },
] as const

const SOCIAL_LINKS = [
  {
    label: 'X (Twitter)',
    href: '#',
    icon: <XIcon />,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: <GithubIcon />,
  },
  {
    label: 'Instagram',
    href: '#',
    icon: <InstagramIcon />,
  },
] as const

export function Footer() {
  const path = usePathname()
  return (
    <footer
      className={cn(
        'border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950'
      )}
    >
      <div className="mx-auto max-w-375 px-4 pt-16 sm:px-6 lg:px-8">
        <div className="bg-brand-navy relative overflow-hidden rounded-2xl px-6 py-12 sm:px-12 sm:py-16 dark:border dark:border-neutral-800">
          {/* Decorative gradient blobs */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.07] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.05] blur-3xl" />

          {/* Grid pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <p className="mb-1 text-xs font-semibold tracking-widest text-[oklch(0.82_0.22_155)] uppercase">
                Get Started Today
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Join our community of ambitious professionals
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                Unlock your true potential and discover a world of opportunities
                that align with your skills, interests, and aspirations.
              </p>
            </div>
            <Link
              href="/sign-up"
              className="text-brand-navy inline-flex shrink-0 items-center gap-2 rounded-xl bg-[oklch(0.82_0.22_155)] px-6 py-3 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Get started now
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-375 px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-[13px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <div className="border-t border-neutral-200 dark:border-neutral-800" />
      </div>

      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 py-10 lg:flex-row lg:items-end lg:justify-between">
          {/* Brand + newsletter */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-16">
            {/* Brand */}
            <div className="shrink-0">
              <Link href="/" className="flex items-center gap-0.5">
                <div className="flex h-9 w-9 items-center justify-center">
                  <LogoIcon />
                </div>
                <p className="font-mono text-[15px] leading-none font-bold tracking-tight dark:text-white">
                  Hack
                  <span className="text-[oklch(0.82_0.22_155)]">Hyre</span>
                </p>
              </Link>
              <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                The modern job platform connecting ambitious talent with
                forward-thinking companies.
              </p>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">
                Newsletter
              </p>
              <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
                Subscribe to get the latest updates.
              </p>
              <form
                className="mt-3 flex items-center gap-2"
                // onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="h-9 w-full max-w-56 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-[13px] text-neutral-900 transition-colors outline-none placeholder:text-neutral-400 focus:border-[oklch(0.82_0.22_155)] focus:ring-1 focus:ring-[oklch(0.82_0.22_155)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  className="bg-brand-navy h-9 shrink-0 rounded-lg px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2a2d3f] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
                aria-label={social.label}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-100 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto flex max-w-375 flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[12px] text-neutral-400">
            &copy; {new Date().getFullYear()} HackHyre. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-[12px] text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[12px] text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-[12px] text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
