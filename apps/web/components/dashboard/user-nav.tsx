'use client'

import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@hackhyre/ui/components/dropdown-menu'
import { Badge } from '@hackhyre/ui/components/badge'
import { Profile, Setting, LogoutCurve, Crown } from '@hackhyre/ui/icons'
import { MOCK_USER } from '@/lib/mock-data'

export function UserNav() {
  const initials = MOCK_USER.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-ring hover:bg-accent flex items-center gap-2 rounded-xl p-1.5 transition-colors outline-none focus-visible:ring-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{MOCK_USER.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {MOCK_USER.email}
              </p>
              <Badge
                variant="secondary"
                className="mt-1 px-1.5 py-0 text-[10px]"
              >
                <Crown
                  size={10}
                  variant="Bold"
                  className="mr-0.5 text-amber-500"
                />
                Pro
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-[13px]">
          <Profile size={15} variant="Linear" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-[13px]">
          <Setting size={15} variant="Linear" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 text-[13px]">
          <LogoutCurve size={15} variant="Linear" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
