'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { dataStore } from '@/lib/store'
import { Product, KOT as KOTType } from '@/lib/models'
import { Plus, Trash2, Send } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function KOTPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [kots, setKOTs] = useState<KOTType[]>([])
  const [orderType, setOrderType] = useState<'Counter Order' | 'Takeaway' | 'Delivery'>('Counter Order')
  const [currentOrder, setCurrentOrder] = useState<Array<{
    id: string
    productId: string
    name: string
    quantity: number
    price: number
  }>>([])
  const [waiterName, setWaiterName] = useState('John Doe')

  useEffect(() => {
    setProducts(dataStore.getProducts())
    setKOTs(dataStore.getKOTs())
  }, [])

  const addProductToOrder = (product: Product) => {
    const existingItem = currentOrder.find(item => item.productId === product.id)
    if (existingItem) {
      setCurrentOrder(currentOrder.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCurrentOrder([
        ...currentOrder,
        {
          id: Date.now().toString(),
          productId: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
        },
      ])
    }
  }

  const removeProductFromOrder = (id: string) => {
    setCurrentOrder(currentOrder.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      setCurrentOrder(currentOrder.map(item =>
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const sendToKitchen = () => {
    if (currentOrder.length === 0) return

    const kot: KOTType = {
      id: Date.now().toString(),
      kotNumber: `KOT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      items: currentOrder.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      waiter: waiterName,
      orderType,
      status: 'In Preparation',
      totalAmount: currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }

    dataStore.addKOT(kot)
    setKOTs([...kots, kot])
    setCurrentOrder([])
  }

  const totalAmount = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Kitchen Order Ticket (KOT)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Catalog */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Order Type</label>
                <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Counter Order">Counter Order</SelectItem>
                    <SelectItem value="Takeaway">Takeaway</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Waiter Name</label>
                <Input
                  value={waiterName}
                  onChange={(e) => setWaiterName(e.target.value)}
                  placeholder="Enter waiter name"
                />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(product => (
              <Card
                key={product.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => addProductToOrder(product)}
              >
                <p className="font-semibold text-slate-900">{product.name}</p>
                <p className="text-sm text-slate-600 mt-1">{product.category}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">${product.price.toFixed(2)}</p>
                <Button size="sm" className="w-full mt-3" variant="outline">
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Order */}
        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Order</h3>

            {currentOrder.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No items selected</p>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {currentOrder.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-10 h-8 border border-slate-200 rounded text-center text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProductFromOrder(item.id)}
                          className="text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={sendToKitchen}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Send size={16} className="mr-2" />
                    Send to Kitchen
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Active KOTs */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Active KOTs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kots.filter(k => k.status !== 'Served').map(kot => (
            <Card key={kot.id} className="p-4 border-l-4 border-l-orange-500">
              <p className="font-semibold text-slate-900">{kot.kotNumber}</p>
              <p className="text-sm text-slate-600">{kot.orderType}</p>
              <p className="text-sm text-slate-600">Waiter: {kot.waiter}</p>
              <p className="text-sm font-medium text-slate-900 mt-2">{kot.items.length} items</p>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  kot.status === 'In Preparation' ? 'bg-yellow-100 text-yellow-800' :
                  kot.status === 'Ready' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {kot.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
