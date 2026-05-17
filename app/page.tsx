'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const session = authService.getSession()
    if (session.isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return null
}
