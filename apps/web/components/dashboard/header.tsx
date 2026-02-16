'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@hackhyre/ui/components/popover'
import { Separator } from '@hackhyre/ui/components/separator'
import {
  SearchNormal,
  Notification,
  Category,
  ArrowRight,
  TickCircle,
  Clock,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { useSidebar } from '@/hooks/use-sidebar'
import { UserNav } from './user-nav'

const BREADCRUMB_MAP: Record<string, string> = {
  '/': 'Dashboard',
  '/jobs': 'Jobs',
  '/jobs/create': 'Create Job',
  '/candidates': 'Candidates',
  '/applications': 'Applications',
  '/interviews': 'Interviews',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

function Breadcrumbs() {
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { label: string; href: string }[] = [
    { label: 'Dashboard', href: '/' },
  ]

  let accumulated = ''
  for (const seg of segments) {
    accumulated += `/${seg}`
    const label =
      BREADCRUMB_MAP[accumulated] ?? seg.charAt(0).toUpperCase() + seg.slice(1)
    crumbs.push({ label, href: accumulated })
  }

  if (crumbs.length === 1) return null

  return (
    <nav className="hidden items-center gap-1 text-sm md:flex">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && (
              <ArrowRight
                size={12}
                variant="Linear"
                className="text-muted-foreground/50 mx-0.5"
              />
            )}
            {isLast ? (
              <span className="text-foreground text-[13px] font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New application received',
    desc: 'Alex Johnson applied for Senior Frontend Engineer',
    time: '2h ago',
    read: false,
  },
  {
    id: 2,
    title: 'Interview scheduled',
    desc: 'Priya Sharma confirmed for tomorrow at 2 PM',
    time: '5h ago',
    read: false,
  },
  {
    id: 3,
    title: 'Job listing approved',
    desc: 'Backend Engineer is now live',
    time: '1d ago',
    read: true,
  },
]

function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Notification size={18} variant="Linear" />
          <span className="bg-primary ring-background absolute top-1 right-1 h-2 w-2 rounded-full ring-2" />
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button className="text-primary text-xs font-medium hover:underline">
            Mark all read
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {MOCK_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className={cn(
                'hover:bg-accent/50 flex gap-3 border-b px-4 py-3 transition-colors last:border-0',
                !n.read && 'bg-primary/[0.02]'
              )}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  !n.read ? 'bg-primary/10' : 'bg-muted'
                )}
              >
                {!n.read ? (
                  <TickCircle
                    size={14}
                    variant="Bold"
                    className="text-primary"
                  />
                ) : (
                  <Clock
                    size={14}
                    variant="Linear"
                    className="text-muted-foreground"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-[13px] leading-tight',
                    !n.read && 'font-medium'
                  )}
                >
                  {n.title}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[12px] leading-tight">
                  {n.desc}
                </p>
                <p className="text-muted-foreground/60 mt-1 text-[11px]">
                  {n.time}
                </p>
              </div>
              {!n.read && (
                <span className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function Header() {
  const openMobile = useSidebar((s) => s.openMobile)

  return (
    <header className="bg-card/80 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-sm">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 lg:hidden"
        onClick={openMobile}
      >
        <Category size={18} variant="Linear" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Search — pushed to the right side */}
      <div className="relative ml-auto max-w-xs flex-1 md:max-w-sm">
        <SearchNormal
          size={15}
          variant="Linear"
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
        />
        <Input
          placeholder="Search..."
          className="bg-muted/50 focus-visible:bg-background h-9 rounded-xl border-0 pl-9 text-[13px]"
        />
      </div>

      <Separator orientation="vertical" className="mx-1 hidden h-6 md:block" />

      {/* Notifications & user */}
      <div className="flex items-center gap-1">
        <NotificationsPopover />
        <UserNav />
      </div>
    </header>
  )
}
