'use client'

import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, Trash2, TrendingDown, AlertTriangle } from 'lucide-react'

export default function StockContent() {
  const [stockItems, setStockItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Grocery' as const,
    currentQuantity: '',
    minimumQuantity: '',
    unit: 'kg',
    supplier: '',
    cost: '',
  })

  const categories = ['Grocery', 'Vegetable', 'Dairy', 'Beverage']

  useEffect(() => {
    setStockItems(dataStore.getStock())
  }, [])

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addStockItem = () => {
    if (!newItem.name || !newItem.currentQuantity || !newItem.minimumQuantity || !newItem.supplier) {
      alert('Please fill all required fields')
      return
    }

    const item = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      currentQuantity: parseFloat(newItem.currentQuantity),
      minimumQuantity: parseFloat(newItem.minimumQuantity),
      unit: newItem.unit,
      supplier: newItem.supplier,
      lastRestockDate: new Date().toISOString().split('T')[0],
      cost: parseFloat(newItem.cost) || 0,
    }

    dataStore.addStockItem(item)
    setStockItems(dataStore.getStock())
    setNewItem({ name: '', category: 'Grocery', currentQuantity: '', minimumQuantity: '', unit: 'kg', supplier: '', cost: '' })
    setShowForm(false)
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    dataStore.updateStockItem(itemId, { currentQuantity: Math.max(0, newQuantity) })
    setStockItems(dataStore.getStock())
  }

  const updateMinimum = (itemId: string, newMinimum: number) => {
    dataStore.updateStockItem(itemId, { minimumQuantity: Math.max(0, newMinimum) })
    setStockItems(dataStore.getStock())
  }

  const deleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this stock item?')) {
      const items = stockItems.filter(item => item.id !== itemId)
      dataStore.saveStock(items)
      setStockItems(items)
    }
  }

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= 0) return { color: 'bg-red-100 text-red-800', text: 'Out of Stock', icon: 'alert' }
    if (current <= minimum) return { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock', icon: 'warning' }
    return { color: 'bg-green-100 text-green-800', text: 'In Stock', icon: 'ok' }
  }

  const lowStockItems = stockItems.filter(item => item.currentQuantity <= item.minimumQuantity)
  const totalValue = stockItems.reduce((sum, item) => sum + (item.currentQuantity * item.cost), 0)

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Stock Management</h2>
        <p className="text-slate-600 mt-2">Track inventory and grocery items</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Total Items</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stockItems.length}</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{lowStockItems.length}</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Total Stock Value</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">${totalValue.toFixed(2)}</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Restock Required</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {lowStockItems.filter(item => item.currentQuantity === 0).length}
          </p>
        </Card>
      </div>

      {/* Critical Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="p-6 bg-red-50 border border-red-200 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Critical Stock Alerts</h3>
              <div className="space-y-1">
                {lowStockItems.map(item => (
                  <p key={item.id} className="text-sm text-red-800">
                    {item.name}: {item.currentQuantity}/{item.minimumQuantity} {item.unit}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div>
          <Card className="p-4 bg-white border border-slate-200 sticky top-4">
            <div className="mb-4">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={16} className="mr-2" />
              Add Stock Item
            </Button>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {showForm && (
            <Card className="p-6 bg-white border border-slate-200 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Stock Item</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Item Name</label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., Tomato Sauce"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Unit</label>
                    <Input
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      placeholder="kg, L, pcs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Current Quantity</label>
                    <Input
                      type="number"
                      value={newItem.currentQuantity}
                      onChange={(e) => setNewItem({ ...newItem, currentQuantity: e.target.value })}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Minimum Quantity</label>
                    <Input
                      type="number"
                      value={newItem.minimumQuantity}
                      onChange={(e) => setNewItem({ ...newItem, minimumQuantity: e.target.value })}
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Supplier</label>
                    <Input
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                      placeholder="Supplier name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Cost per Unit</label>
                    <Input
                      type="number"
                      value={newItem.cost}
                      onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600" onClick={addStockItem}>
                    Save Item
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Stock Items Table */}
          {filteredItems.length === 0 ? (
            <Card className="p-12 bg-white border border-slate-200 text-center">
              <Package size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No stock items found</p>
            </Card>
          ) : (
            <Card className="overflow-x-auto border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Item Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Current Stock</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Minimum</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Supplier</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => {
                    const status = getStockStatus(item.currentQuantity, item.minimumQuantity)
                    return (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.currentQuantity - 0.5)}
                            >
                              −
                            </Button>
                            <span className="w-16 text-center font-medium">
                              {item.currentQuantity} {item.unit}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.currentQuantity + 0.5)}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-slate-600">
                          {item.minimumQuantity} {item.unit}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.supplier}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge className={status.color} variant="secondary">
                            {status.text}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteItem(item.id)}
                            className="text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
