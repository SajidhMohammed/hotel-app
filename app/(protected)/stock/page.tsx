'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { dataStore } from '@/lib/store'
import { StockItem } from '@/lib/models'
import { Plus, Edit2, Trash2, AlertTriangle, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type StockCategory = 'Grocery' | 'Vegetable' | 'Dairy' | 'Beverage' | 'Condiment'

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grocery' as StockCategory,
    currentQuantity: 0,
    minimumQuantity: 0,
    reorderQuantity: 0,
    unit: 'kg',
    cost: 0,
    supplier: '',
  })

  useEffect(() => {
    setStock(dataStore.getStock())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      dataStore.updateStockItem(editingId, formData)
      setStock(dataStore.getStock())
      setEditingId(null)
    } else {
      const newItem: StockItem = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        currentQuantity: formData.currentQuantity,
        minimumQuantity: formData.minimumQuantity,
        reorderQuantity: formData.reorderQuantity,
        unit: formData.unit,
        cost: formData.cost,
        supplier: formData.supplier,
        lastRestockDate: new Date().toISOString().split('T')[0],
      }
      dataStore.addStockItem(newItem)
      setStock(dataStore.getStock())
    }

    setFormData({
      name: '',
      category: 'Grocery',
      currentQuantity: 0,
      minimumQuantity: 0,
      reorderQuantity: 0,
      unit: 'kg',
      cost: 0,
      supplier: '',
    })
    setShowForm(false)
  }

  const handleEdit = (item: StockItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      currentQuantity: item.currentQuantity,
      minimumQuantity: item.minimumQuantity,
      reorderQuantity: item.reorderQuantity,
      unit: item.unit,
      cost: item.cost,
      supplier: item.supplier || '',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    const items = dataStore.getStock()
    dataStore.saveStock(items.filter(s => s.id !== id))
    setStock(dataStore.getStock())
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      category: 'Grocery',
      currentQuantity: 0,
      minimumQuantity: 0,
      reorderQuantity: 0,
      unit: 'kg',
      cost: 0,
      supplier: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const lowStockItems = stock.filter(s => s.currentQuantity <= s.minimumQuantity)
  const totalValue = stock.reduce((sum, item) => sum + item.currentQuantity * item.cost, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Stock Management</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Add Stock Item
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-slate-600 font-medium">Total Stock Items</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stock.length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-slate-600 font-medium">Total Stock Value</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">${totalValue.toFixed(2)}</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{lowStockItems.length}</p>
            </div>
            {lowStockItems.length > 0 && (
              <AlertTriangle size={24} className="text-red-600" />
            )}
          </div>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {editingId ? 'Edit Stock Item' : 'New Stock Item'}
            </h3>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value: StockCategory) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grocery">Grocery</SelectItem>
                    <SelectItem value="Vegetable">Vegetable</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Beverage">Beverage</SelectItem>
                    <SelectItem value="Condiment">Condiment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Quantity</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.currentQuantity}
                  onChange={(e) => setFormData({ ...formData, currentQuantity: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Quantity</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minimumQuantity}
                  onChange={(e) => setFormData({ ...formData, minimumQuantity: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reorder Quantity</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.reorderQuantity}
                  onChange={(e) => setFormData({ ...formData, reorderQuantity: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="kg, L, pcs, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cost per Unit</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Supplier name"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Item
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Stock Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stock.map(item => (
          <Card
            key={item.id}
            className={`p-6 border-l-4 ${
              item.currentQuantity <= item.minimumQuantity ? 'border-l-red-500' : 'border-l-green-500'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-600">{item.category}</p>
              </div>
              {item.currentQuantity <= item.minimumQuantity && (
                <AlertTriangle size={20} className="text-red-600" />
              )}
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Current:</span>
                <span className="font-semibold text-slate-900">{item.currentQuantity} {item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Minimum:</span>
                <span className="font-semibold text-slate-900">{item.minimumQuantity} {item.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Cost/Unit:</span>
                <span className="font-semibold text-slate-900">${item.cost.toFixed(2)}</span>
              </div>
              {item.supplier && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Supplier:</span>
                  <span className="font-semibold text-slate-900">{item.supplier}</span>
                </div>
              )}
            </div>

            <p className="text-lg font-bold text-blue-600 mb-4">
              Total: ${(item.currentQuantity * item.cost).toFixed(2)}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(item)}
                className="flex-1"
              >
                <Edit2 size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(item.id)}
                className="flex-1 text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {stock.length === 0 && !showForm && (
        <Card className="p-12 text-center">
          <p className="text-slate-600 mb-4">No stock items found</p>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Create First Stock Item
          </Button>
        </Card>
      )}
    </div>
  )
}
