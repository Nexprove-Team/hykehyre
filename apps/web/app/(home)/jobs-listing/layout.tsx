import { Suspense } from 'react'

export default function JobListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense>{children}</Suspense>
}
