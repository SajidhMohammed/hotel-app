'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { dataStore } from '@/lib/store'
import { Bill, KOT } from '@/lib/models'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'revenue' | 'sales' | 'stock'>('revenue')
  const [bills, setBills] = useState<Bill[]>([])
  const [kots, setKOTs] = useState<KOT[]>([])

  useEffect(() => {
    setBills(dataStore.getBills())
    setKOTs(dataStore.getKOTs())
  }, [])

  // Calculate revenue data
  const revenueByDay = bills.reduce((acc, bill) => {
    const existing = acc.find(item => item.date === bill.date)
    if (existing) {
      existing.revenue += bill.total
      existing.bills += 1
    } else {
      acc.push({ date: bill.date, revenue: bill.total, bills: 1 })
    }
    return acc
  }, [] as Array<{ date: string; revenue: number; bills: number }>)

  // Calculate payment method distribution
  const paymentMethods = bills.reduce((acc, bill) => {
    const existing = acc.find(item => item.name === bill.paymentMethod)
    if (existing) {
      existing.value += bill.total
    } else {
      acc.push({ name: bill.paymentMethod, value: bill.total })
    }
    return acc
  }, [] as Array<{ name: string; value: number }>)

  // Top selling items
  const topItems = bills.reduce((acc, bill) => {
    bill.items.forEach(item => {
      const existing = acc.find(i => i.name === item.name)
      if (existing) {
        existing.quantity += item.quantity
        existing.revenue += item.total
      } else {
        acc.push({
          name: item.name,
          quantity: item.quantity,
          revenue: item.total,
        })
      }
    })
    return acc
  }, [] as Array<{ name: string; quantity: number; revenue: number }>)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  // KOT performance
  const kotStats = {
    total: kots.length,
    served: kots.filter(k => k.status === 'Served').length,
    ready: kots.filter(k => k.status === 'Ready').length,
    inPrep: kots.filter(k => k.status === 'In Preparation').length,
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Reports & Analytics</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('revenue')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'revenue'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Revenue Analysis
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'sales'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Sales Performance
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'stock'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          KOT Performance
        </button>
      </div>

      {/* Revenue Analysis */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <p className="text-sm text-slate-600 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                ${bills.reduce((sum, b) => sum + b.total, 0).toFixed(2)}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-slate-600 font-medium">Total Bills</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{bills.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-slate-600 font-medium">Average Bill Value</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                ${bills.length > 0 ? (bills.reduce((sum, b) => sum + b.total, 0) / bills.length).toFixed(2) : '0.00'}
              </p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
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

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Method Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethods.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Sales Performance */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top 10 Selling Items</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topItems}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#64748b" />
                <YAxis stroke="#64748b" yAxisId="left" label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
                <YAxis stroke="#64748b" yAxisId="right" orientation="right" label={{ value: 'Revenue', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="quantity" fill="#3b82f6" name="Quantity Sold" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Sales Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="text-left py-2 font-semibold text-slate-900">Item Name</th>
                    <th className="text-right py-2 font-semibold text-slate-900">Quantity</th>
                    <th className="text-right py-2 font-semibold text-slate-900">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 text-slate-900">{item.name}</td>
                      <td className="text-right py-3 font-semibold text-slate-900">{item.quantity}</td>
                      <td className="text-right py-3 font-semibold text-slate-900">${item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* KOT Performance */}
      {activeTab === 'stock' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <p className="text-sm text-slate-600 font-medium">Total KOTs</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{kotStats.total}</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-green-500">
              <p className="text-sm text-slate-600 font-medium">Served</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{kotStats.served}</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-blue-500">
              <p className="text-sm text-slate-600 font-medium">Ready</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{kotStats.ready}</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-yellow-500">
              <p className="text-sm text-slate-600 font-medium">In Preparation</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{kotStats.inPrep}</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">KOT Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Served', value: kotStats.served },
                    { name: 'Ready', value: kotStats.ready },
                    { name: 'In Preparation', value: kotStats.inPrep },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  )
}
