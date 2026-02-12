import { Header } from '@/components/home/header'
import { Footer } from '@/components/home/footer'
import LayoutWrapper from './layout-wrapper'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutWrapper>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </LayoutWrapper>
  )
}
