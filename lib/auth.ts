'use client'

export type UserRole = 'super_admin' | 'manager' | 'cashier' | 'waiter' | 'store_keeper'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
}

export interface AuthSession {
  user: User | null
  isAuthenticated: boolean
}

// Mock users for demo
const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@restaurant.com': {
    id: '1',
    name: 'Admin User',
    email: 'admin@restaurant.com',
    password: 'admin123',
    role: 'super_admin',
    isActive: true,
  },
  'manager@restaurant.com': {
    id: '2',
    name: 'Manager User',
    email: 'manager@restaurant.com',
    password: 'manager123',
    role: 'manager',
    isActive: true,
  },
  'cashier@restaurant.com': {
    id: '3',
    name: 'Cashier User',
    email: 'cashier@restaurant.com',
    password: 'cashier123',
    role: 'cashier',
    isActive: true,
  },
  'waiter@restaurant.com': {
    id: '4',
    name: 'Waiter User',
    email: 'waiter@restaurant.com',
    password: 'waiter123',
    role: 'waiter',
    isActive: true,
  },
  'storekeeper@restaurant.com': {
    id: '5',
    name: 'Store Keeper User',
    email: 'storekeeper@restaurant.com',
    password: 'storekeeper123',
    role: 'store_keeper',
    isActive: true,
  },
}

export const authService = {
  login(email: string, password: string): { success: boolean; user?: User } {
    const user = MOCK_USERS[email]
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user
      this.setSession(userWithoutPassword)
      return { success: true, user: userWithoutPassword }
    }
    return { success: false }
  },

  getSession(): AuthSession {
    if (typeof window === 'undefined') {
      return { user: null, isAuthenticated: false }
    }
    try {
      const sessionData = localStorage.getItem('auth_session')
      if (sessionData) {
        const session = JSON.parse(sessionData)
        return { user: session, isAuthenticated: true }
      }
    } catch {
      localStorage.removeItem('auth_session')
    }
    return { user: null, isAuthenticated: false }
  },

  setSession(user: User): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_session', JSON.stringify(user))
  },

  logout(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_session')
  },

  // Role-based access control
  hasPermission(role: UserRole, action: string): boolean {
    const permissions: Record<UserRole, string[]> = {
      super_admin: ['all'],
      manager: [
        'view_dashboard',
        'create_bill',
        'view_kots',
        'manage_products',
        'manage_stock',
        'view_reports',
        'manage_users',
        'manage_settings',
      ],
      cashier: [
        'view_dashboard',
        'create_bill',
        'view_bills',
      ],
      waiter: [
        'create_kot',
        'view_kots',
      ],
      store_keeper: [
        'manage_stock',
        'view_reports',
        'manage_suppliers',
      ],
    }

    const userPermissions = permissions[role]
    return userPermissions.includes('all') || userPermissions.includes(action)
  },
}
