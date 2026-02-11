import Link, { LinkProps } from 'next/link'
import { Logo as LogoIcon } from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'

export function Logo({
  isJobListing,
  href,
  ...rest
}: LinkProps & { isJobListing?: boolean }) {
  return (
    <Link href={href ?? '/'} className="flex items-center gap-0.5" {...rest}>
      <div className="flex h-9 w-9 items-center justify-center">
        <LogoIcon />
      </div>
      <p
        className={cn(
          'font-mono text-[15px] leading-none font-bold tracking-tight',
          isJobListing ? 'text-white' : ''
        )}
      >
        Hack<span className="text-primary">Hyre</span>
      </p>
    </Link>
  )
}
