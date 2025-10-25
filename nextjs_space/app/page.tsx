
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AuthPage } from '@/components/auth-page'
import { DashboardPage } from '@/components/dashboard-page'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    return <DashboardPage />
  }

  return <AuthPage />
}
