'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserInfo, type User } from '@/lib/auth'
import { Edit2, Trash2, Plus, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock users data
const DEMO_USERS: UserInfo[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@restaurant.com',
    role: 'super_admin',
    phone: '+1-555-0001',
    joinDate: '2024-01-01',
    isActive: true,
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@restaurant.com',
    role: 'manager',
    phone: '+1-555-0002',
    joinDate: '2024-01-05',
    isActive: true,
  },
  {
    id: '3',
    name: 'Cashier User',
    email: 'cashier@restaurant.com',
    role: 'cashier',
    phone: '+1-555-0003',
    joinDate: '2024-01-10',
    isActive: true,
  },
  {
    id: '4',
    name: 'Waiter User',
    email: 'waiter@restaurant.com',
    role: 'waiter',
    phone: '+1-555-0004',
    joinDate: '2024-01-15',
    isActive: true,
  },
  {
    id: '5',
    name: 'Store Keeper User',
    email: 'storekeeper@restaurant.com',
    role: 'store_keeper',
    phone: '+1-555-0005',
    joinDate: '2024-01-20',
    isActive: true,
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<UserInfo[]>(DEMO_USERS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier' as User['role'],
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setUsers(users.map(user =>
        user.id === editingId
          ? { ...user, ...formData }
          : user
      ))
      setEditingId(null)
    } else {
      const newUser: UserInfo = {
        id: Date.now().toString(),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true,
      }
      setUsers([...users, newUser])
    }

    setFormData({ name: '', email: '', role: 'cashier', phone: '' })
    setShowForm(false)
  }

  const handleEdit = (user: UserInfo) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
    })
    setEditingId(user.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const toggleActive = (id: string) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ))
  }

  const handleCancel = () => {
    setFormData({ name: '', email: '', role: 'cashier', phone: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const getRoleLabel = (role: User['role']) => {
    const labels: Record<User['role'], string> = {
      super_admin: 'Super Admin',
      manager: 'Manager',
      cashier: 'Cashier',
      waiter: 'Waiter',
      store_keeper: 'Store Keeper',
    }
    return labels[role]
  }

  const getRoleColor = (role: User['role']) => {
    const colors: Record<User['role'], string> = {
      super_admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      cashier: 'bg-green-100 text-green-800',
      waiter: 'bg-orange-100 text-orange-800',
      store_keeper: 'bg-purple-100 text-purple-800',
    }
    return colors[role]
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900">User Management</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Add User
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {editingId ? 'Edit User' : 'New User'}
            </h3>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter user name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="waiter">Waiter</SelectItem>
                    <SelectItem value="store_keeper">Store Keeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} User
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Join Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.joinDate}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => toggleActive(user.id)}
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                      user.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
