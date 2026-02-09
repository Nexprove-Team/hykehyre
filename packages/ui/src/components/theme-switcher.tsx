'use client'

import { useTheme } from 'next-themes'
import { LightbulbIcon, MoonIcon } from 'lucide-react'
import { useEffect, useState, useRef, useEffectEvent } from 'react'
import { Button } from './button'
import { cn, inDevEnvironment } from '../lib/utils'

type Position = {
  x: number
  y: number
}

type Dimensions = {
  width: number
  height: number
}

const defaultPosition: Position = {
  x: 64,
  y: 20,
}

const positionCookieKey = 'themePosition'

const readStoredPosition = (): Position => {
  if (typeof document === 'undefined') return defaultPosition

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${positionCookieKey}=`))

  if (!cookie) return defaultPosition

  try {
    const parsed = JSON.parse(
      decodeURIComponent(cookie.substring(positionCookieKey.length + 1))
    ) as Position

    return typeof parsed.x === 'number' && typeof parsed.y === 'number'
      ? parsed
      : defaultPosition
  } catch {
    return defaultPosition
  }
}

const writeStoredPosition = (position: Position) => {
  try {
    document.cookie = `${positionCookieKey}=${encodeURIComponent(
      JSON.stringify(position)
    )}; path=/; max-age=31536000; samesite=lax`
  } catch {}
}

/* ---------------- component ---------------- */

const ThemeSwitcher = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  })

  const [position, setPosition] = useState<Position>(() => readStoredPosition())
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const hasMoved = useRef(false)
  const mouseDownTime = useRef(0)

  /* ---------------- mount + resize ---------------- */

  useEffect(() => {
    setMounted(true)

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* ---------------- drag handlers ---------------- */

  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    hasMoved.current = false
    mouseDownTime.current = Date.now()

    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const onDragEnd = useEffectEvent(() => {
    const dragDuration = Date.now() - mouseDownTime.current
    setIsDragging(false)

    const isClick = !hasMoved.current && dragDuration < 200

    if (isClick) {
      const nextTheme = theme === 'dark' ? 'light' : 'dark'
      setTheme(nextTheme)
    }
  })

  const onMouseMove = useEffectEvent((e: MouseEvent) => {
    hasMoved.current = true

    const nextX = e.clientX - dragOffset.x
    const nextY = e.clientY - dragOffset.y

    const maxX = dimensions.width - 54
    const maxY = dimensions.height - 54

    if (nextX <= 0 || nextY <= 0 || nextX >= maxX || nextY >= maxY) return

    setPosition({ x: nextX, y: nextY })
  })

  /* ---------------- effects ---------------- */

  useEffect(() => {
    if (!isDragging) return
    writeStoredPosition(position)
  }, [position, isDragging])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onDragEnd)
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onDragEnd)
    }
  }, [isDragging])

  /* ---------------- render ---------------- */

  const effectiveTheme = resolvedTheme ?? theme
  const isDark = effectiveTheme === 'dark'

  if (!mounted || !inDevEnvironment) return null

  return (
    <div
      onMouseDown={onDragStart}
      style={{
        transform: `translateX(${position.x}px) translateY(${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        left: 0,
        top: 0,
      }}
      className={cn(
        'fixed z-999 flex flex-col items-start rounded-full',
        isDark ? 'text-black' : 'text-gray-200'
      )}
    >
      <Button
        variant="ghost"
        size="ghost"
        className={cn(
          'rounded-full p-2 transition-all',
          isDragging
            ? 'pointer-events-none opacity-50 shadow-[0_0_30px_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_30px_10px_rgba(255,255,255,0.5)]'
            : 'opacity-100',
          isDark ? 'bg-gray-200' : 'bg-black'
        )}
      >
        {isDark ? (
          <LightbulbIcon className="size-10" />
        ) : (
          <MoonIcon className="size-10" />
        )}
      </Button>
    </div>
  )
}

export default ThemeSwitcher
