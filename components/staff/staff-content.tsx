'use client'

import { useState, useEffect } from 'react'
import { dataStore, StaffMember } from '@/lib/data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react'

const shiftColors = {
  morning: 'bg-orange-100 text-orange-800',
  afternoon: 'bg-blue-100 text-blue-800',
  night: 'bg-purple-100 text-purple-800',
}

export default function StaffContent() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    phone: '',
    email: '',
    shift: 'morning' as const,
  })

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = () => {
    setStaff(dataStore.getStaff())
  }

  const handleAddStaff = () => {
    if (formData.name && formData.position && formData.email) {
      const newMember: StaffMember = {
        id: `staff_${Date.now()}`,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true,
      }
      dataStore.addStaff(newMember)
      loadStaff()
      resetForm()
    }
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    dataStore.updateStaff(id, { isActive: !isActive })
    loadStaff()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      phone: '',
      email: '',
      shift: 'morning',
    })
    setEditingId(null)
    setIsDialogOpen(false)
  }

  const activeStaff = staff.filter(m => m.isActive)
  const inactiveStaff = staff.filter(m => !m.isActive)

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Staff Management</h2>
          <p className="text-slate-600 mt-2">Manage your hotel staff</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={20} />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Enter staff member details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Manager, Receptionist, etc."
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@hotel.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1-555-0000"
                />
              </div>
              <div>
                <Label htmlFor="shift">Shift</Label>
                <Select value={formData.shift} onValueChange={(value: any) => setFormData({ ...formData, shift: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6am-2pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2pm-10pm)</SelectItem>
                    <SelectItem value="night">Night (10pm-6am)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddStaff} className="w-full">
                Add Staff Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Active Staff</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{activeStaff.length}</p>
          <p className="text-xs text-slate-500 mt-1">Currently on duty</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Total Staff</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{staff.length}</p>
          <p className="text-xs text-slate-500 mt-1">{inactiveStaff.length} inactive</p>
        </Card>
      </div>

      {/* Active Staff */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Staff</h3>
        {activeStaff.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600">No active staff members.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStaff.map((member) => (
              <Card key={member.id} className="p-6 bg-white border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900">{member.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{member.position}</p>
                  </div>
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div className="space-y-3 text-sm mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Shift</p>
                    <Badge className={shiftColors[member.shift]}>
                      {member.shift.charAt(0).toUpperCase() + member.shift.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Email</p>
                    <p className="text-slate-900">{member.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Phone</p>
                    <p className="text-slate-900">{member.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Joined</p>
                    <p className="text-slate-900">{member.joinDate}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleToggleActive(member.id, member.isActive)}
                >
                  Deactivate
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Staff */}
      {inactiveStaff.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Inactive Staff</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveStaff.map((member) => (
              <Card key={member.id} className="p-6 bg-slate-50 border border-slate-200 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900">{member.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{member.position}</p>
                  </div>
                  <XCircle className="text-gray-600" size={20} />
                </div>
                <div className="space-y-3 text-sm mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Email</p>
                    <p className="text-slate-900">{member.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Phone</p>
                    <p className="text-slate-900">{member.phone}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleToggleActive(member.id, member.isActive)}
                >
                  Reactivate
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
