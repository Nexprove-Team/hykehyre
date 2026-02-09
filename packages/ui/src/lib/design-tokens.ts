/**
 * Hackhyre Design System — Tokens
 *
 * Programmatic access to the brand palette, semantic colors, typography,
 * spacing, radii, and shadows used across the design system.
 *
 * These tokens mirror the CSS custom-properties defined in globals.css
 * and should be used for JS-driven styling (emails, charts, canvas, PDFs).
 */

// ─── Brand Palette ──────────────────────────────────────────────────────────

export const brand = {
  green: '#24E673',
  charcoal: '#232426',
  navy: '#202331',
  black: '#131315',
  white: '#FBFBFB',
} as const

// ─── Semantic Colors (light / dark) ─────────────────────────────────────────

export const colors = {
  light: {
    background: '#FBFBFB',
    foreground: '#131315',
    card: '#FFFFFF',
    cardForeground: '#131315',
    popover: '#FFFFFF',
    popoverForeground: '#131315',
    primary: '#24E673',
    primaryForeground: '#131315',
    secondary: '#F0F0F2',
    secondaryForeground: '#232426',
    muted: '#F0F0F2',
    mutedForeground: '#737578',
    accent: '#EEFCF3',
    accentForeground: '#131315',
    destructive: '#E5484D',
    destructiveForeground: '#FBFBFB',
    success: '#24E673',
    successForeground: '#131315',
    warning: '#F5A623',
    warningForeground: '#3D2800',
    info: '#3B82F6',
    infoForeground: '#FBFBFB',
    border: '#E4E4E7',
    input: '#E4E4E7',
    ring: '#24E673',
  },
  dark: {
    background: '#131315',
    foreground: '#FBFBFB',
    card: '#202331',
    cardForeground: '#FBFBFB',
    popover: '#202331',
    popoverForeground: '#FBFBFB',
    primary: '#24E673',
    primaryForeground: '#131315',
    secondary: '#232426',
    secondaryForeground: '#FBFBFB',
    muted: '#232426',
    mutedForeground: '#9CA3AF',
    accent: '#1E2A22',
    accentForeground: '#FBFBFB',
    destructive: '#C13033',
    destructiveForeground: '#FBFBFB',
    success: '#24E673',
    successForeground: '#131315',
    warning: '#D4912A',
    warningForeground: '#1A1100',
    info: '#2563EB',
    infoForeground: '#FBFBFB',
    border: '#2A2D3A',
    input: '#2A2D3A',
    ring: '#24E673',
  },
} as const

// ─── Chart Colors ───────────────────────────────────────────────────────────

export const chart = {
  light: {
    1: '#24E673',
    2: '#14B8A6',
    3: '#F5A623',
    4: '#3B82F6',
    5: '#A855F7',
  },
  dark: {
    1: '#1FBF60',
    2: '#0D9488',
    3: '#D4912A',
    4: '#2563EB',
    5: '#7C3AED',
  },
} as const

// ─── Typography ─────────────────────────────────────────────────────────────

export const fontFamily = {
  sans: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
} as const

export const fontSize = {
  '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem', { lineHeight: '1' }],
  '6xl': ['3.75rem', { lineHeight: '1' }],
} as const

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
} as const

// ─── Spacing ────────────────────────────────────────────────────────────────

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
} as const

// ─── Border Radius ──────────────────────────────────────────────────────────

export const radius = {
  sm: 'calc(0.625rem - 4px)',
  md: 'calc(0.625rem - 2px)',
  lg: '0.625rem',
  xl: 'calc(0.625rem + 4px)',
  full: '9999px',
} as const

// ─── Shadows ────────────────────────────────────────────────────────────────

export const shadow = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px rgba(36, 230, 115, 0.3)',
  'glow-lg':
    '0 0 40px rgba(36, 230, 115, 0.25), 0 0 80px rgba(36, 230, 115, 0.1)',
} as const

// ─── Breakpoints ────────────────────────────────────────────────────────────

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ─── Z-Index ────────────────────────────────────────────────────────────────

export const zIndex = {
  dropdown: '50',
  sticky: '40',
  overlay: '30',
  modal: '50',
  popover: '50',
  toast: '100',
} as const

// ─── Transitions ────────────────────────────────────────────────────────────

export const transition = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

// ─── Aggregate export ───────────────────────────────────────────────────────

export const tokens = {
  brand,
  colors,
  chart,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  spacing,
  radius,
  shadow,
  breakpoints,
  zIndex,
  transition,
} as const

export type DesignTokens = typeof tokens
