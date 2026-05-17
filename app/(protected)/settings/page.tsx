'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    restaurantName: 'My Restaurant',
    address: '123 Market Street',
    phone: '+1-555-0100',
    email: 'info@myrestaurant.com',
    gstin: '18AABCU9603R1Z5',
    taxPercentage: 5,
    currency: 'USD',
    timezone: 'UTC-5',
  })

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('restaurant_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const handleChange = (field: string, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setIsSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('restaurant_settings', JSON.stringify(settings))
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Settings</h2>

      {/* Success Message */}
      {isSaved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Settings saved successfully!
        </div>
      )}

      {/* Restaurant Information */}
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Restaurant Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Restaurant Name</label>
            <Input
              value={settings.restaurantName}
              onChange={(e) => handleChange('restaurantName', e.target.value)}
              placeholder="Enter restaurant name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <Input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">GSTIN/TAX ID</label>
            <Input
              value={settings.gstin}
              onChange={(e) => handleChange('gstin', e.target.value)}
              placeholder="Enter GSTIN or Tax ID"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
            <Input
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter restaurant address"
            />
          </div>
        </div>
      </Card>

      {/* Financial Settings */}
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Financial Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tax Percentage (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.taxPercentage}
              onChange={(e) => handleChange('taxPercentage', parseFloat(e.target.value))}
            />
            <p className="text-xs text-slate-600 mt-1">Applied to all bills</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
            <Input
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              placeholder="e.g., USD, EUR, GBP"
            />
          </div>
        </div>
      </Card>

      {/* Regional Settings */}
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Regional Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC-12">UTC-12:00</option>
              <option value="UTC-11">UTC-11:00</option>
              <option value="UTC-10">UTC-10:00</option>
              <option value="UTC-9">UTC-09:00</option>
              <option value="UTC-8">UTC-08:00</option>
              <option value="UTC-7">UTC-07:00</option>
              <option value="UTC-6">UTC-06:00</option>
              <option value="UTC-5">UTC-05:00</option>
              <option value="UTC-4">UTC-04:00</option>
              <option value="UTC-3">UTC-03:00</option>
              <option value="UTC-2">UTC-02:00</option>
              <option value="UTC-1">UTC-01:00</option>
              <option value="UTC">UTC+00:00</option>
              <option value="UTC+1">UTC+01:00</option>
              <option value="UTC+2">UTC+02:00</option>
              <option value="UTC+3">UTC+03:00</option>
              <option value="UTC+4">UTC+04:00</option>
              <option value="UTC+5">UTC+05:00</option>
              <option value="UTC+5:30">UTC+05:30</option>
              <option value="UTC+6">UTC+06:00</option>
              <option value="UTC+7">UTC+07:00</option>
              <option value="UTC+8">UTC+08:00</option>
              <option value="UTC+9">UTC+09:00</option>
              <option value="UTC+10">UTC+10:00</option>
              <option value="UTC+11">UTC+11:00</option>
              <option value="UTC+12">UTC+12:00</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save size={16} className="mr-2" />
          Save Settings
        </Button>
      </div>

      {/* System Information */}
      <Card className="p-6 mt-8 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">System Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Application:</span>
            <span className="font-semibold text-slate-900">RestaurantDesk v1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Database:</span>
            <span className="font-semibold text-slate-900">Browser Local Storage</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Last Updated:</span>
            <span className="font-semibold text-slate-900">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Environment:</span>
            <span className="font-semibold text-slate-900">Production</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
