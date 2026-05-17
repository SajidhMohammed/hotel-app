import { Product, StockItem, KOT, Bill, Supplier, PurchaseOrder, UserInfo, DashboardStats } from './models'

const STORAGE_KEYS = {
  PRODUCTS: 'rd_products',
  STOCK: 'rd_stock',
  KOTS: 'rd_kots',
  BILLS: 'rd_bills',
  SUPPLIERS: 'rd_suppliers',
  POS: 'rd_pos',
  USERS: 'rd_users',
}

// Default data
const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'Butter Chicken', category: 'Main Course', price: 12.50, isActive: true },
  { id: '2', name: 'Margherita Pizza', category: 'Main Course', price: 15.00, isActive: true },
  { id: '3', name: 'Garden Salad', category: 'Starter', price: 8.00, isActive: true },
  { id: '4', name: 'Iced Latte', category: 'Beverage', price: 8.50, isActive: true },
  { id: '5', name: 'Red Velvet Cake', category: 'Dessert', price: 6.50, isActive: true },
  { id: '6', name: 'Classic Burger', category: 'Main Course', price: 16.00, isActive: true },
  { id: '7', name: 'Fresh Lime Soda', category: 'Beverage', price: 5.00, isActive: true },
  { id: '8', name: 'Paneer Tikka', category: 'Starter', price: 18.50, isActive: true },
]

const DEFAULT_STOCK: StockItem[] = [
  {
    id: 's1',
    name: 'Tomato Sauce',
    category: 'Condiment',
    currentQuantity: 2,
    minimumQuantity: 10,
    reorderQuantity: 20,
    unit: 'kg',
    cost: 5.00,
    supplier: 'Fresh Foods Inc',
    lastRestockDate: '2024-01-10',
  },
  {
    id: 's2',
    name: 'Milk (Whole)',
    category: 'Dairy',
    currentQuantity: 5,
    minimumQuantity: 20,
    reorderQuantity: 50,
    unit: 'L',
    cost: 2.50,
    supplier: 'Dairy Co',
    lastRestockDate: '2024-01-08',
  },
  {
    id: 's3',
    name: 'Chicken Breast',
    category: 'Grocery',
    currentQuantity: 15,
    minimumQuantity: 30,
    reorderQuantity: 60,
    unit: 'kg',
    cost: 8.00,
    supplier: 'Meat Palace',
    lastRestockDate: '2024-01-11',
  },
]

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: 'sp1',
    name: 'Fresh Foods Inc',
    contactPerson: 'John Smith',
    email: 'contact@freshfoods.com',
    phone: '+1-555-0101',
    address: '123 Market St',
    city: 'Springfield',
    pincode: '12345',
    paymentTerms: 'Net 30',
    isActive: true,
  },
  {
    id: 'sp2',
    name: 'Dairy Co',
    contactPerson: 'Sarah Johnson',
    email: 'orders@dairyco.com',
    phone: '+1-555-0102',
    address: '456 Dairy Lane',
    city: 'Springfield',
    pincode: '12346',
    paymentTerms: 'Net 15',
    isActive: true,
  },
]

export const dataStore = {
  // Products
  getProducts(): Product[] {
    if (typeof window === 'undefined') return DEFAULT_PRODUCTS
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    return data ? JSON.parse(data) : DEFAULT_PRODUCTS
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

  deleteProduct(id: string) {
    const products = this.getProducts()
    const filtered = products.filter(p => p.id !== id)
    this.saveProducts(filtered)
  },

  // Stock
  getStock(): StockItem[] {
    if (typeof window === 'undefined') return DEFAULT_STOCK
    const data = localStorage.getItem(STORAGE_KEYS.STOCK)
    return data ? JSON.parse(data) : DEFAULT_STOCK
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

  getLowStockItems(): StockItem[] {
    const stock = this.getStock()
    return stock.filter(s => s.currentQuantity <= s.minimumQuantity)
  },

  // KOTs
  getKOTs(): KOT[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.KOTS)
    return data ? JSON.parse(data) : []
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

  getActiveKOTs(): KOT[] {
    const kots = this.getKOTs()
    return kots.filter(k => k.status !== 'Served')
  },

  // Bills
  getBills(): Bill[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.BILLS)
    return data ? JSON.parse(data) : []
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

  getBillsForDate(date: string): Bill[] {
    const bills = this.getBills()
    return bills.filter(b => b.date === date)
  },

  // Suppliers
  getSuppliers(): Supplier[] {
    if (typeof window === 'undefined') return DEFAULT_SUPPLIERS
    const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS)
    return data ? JSON.parse(data) : DEFAULT_SUPPLIERS
  },

  saveSuppliers(suppliers: Supplier[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers))
  },

  addSupplier(supplier: Supplier) {
    const suppliers = this.getSuppliers()
    suppliers.push(supplier)
    this.saveSuppliers(suppliers)
    return supplier
  },

  updateSupplier(id: string, updates: Partial<Supplier>) {
    const suppliers = this.getSuppliers()
    const supplier = suppliers.find(s => s.id === id)
    if (supplier) {
      Object.assign(supplier, updates)
      this.saveSuppliers(suppliers)
    }
    return supplier
  },

  // POs
  getPOs(): PurchaseOrder[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.POS)
    return data ? JSON.parse(data) : []
  },

  savePOs(pos: PurchaseOrder[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.POS, JSON.stringify(pos))
  },

  addPO(po: PurchaseOrder) {
    const pos = this.getPOs()
    pos.push(po)
    this.savePOs(pos)
    return po
  },

  getPendingPOs(): PurchaseOrder[] {
    const pos = this.getPOs()
    return pos.filter(p => p.status !== 'Received' && p.status !== 'Cancelled')
  },

  // Dashboard stats
  getDashboardStats(): DashboardStats {
    const bills = this.getBills()
    const kots = this.getKOTs()
    const stock = this.getStock()
    const products = this.getProducts()
    const pos = this.getPOs()

    const today = new Date().toISOString().split('T')[0]
    const todayBills = bills.filter(b => b.date === today)
    const todayRevenue = todayBills.reduce((sum, b) => sum + b.total, 0)

    return {
      todayRevenue,
      todayBills: todayBills.length,
      activeKOTs: kots.filter(k => k.status !== 'Served').length,
      lowStockItems: stock.filter(s => s.currentQuantity <= s.minimumQuantity).length,
      totalProducts: products.length,
      pendingPOs: pos.filter(p => p.status !== 'Received' && p.status !== 'Cancelled').length,
    }
  },
}
