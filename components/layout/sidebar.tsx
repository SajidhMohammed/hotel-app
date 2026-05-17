'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@/lib/auth'
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Package,
  Truck,
  BarChart3,
  Users,
  Settings,
} from 'lucide-react'

interface SidebarProps {
  user: User
  isOpen: boolean
}

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['super_admin', 'manager', 'cashier'],
  },
  {
    label: 'KOT',
    href: '/kot',
    icon: UtensilsCrossed,
    roles: ['super_admin', 'manager', 'waiter'],
  },
  {
    label: 'Products',
    href: '/products',
    icon: ShoppingCart,
    roles: ['super_admin', 'manager'],
  },
  {
    label: 'Stock',
    href: '/stock',
    icon: Package,
    roles: ['super_admin', 'manager', 'store_keeper'],
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['super_admin', 'manager'],
  },
  {
    label: 'Users',
    href: '/users',
    icon: Users,
    roles: ['super_admin', 'manager'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['super_admin', 'manager'],
  },
]

export default function Sidebar({ user, isOpen }: SidebarProps) {
  const pathname = usePathname()

  const accessibleItems = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  )

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-slate-900 text-white transition-all duration-300 border-r border-slate-800 overflow-y-auto`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center justify-center">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">
            RD
          </div>
          {isOpen && <span className="ml-3 font-bold hidden sm:inline">RestaurantDesk</span>}
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="p-3 space-y-1">
        {accessibleItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
