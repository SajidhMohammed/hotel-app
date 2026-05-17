'use client'

import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Plus, Trash2, Search, Eye, Printer } from 'lucide-react'

export default function BillingContent() {
  const [bills, setBills] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [billItems, setBillItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(5)
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card'>('Cash')
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setBills(dataStore.getBills())
    setProducts(dataStore.getProducts())
  }, [])

  useEffect(() => {
    const itemTotal = billItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const discountAmount = (itemTotal * discount) / 100
    const beforeTax = itemTotal - discountAmount
    const taxAmount = (beforeTax * taxRate) / 100
    const finalTotal = beforeTax + taxAmount

    setSubtotal(itemTotal)
    setTax(taxAmount)
    setTotal(finalTotal)
  }, [billItems, discount, taxRate])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addProductToBill = (product: any) => {
    const existing = billItems.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += 1
      existing.total = existing.quantity * existing.price
    } else {
      billItems.push({
        ...product,
        quantity: 1,
        total: product.price,
      })
    }
    setBillItems([...billItems])
    setSearchQuery('')
  }

  const removeItem = (productId: string) => {
    const filtered = billItems.filter(item => item.id !== productId)
    setBillItems(filtered)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = billItems.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
      item.total = item.quantity * item.price
      setBillItems([...billItems])
    }
  }

  const createBill = () => {
    if (billItems.length === 0) {
      alert('Add items to create a bill')
      return
    }

    const newBill = {
      id: Date.now().toString(),
      billNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      items: billItems,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      paymentStatus: 'Completed' as const,
    }

    dataStore.addBill(newBill)
    setBills([...bills, newBill])
    setBillItems([])
    setDiscount(0)
    setSearchQuery('')
  }

  const getPaymentStatus = (status: string) => {
    return status === 'Completed'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Billing System</h2>
        <p className="text-slate-600 mt-2">Create and manage customer bills</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bill Creation */}
        <div className="lg:col-span-2">
          {/* Search Products */}
          <Card className="p-6 bg-white border border-slate-200 mb-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search items... (Cmd + K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchQuery && (
              <div className="mt-4 space-y-2">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                    onClick={() => addProductToBill(product)}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-600">{product.category}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Bill Items */}
          <Card className="p-6 bg-white border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Bill Items</h3>
            {billItems.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Search and add items above</p>
            ) : (
              <>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3">Item</th>
                        <th className="text-right py-2 px-3">Price</th>
                        <th className="text-center py-2 px-3">Qty</th>
                        <th className="text-right py-2 px-3">Total</th>
                        <th className="text-center py-2 px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billItems.map(item => (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-3 font-medium text-slate-900">{item.name}</td>
                          <td className="py-3 px-3 text-right">${item.price.toFixed(2)}</td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                −
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-medium">${item.total.toFixed(2)}</td>
                          <td className="py-3 px-3 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculations */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount (%):</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                        className="w-20"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-slate-600">
                        -${((subtotal * discount) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax ({taxRate}%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Bill Summary & Actions */}
        <div>
          <Card className="p-6 bg-white border border-slate-200 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Payment Method</p>
                <div className="flex gap-2">
                  <Button
                    variant={paymentMethod === 'Cash' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setPaymentMethod('Cash')}
                  >
                    Cash
                  </Button>
                  <Button
                    variant={paymentMethod === 'Card' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setPaymentMethod('Card')}
                  >
                    Card
                  </Button>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={createBill}
                disabled={billItems.length === 0}
              >
                <CreditCard size={18} className="mr-2" />
                Create Bill
              </Button>
            </div>
          </Card>

          {/* Recent Bills */}
          <Card className="p-6 bg-white border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Bills</h3>
            {bills.length === 0 ? (
              <p className="text-slate-500 text-sm">No bills yet</p>
            ) : (
              <div className="space-y-3">
                {bills.slice(-5).reverse().map(bill => (
                  <div key={bill.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-900">{bill.billNumber}</p>
                        <p className="text-xs text-slate-600">{bill.date}</p>
                      </div>
                      <Badge
                        className={getPaymentStatus(bill.paymentStatus)}
                        variant="secondary"
                      >
                        {bill.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-blue-600 mb-2">
                      ${bill.total.toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye size={14} />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Printer size={14} />
                      </Button>
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
