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
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  CreditCard,
  AlertCircle,
  UtensilsCrossed,
} from 'lucide-react'

export default function DashboardContent() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    activeKOTs: 0,
    lowStockCount: 0,
    todayBills: 0,
    totalProducts: 0,
    totalStockItems: 0,
  })

  useEffect(() => {
    const updatedStats = dataStore.getDashboardStats()
    setStats(updatedStats)
  }, [])

  // Mock data for charts
  const revenueData = [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1450 },
    { day: 'Wed', revenue: 1100 },
    { day: 'Thu', revenue: 1800 },
    { day: 'Fri', revenue: 2100 },
    { day: 'Sat', revenue: 2450 },
    { day: 'Sun', revenue: 1900 },
  ]

  const topSellingData = [
    { name: 'Butter Chicken', value: 42, color: '#3b82f6' },
    { name: 'Margherita Pizza', value: 38, color: '#10b981' },
    { name: 'Fresh Lime Soda', value: 25, color: '#f59e0b' },
    { name: 'Garden Salad', value: 18, color: '#8b5cf6' },
  ]

  const kotStatusData = [
    { day: 'Mon', prepared: 12, ready: 3, served: 15 },
    { day: 'Tue', prepared: 14, ready: 2, served: 18 },
    { day: 'Wed', prepared: 10, ready: 4, served: 12 },
    { day: 'Thu', prepared: 16, ready: 3, served: 20 },
    { day: 'Fri', prepared: 18, ready: 5, served: 25 },
    { day: 'Sat', prepared: 20, ready: 4, served: 28 },
    { day: 'Sun', prepared: 15, ready: 3, served: 22 },
  ]

  const StatCard = ({ icon: Icon, label, value, subtext }: any) => (
    <Card className="p-6 bg-white border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="text-blue-600" size={24} />
        </div>
      </div>
    </Card>
  )

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600 mt-2">Welcome to your restaurant management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={CreditCard}
          label="Today's Revenue"
          value={`$${stats.todayRevenue.toLocaleString()}`}
          subtext="Total sales"
        />
        <StatCard
          icon={UtensilsCrossed}
          label="Active KOTs"
          value={stats.activeKOTs}
          subtext="Orders in progress"
        />
        <StatCard
          icon={AlertCircle}
          label="Low Stock Alerts"
          value={stats.lowStockCount}
          subtext="Items below threshold"
        />
        <StatCard
          icon={ShoppingCart}
          label="Today's Bills"
          value={stats.todayBills}
          subtext="Transactions completed"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Revenue Chart */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
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

        {/* KOT Status Chart */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly KOT Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kotStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="prepared" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ready" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="served" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Selling Items Pie Chart */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Selling Items</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topSellingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topSellingData.map((entry, index) => (
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

        {/* Quick Actions */}
        <Card className="p-6 bg-white border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <ShoppingCart size={18} className="mr-2" />
              New Order (KOT)
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard size={18} className="mr-2" />
              Process Bill
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Package size={18} className="mr-2" />
              Check Stock
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertCircle size={18} className="mr-2" />
              View Alerts
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
