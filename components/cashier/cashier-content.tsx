'use client'

import { useState, useEffect } from 'react'
import { dataStore, Transaction } from '@/lib/data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'

export default function CashierContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    guestName: '',
    amount: '',
    type: 'payment' as const,
    method: 'cash' as const,
    description: '',
  })

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = () => {
    setTransactions(dataStore.getTransactions().reverse())
  }

  const handleAddTransaction = () => {
    if (formData.guestName && formData.amount && formData.description) {
      const now = new Date()
      const newTransaction: Transaction = {
        id: `trans_${Date.now()}`,
        guestName: formData.guestName,
        amount: parseFloat(formData.amount),
        type: formData.type,
        method: formData.method,
        description: formData.description,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      }
      dataStore.addTransaction(newTransaction)
      loadTransactions()
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      guestName: '',
      amount: '',
      type: 'payment',
      method: 'cash',
      description: '',
    })
    setIsDialogOpen(false)
  }

  const totalPayments = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalRefunds = transactions
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const netBalance = totalPayments - totalRefunds - totalExpenses

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Cashier</h2>
          <p className="text-slate-600 mt-2">Manage payments and transactions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={20} />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record Transaction</DialogTitle>
              <DialogDescription>
                Enter transaction details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="guestName">Guest/Description</Label>
                <Input
                  id="guestName"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="Guest name or vendor"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select value={formData.method} onValueChange={(value: any) => setFormData({ ...formData, method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Room service, cleaning, etc."
                />
              </div>
              <Button onClick={handleAddTransaction} className="w-full">
                Record Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-green-50 border border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Payments</p>
              <p className="text-2xl font-bold text-green-600 mt-2">${totalPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </Card>

        <Card className="p-6 bg-red-50 border border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Refunds</p>
              <p className="text-2xl font-bold text-red-600 mt-2">-${totalRefunds.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </Card>

        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Expenses</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">-${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <TrendingDown className="text-yellow-600" size={24} />
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Net Balance</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <TrendingUp className="text-blue-600" size={24} />
          </div>
        </Card>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No transactions yet. Click "New Transaction" to record one.</p>
        </Card>
      ) : (
        <Card className="bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900">Guest/Description</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900">Method</th>
                  <th className="px-6 py-3 text-right font-semibold text-slate-900">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900">{transaction.guestName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.type === 'payment' ? 'bg-green-100 text-green-800' :
                        transaction.type === 'refund' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{transaction.method}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {transaction.type === 'payment' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{transaction.date} {transaction.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
