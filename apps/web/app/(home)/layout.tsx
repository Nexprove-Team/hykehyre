import { Header } from '@/components/home/header'
import LayoutWrapper from './layout-wrapper'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = {
    name: 'John Doe',
    email: 'phoenixdahdev@gmail.com',
    image: 'https://i.pravatar.cc/150?img=3',
    location: 'San Francisco, CA',
  }
  return (
    <LayoutWrapper>
      <Header user={user} />
      <main>{children}</main>
    </LayoutWrapper>
  )
}
