'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { dataStore } from '@/lib/store'
import { Product } from '@/lib/models'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ProductCategory = 'Main Course' | 'Beverage' | 'Dessert' | 'Starter' | 'Side Dish'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course' as ProductCategory,
    price: 0,
    description: '',
  })

  useEffect(() => {
    setProducts(dataStore.getProducts())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      dataStore.updateProduct(editingId, {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        description: formData.description,
      })
      setProducts(dataStore.getProducts())
      setEditingId(null)
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: formData.price,
        description: formData.description,
        isActive: true,
      }
      dataStore.addProduct(newProduct)
      setProducts(dataStore.getProducts())
    }

    setFormData({ name: '', category: 'Main Course', price: 0, description: '' })
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description || '',
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    dataStore.deleteProduct(id)
    setProducts(dataStore.getProducts())
  }

  const handleCancel = () => {
    setFormData({ name: '', category: 'Main Course', price: 0, description: '' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Products</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {editingId ? 'Edit Product' : 'New Product'}
            </h3>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ProductCategory) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Course">Main Course</SelectItem>
                    <SelectItem value="Beverage">Beverage</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                    <SelectItem value="Starter">Starter</SelectItem>
                    <SelectItem value="Side Dish">Side Dish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Product
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                <p className="text-sm text-slate-600">{product.category}</p>
              </div>
              {product.isActive ? (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">Active</span>
              ) : (
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded">Inactive</span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-slate-600 mb-4">{product.description}</p>
            )}

            <p className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(product)}
                className="flex-1"
              >
                <Edit2 size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(product.id)}
                className="flex-1 text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && !showForm && (
        <Card className="p-12 text-center">
          <p className="text-slate-600 mb-4">No products found</p>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Create First Product
          </Button>
        </Card>
      )}
    </div>
  )
}
