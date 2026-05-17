'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'

interface SideNavProps {
  onClose?: () => void
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: ShoppingCart },
  { href: '/stock', label: 'Stock', icon: Package },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/staff', label: 'Staff', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function SideNav({ onClose }: SideNavProps) {
  const pathname = usePathname()

  return (
    <nav className="h-full flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/" onClick={onClose}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RD</span>
            </div>
            <span className="font-bold text-lg">RestaurantDesk</span>
          </div>
        </Link>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`px-6 py-3 flex items-center gap-3 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  )
}
