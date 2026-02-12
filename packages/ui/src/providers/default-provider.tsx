'use client'

import QueryProvider from './query-provider'
import { ThemeProviderProps } from 'next-themes'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '../components/sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ThemeSwitcher from '../components/theme-switcher'
import { inDevEnvironment } from '../lib/utils'
import { TooltipProvider } from '../components/tooltip'

export function DefaultProvider({
  children,
  showThemeSwitcher = true,
  showQueryDevtools = inDevEnvironment,
  defaultTheme = 'system',
  ...rest
}: ThemeProviderProps & {
  showThemeSwitcher?: boolean
  showQueryDevtools?: boolean
}) {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme={defaultTheme} {...rest}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors />
        {showQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        {showThemeSwitcher && <ThemeSwitcher />}
      </ThemeProvider>
    </QueryProvider>
  )
}
