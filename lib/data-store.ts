// Restaurant Management Data Store
// Using localStorage for persistence without external integrations

export interface Product {
  id: string
  name: string
  category: 'Main' | 'Beverage' | 'Dessert' | 'Starter'
  price: number
  quantity: number
  unit: string
  image?: string
}

export interface StockItem {
  id: string
  name: string
  category: 'Grocery' | 'Vegetable' | 'Dairy' | 'Beverage'
  currentQuantity: number
  minimumQuantity: number
  unit: string
  supplier: string
  lastRestockDate: string
  cost: number
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
  status: 'In Preparation' | 'Ready' | 'Served'
  totalAmount: number
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
  items: BillItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: 'Cash' | 'Card'
  paymentStatus: 'Pending' | 'Completed'
  kotId?: string
}

export interface StaffMember {
  id: string
  name: string
  role: 'Waiter' | 'Kitchen' | 'Manager' | 'Cashier'
  phone: string
  email: string
  shift: 'morning' | 'afternoon' | 'night'
  joinDate: string
  isActive: boolean
}

const STORAGE_KEYS = {
  PRODUCTS: 'restaurant_products',
  STOCK: 'restaurant_stock',
  KOTS: 'restaurant_kots',
  BILLS: 'restaurant_bills',
  STAFF: 'restaurant_staff',
}

// Default products
const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Butter Chicken', category: 'Main', price: 12.50, quantity: 50, unit: 'pcs' },
  { id: 'p2', name: 'Margherita Pizza', category: 'Main', price: 15.00, quantity: 30, unit: 'pcs' },
  { id: 'p3', name: 'Garden Salad', category: 'Starter', price: 8.00, quantity: 60, unit: 'pcs' },
  { id: 'p4', name: 'Iced Latte', category: 'Beverage', price: 8.50, quantity: 100, unit: 'pcs' },
  { id: 'p5', name: 'Red Velvet Cake', category: 'Dessert', price: 6.50, quantity: 25, unit: 'pcs' },
  { id: 'p6', name: 'Classic Burger', category: 'Main', price: 16.00, quantity: 40, unit: 'pcs' },
  { id: 'p7', name: 'Fresh Lime Soda', category: 'Beverage', price: 5.00, quantity: 80, unit: 'pcs' },
  { id: 'p8', name: 'Paneer Tikka', category: 'Starter', price: 18.50, quantity: 35, unit: 'pcs' },
]

// Default stock items
const DEFAULT_STOCK: StockItem[] = [
  { id: 's1', name: 'Tomato Sauce', category: 'Grocery', currentQuantity: 2, minimumQuantity: 10, unit: 'kg', supplier: 'Fresh Foods Inc', lastRestockDate: '2024-01-10', cost: 5.00 },
  { id: 's2', name: 'Milk (Whole)', category: 'Dairy', currentQuantity: 5, minimumQuantity: 20, unit: 'L', supplier: 'Dairy Co', lastRestockDate: '2024-01-08', cost: 2.50 },
  { id: 's3', name: 'Cheddar Cheese', category: 'Dairy', currentQuantity: 1.5, minimumQuantity: 5, unit: 'kg', supplier: 'Cheese World', lastRestockDate: '2024-01-05', cost: 18.00 },
  { id: 's4', name: 'Chicken Breast', category: 'Grocery', currentQuantity: 15, minimumQuantity: 30, unit: 'kg', supplier: 'Meat Palace', lastRestockDate: '2024-01-11', cost: 8.00 },
  { id: 's5', name: 'Basmati Rice', category: 'Grocery', currentQuantity: 50, minimumQuantity: 100, unit: 'kg', supplier: 'Rice Traders', lastRestockDate: '2024-01-09', cost: 3.00 },
]

// Default staff
const DEFAULT_STAFF: StaffMember[] = [
  { id: 's1', name: 'John Davis', role: 'Manager', phone: '+1-555-0101', email: 'john@restaurant.com', shift: 'morning', joinDate: '2022-01-15', isActive: true },
  { id: 's2', name: 'Sarah Johnson', role: 'Waiter', phone: '+1-555-0102', email: 'sarah@restaurant.com', shift: 'afternoon', joinDate: '2023-03-20', isActive: true },
  { id: 's3', name: 'Mike Chen', role: 'Kitchen', phone: '+1-555-0103', email: 'mike@restaurant.com', shift: 'morning', joinDate: '2023-06-10', isActive: true },
  { id: 's4', name: 'Emma Wilson', role: 'Cashier', phone: '+1-555-0104', email: 'emma@restaurant.com', shift: 'afternoon', joinDate: '2023-08-05', isActive: true },
]

export const dataStore = {
  // Products
  getProducts(): Product[] {
    if (typeof window === 'undefined') return DEFAULT_PRODUCTS
    const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    return products ? JSON.parse(products) : DEFAULT_PRODUCTS
  },

  saveProducts(products: Product[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  },

  addProduct(product: Product) {
    const products = this.getProducts()
    products.push(product)
    this.saveProducts(products)
    return product
  },

  updateProduct(id: string, updates: Partial<Product>) {
    const products = this.getProducts()
    const product = products.find(p => p.id === id)
    if (product) {
      Object.assign(product, updates)
      this.saveProducts(products)
    }
    return product
  },

  removeProduct(id: string) {
    const products = this.getProducts()
    const filtered = products.filter(p => p.id !== id)
    this.saveProducts(filtered)
  },

  // Stock Items
  getStock(): StockItem[] {
    if (typeof window === 'undefined') return DEFAULT_STOCK
    const stock = localStorage.getItem(STORAGE_KEYS.STOCK)
    return stock ? JSON.parse(stock) : DEFAULT_STOCK
  },

  saveStock(stock: StockItem[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock))
  },

  addStockItem(item: StockItem) {
    const stock = this.getStock()
    stock.push(item)
    this.saveStock(stock)
    return item
  },

  updateStockItem(id: string, updates: Partial<StockItem>) {
    const stock = this.getStock()
    const item = stock.find(s => s.id === id)
    if (item) {
      Object.assign(item, updates)
      this.saveStock(stock)
    }
    return item
  },

  // KOTs
  getKOTs(): KOT[] {
    if (typeof window === 'undefined') return []
    const kots = localStorage.getItem(STORAGE_KEYS.KOTS)
    return kots ? JSON.parse(kots) : []
  },

  saveKOTs(kots: KOT[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.KOTS, JSON.stringify(kots))
  },

  addKOT(kot: KOT) {
    const kots = this.getKOTs()
    kots.push(kot)
    this.saveKOTs(kots)
    return kot
  },

  updateKOT(id: string, updates: Partial<KOT>) {
    const kots = this.getKOTs()
    const kot = kots.find(k => k.id === id)
    if (kot) {
      Object.assign(kot, updates)
      this.saveKOTs(kots)
    }
    return kot
  },

  // Bills
  getBills(): Bill[] {
    if (typeof window === 'undefined') return []
    const bills = localStorage.getItem(STORAGE_KEYS.BILLS)
    return bills ? JSON.parse(bills) : []
  },

  saveBills(bills: Bill[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills))
  },

  addBill(bill: Bill) {
    const bills = this.getBills()
    bills.push(bill)
    this.saveBills(bills)
    return bill
  },

  updateBill(id: string, updates: Partial<Bill>) {
    const bills = this.getBills()
    const bill = bills.find(b => b.id === id)
    if (bill) {
      Object.assign(bill, updates)
      this.saveBills(bills)
    }
    return bill
  },

  // Staff
  getStaff(): StaffMember[] {
    if (typeof window === 'undefined') return DEFAULT_STAFF
    const staff = localStorage.getItem(STORAGE_KEYS.STAFF)
    return staff ? JSON.parse(staff) : DEFAULT_STAFF
  },

  saveStaff(staff: StaffMember[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff))
  },

  addStaff(member: StaffMember) {
    const staff = this.getStaff()
    staff.push(member)
    this.saveStaff(staff)
    return member
  },

  updateStaff(id: string, updates: Partial<StaffMember>) {
    const staff = this.getStaff()
    const member = staff.find(m => m.id === id)
    if (member) {
      Object.assign(member, updates)
      this.saveStaff(staff)
    }
    return member
  },

  // Dashboard stats
  getDashboardStats() {
    const products = this.getProducts()
    const stock = this.getStock()
    const kots = this.getKOTs()
    const bills = this.getBills()

    const todayRevenue = bills
      .filter(b => b.date === new Date().toISOString().split('T')[0])
      .reduce((sum, b) => sum + b.total, 0)

    const activeKOTs = kots.filter(k => k.status !== 'Served').length
    const lowStockCount = stock.filter(s => s.currentQuantity <= s.minimumQuantity).length
    const todayBills = bills.filter(b => b.date === new Date().toISOString().split('T')[0]).length

    return {
      todayRevenue,
      activeKOTs,
      lowStockCount,
      todayBills,
      totalProducts: products.length,
      totalStockItems: stock.length,
    }
  },
}
