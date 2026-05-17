'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User, authService } from '@/lib/auth'
import { Bell, Menu, LogOut, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface TopbarProps {
  user: User
  onMenuClick: () => void
}

export default function Topbar({ user, onMenuClick }: TopbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isCashierPage = pathname === '/billing'

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  const canSwitchView =
    user.role === 'super_admin' || user.role === 'manager'

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-xl font-semibold text-slate-900">RestaurantDesk</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Switch to Cashier View */}
        {canSwitchView && (
          <Button
            variant={isCashierPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              if (isCashierPage) {
                router.push('/dashboard')
              } else {
                router.push('/billing')
              }
            }}
          >
            {isCashierPage ? 'Switch to Admin' : 'Switch to Cashier'}
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/settings" className="cursor-pointer">
                <Settings size={16} className="mr-2" />
                Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
