'use client'

import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Download, FileText } from 'lucide-react'

export default function ReportsContent() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    currentGuests: 0,
    totalRevenue: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
  })

  useEffect(() => {
    const updatedStats = dataStore.getDashboardStats()
    setStats(updatedStats)
  }, [])

  const occupancyRate = stats.totalRooms > 0 ? (stats.occupiedRooms / stats.totalRooms * 100).toFixed(1) : 0
  
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15200 },
    { month: 'Mar', revenue: 13800 },
    { month: 'Apr', revenue: 18500 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 19800 },
  ]

  const roomTypeData = [
    { name: 'Single', value: 2, color: '#3b82f6' },
    { name: 'Double', value: 3, color: '#8b5cf6' },
    { name: 'Suite', value: 2, color: '#ec4899' },
    { name: 'Deluxe', value: 1, color: '#f59e0b' },
  ]

  const guestSourceData = [
    { source: 'Direct Booking', guests: 25 },
    { source: 'Online Platforms', guests: 38 },
    { source: 'Travel Agencies', guests: 18 },
    { source: 'Referrals', guests: 12 },
  ]

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Reports</h2>
          <p className="text-slate-600 mt-2">Business analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={20} />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText size={20} />
            PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Occupancy Rate</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{occupancyRate}%</p>
          <p className="text-xs text-slate-500 mt-1">{stats.occupiedRooms} of {stats.totalRooms} rooms</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Avg. Daily Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">${(stats.totalRevenue / 30).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Current Guests</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.currentGuests}</p>
          <p className="text-xs text-slate-500 mt-1">Checked in</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">This month</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Guest Source */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Guest Source Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={guestSourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="source" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="guests" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Room Type Distribution */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Room Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roomTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {roomTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Summary Table */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Revenue per Room</span>
              <span className="font-semibold text-slate-900">${(stats.totalRevenue / Math.max(1, stats.totalRooms)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Check-ins Today</span>
              <span className="font-semibold text-slate-900">{stats.todayCheckIns}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Check-outs Today</span>
              <span className="font-semibold text-slate-900">{stats.todayCheckOuts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Avg. Revenue per Guest</span>
              <span className="font-semibold text-slate-900">${(stats.totalRevenue / Math.max(1, stats.currentGuests)).toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
