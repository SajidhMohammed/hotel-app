'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { dataStore } from '@/lib/store'
import { Product, Bill as BillType } from '@/lib/models'
import { Plus, Trash2, Save } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function BillingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [bills, setBills] = useState<BillType[]>([])
  const [currentBill, setCurrentBill] = useState<Array<{
    id: string
    productId: string
    name: string
    quantity: number
    price: number
  }>>([])
  const [discount, setDiscount] = useState(0)
  const [taxPercentage, setTaxPercentage] = useState(5)
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash')

  useEffect(() => {
    setProducts(dataStore.getProducts())
    setBills(dataStore.getBills())
  }, [])

  const addProductToBill = (product: Product) => {
    const existingItem = currentBill.find(item => item.productId === product.id)
    if (existingItem) {
      setCurrentBill(currentBill.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCurrentBill([
        ...currentBill,
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

  const removeProductFromBill = (id: string) => {
    setCurrentBill(currentBill.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      setCurrentBill(currentBill.map(item =>
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const saveBill = () => {
    if (currentBill.length === 0) return

    const subtotal = currentBill.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountAmount = subtotal * (discount / 100)
    const taxableAmount = subtotal - discountAmount
    const tax = taxableAmount * (taxPercentage / 100)
    const total = taxableAmount + tax

    const bill: BillType = {
      id: Date.now().toString(),
      billNumber: `BILL-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      items: currentBill.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
      paymentStatus: 'Completed',
    }

    dataStore.addBill(bill)
    setBills([...bills, bill])
    setCurrentBill([])
    setDiscount(0)
  }

  const subtotal = currentBill.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * (discount / 100)
  const taxableAmount = subtotal - discountAmount
  const tax = taxableAmount * (taxPercentage / 100)
  const total = taxableAmount + tax

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Billing</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map(product => (
                <Card
                  key={product.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => addProductToBill(product)}
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
          </Card>

          {/* Recent Bills */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Bills</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bills.slice(-5).reverse().map(bill => (
                <div key={bill.id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-900">{bill.billNumber}</p>
                    <p className="text-sm text-slate-600">{bill.date} {bill.time}</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">${bill.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bill Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Bill</h3>

            {currentBill.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No items</p>
            ) : (
              <>
                <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                  {currentBill.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-8 h-7 border border-slate-200 rounded text-center text-xs"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProductFromBill(item.id)}
                          className="text-red-600 h-7 px-2"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-slate-600 mt-1">-${discountAmount.toFixed(2)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tax (%)</label>
                    <Input
                      type="number"
                      min="0"
                      value={taxPercentage}
                      onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-slate-600 mt-1">+${tax.toFixed(2)}</p>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                    <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={saveBill} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Save size={16} className="mr-2" />
                    Save & Print Bill
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
