'use client'

import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Trash2, Plus, Edit2, Search } from 'lucide-react'

export default function ProductsContent() {
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Main' as const,
    price: '',
    quantity: '',
    unit: 'pcs',
  })
  const [showForm, setShowForm] = useState(false)

  const categories = ['Main', 'Beverage', 'Dessert', 'Starter']

  useEffect(() => {
    setProducts(dataStore.getProducts())
  }, [])

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
      alert('Please fill all fields')
      return
    }

    const product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      quantity: parseFloat(newProduct.quantity),
      unit: newProduct.unit,
    }

    dataStore.addProduct(product)
    setProducts(dataStore.getProducts())
    setNewProduct({ name: '', category: 'Main', price: '', quantity: '', unit: 'pcs' })
    setShowForm(false)
  }

  const deleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dataStore.removeProduct(productId)
      setProducts(dataStore.getProducts())
    }
  }

  const updateProductQuantity = (productId: string, newQuantity: number) => {
    dataStore.updateProduct(productId, { quantity: Math.max(0, newQuantity) })
    setProducts(dataStore.getProducts())
  }

  const getStatusColor = (quantity: number) => {
    if (quantity === 0) return 'bg-red-100 text-red-800'
    if (quantity <= 20) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= 20) return 'Low Stock'
    return 'In Stock'
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Product Management</h2>
        <p className="text-slate-600 mt-2">Manage your menu items and products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Filters */}
        <div>
          <Card className="p-4 bg-white border border-slate-200 sticky top-4">
            <h3 className="font-semibold text-slate-900 mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-600 mb-2">Search</p>
              <Input
                placeholder="Product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-600 mb-2">Category</p>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
          </Card>
        </div>

        {/* Products List */}
        <div className="lg:col-span-3">
          {showForm && (
            <Card className="p-6 bg-white border border-slate-200 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Product</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Product Name</label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g., Butter Chicken"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
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
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      placeholder="pcs, kg, L"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Price ($)</label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Quantity</label>
                    <Input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600" onClick={addProduct}>
                    Save Product
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

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card className="p-12 bg-white border border-slate-200 text-center">
              <ShoppingCart size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No products found</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="p-4 bg-white border border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{product.name}</h4>
                      <p className="text-sm text-slate-600">{product.category}</p>
                    </div>
                    <Badge className={getStatusColor(product.quantity)} variant="secondary">
                      {getStatusText(product.quantity)}
                    </Badge>
                  </div>

                  <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-slate-600">
                      {product.quantity} {product.unit} available
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateProductQuantity(product.id, product.quantity - 1)
                        }
                        className="flex-1"
                      >
                        −
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateProductQuantity(product.id, product.quantity + 1)
                        }
                        className="flex-1"
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-600"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
