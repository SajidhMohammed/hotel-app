'use client'

import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { UtensilsCrossed, Trash2, Plus, Clock } from 'lucide-react'

export default function KOTContent() {
  const [products, setProducts] = useState<any[]>([])
  const [kots, setKOTs] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [currentTotal, setCurrentTotal] = useState(0)
  const [waiterName, setWaiterName] = useState('John D.')

  useEffect(() => {
    setProducts(dataStore.getProducts())
    setKOTs(dataStore.getKOTs())
  }, [])

  const addItemToOrder = (product: any) => {
    const existingItem = selectedItems.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      selectedItems.push({ ...product, quantity: 1 })
    }
    setSelectedItems([...selectedItems])
    calculateTotal()
  }

  const removeItemFromOrder = (productId: string) => {
    const filtered = selectedItems.filter(item => item.id !== productId)
    setSelectedItems(filtered)
    calculateTotal()
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = selectedItems.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
      setSelectedItems([...selectedItems])
      calculateTotal()
    }
  }

  const calculateTotal = () => {
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setCurrentTotal(total)
  }

  const sendToKitchen = () => {
    if (selectedItems.length === 0) {
      alert('Please add items to the order')
      return
    }

    const newKOT = {
      id: Date.now().toString(),
      kotNumber: `KOT-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString(),
      items: selectedItems.map(item => ({
        id: `${item.id}-${Date.now()}`,
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      waiter: waiterName,
      status: 'In Preparation' as const,
      totalAmount: currentTotal,
    }

    dataStore.addKOT(newKOT)
    setKOTs([...kots, newKOT])
    setSelectedItems([])
    setCurrentTotal(0)
  }

  const updateKOTStatus = (kotId: string, newStatus: 'In Preparation' | 'Ready' | 'Served') => {
    dataStore.updateKOT(kotId, { status: newStatus })
    setKOTs(kots.map(kot => kot.id === kotId ? { ...kot, status: newStatus } : kot))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Preparation':
        return 'bg-yellow-100 text-yellow-800'
      case 'Ready':
        return 'bg-blue-100 text-blue-800'
      case 'Served':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Kitchen Order Ticket (KOT)</h2>
        <p className="text-slate-600 mt-2">Create and manage kitchen orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white border border-slate-200 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Items</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => addItemToOrder(product)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">${product.price}</p>
                      <Badge variant="secondary" className="text-xs">
                        {product.quantity} left
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Current Order */}
          <Card className="p-6 bg-white border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Order</h3>
            {selectedItems.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No items selected. Click on an item above to add it.</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">${item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItemFromOrder(item.id)}
                          className="text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">${currentTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={sendToKitchen}
                >
                  <UtensilsCrossed size={18} className="mr-2" />
                  Send to Kitchen
                </Button>
              </>
            )}
          </Card>
        </div>

        {/* Active KOTs */}
        <div>
          <Card className="p-6 bg-white border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Active KOTs</h3>
            {kots.length === 0 ? (
              <p className="text-slate-500 text-sm">No active orders</p>
            ) : (
              <div className="space-y-3">
                {kots.map(kot => (
                  <div key={kot.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-900">{kot.kotNumber}</p>
                        <p className="text-xs text-slate-600">{kot.waiter}</p>
                      </div>
                      <Badge className={getStatusColor(kot.status)} variant="secondary">
                        {kot.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 mb-3">
                      {kot.items.length} item{kot.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {kot.status !== 'Ready' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => updateKOTStatus(kot.id, 'Ready')}
                        >
                          Mark Ready
                        </Button>
                      )}
                      {kot.status !== 'Served' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => updateKOTStatus(kot.id, 'Served')}
                        >
                          Mark Served
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
