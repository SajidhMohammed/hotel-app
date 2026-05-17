'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import AppLayout from '@/app/app-layout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const session = authService.getSession()
    if (!session.isAuthenticated) {
      router.push('/login')
    }
  }, [router])

  return <AppLayout>{children}</AppLayout>
}
