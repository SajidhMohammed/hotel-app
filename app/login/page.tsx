'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

const DEMO_USERS = [
  { email: 'admin@restaurant.com', password: 'admin123', role: 'Super Admin' },
  { email: 'manager@restaurant.com', password: 'manager123', role: 'Manager' },
  { email: 'cashier@restaurant.com', password: 'cashier123', role: 'Cashier' },
  { email: 'waiter@restaurant.com', password: 'waiter123', role: 'Waiter' },
  { email: 'store@restaurant.com', password: 'store123', role: 'Store Keeper' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = authService.login(email, password)
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 mb-4">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h1 className="text-3xl font-bold text-white">RestaurantDesk</h1>
          <p className="text-slate-400 mt-2">Restaurant Management System</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 bg-white shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-900">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-slate-900">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase mb-4">Demo Credentials</p>
            <div className="space-y-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => {
                    setEmail(user.email)
                    setPassword(user.password)
                  }}
                  className="w-full text-left p-2 rounded hover:bg-slate-50 transition-colors"
                >
                  <p className="text-xs font-medium text-slate-700">{user.role}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-8">
          © 2024 RestaurantDesk. All rights reserved.
        </p>
      </div>
    </div>
  )
}
