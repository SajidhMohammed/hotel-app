// Restaurant Management Data Models

export interface Product {
  id: string
  name: string
  category: 'Main Course' | 'Beverage' | 'Dessert' | 'Starter' | 'Side Dish'
  price: number
  description?: string
  isActive: boolean
}

export interface StockItem {
  id: string
  name: string
  category: 'Grocery' | 'Vegetable' | 'Dairy' | 'Beverage' | 'Condiment'
  currentQuantity: number
  minimumQuantity: number
  reorderQuantity: number
  unit: string
  cost: number
  supplier?: string
  lastRestockDate: string
  expiryDate?: string
}

export interface StockMovement {
  id: string
  stockItemId: string
  type: 'In' | 'Out' | 'Adjustment'
  quantity: number
  reason: string
  date: string
  reference?: string
}

export interface KOTItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  specialInstructions?: string
}

export interface KOT {
  id: string
  kotNumber: string
  timestamp: string
  items: KOTItem[]
  waiter: string
  orderType: 'Counter Order' | 'Takeaway' | 'Delivery'
  status: 'In Preparation' | 'Ready' | 'Served'
  totalAmount: number
  notes?: string
}

export interface BillItem {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
  total: number
}

export interface Bill {
  id: string
  billNumber: string
  date: string
  time: string
  items: BillItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: 'Cash' | 'Card' | 'UPI'
  paymentStatus: 'Pending' | 'Completed' | 'Failed'
  kotId?: string
  notes?: string
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  pincode: string
  paymentTerms: string
  isActive: boolean
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  supplierName: string
  items: Array<{
    stockItemId: string
    name: string
    quantity: number
    cost: number
    total: number
  }>
  orderDate: string
  expectedDeliveryDate: string
  status: 'Draft' | 'Submitted' | 'Confirmed' | 'Received' | 'Cancelled'
  totalAmount: number
  notes?: string
}

export interface GoodsReceiptNote {
  id: string
  grnNumber: string
  poId: string
  supplierId: string
  supplierName: string
  items: Array<{
    stockItemId: string
    name: string
    poQuantity: number
    receivedQuantity: number
    unit: string
    cost: number
  }>
  receiptDate: string
  inspectionStatus: 'Pass' | 'Partial' | 'Reject'
  notes?: string
}

export interface StockTransfer {
  id: string
  transferNumber: string
  fromLocation: string
  toLocation: string
  items: Array<{
    stockItemId: string
    name: string
    quantity: number
    unit: string
  }>
  transferDate: string
  status: 'Pending' | 'In Transit' | 'Received'
  notes?: string
}

export interface UserInfo {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'manager' | 'cashier' | 'waiter' | 'store_keeper'
  phone?: string
  joinDate: string
  isActive: boolean
  lastLogin?: string
}

export interface RestaurantSettings {
  restaurantName: string
  address: string
  phone: string
  email: string
  gstin: string
  taxPercentage: number
  currency: string
  timezone: string
}

export interface DashboardStats {
  todayRevenue: number
  todayBills: number
  activeKOTs: number
  lowStockItems: number
  totalProducts: number
  pendingPOs: number
}
