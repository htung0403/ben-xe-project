export interface Vehicle {
  id: string
  licensePlate: string
  type: string
  seats: number
  company: string
  status: 'in_station' | 'granted' | 'paid' | 'ready_depart' | 'departed' | 'not_qualified'
  entryTime: Date
  exitTime?: Date
  route?: Route
  driver?: Driver
  passengers: number
  documents: Document[]
  payments: Payment[]
  notes?: string
  transportLog?: string
  expectedDeparture?: Date
  actualDeparture?: Date
  transportOrderCode?: string
  qualificationStatus?: 'qualified' | 'not_qualified'
  qualificationReason?: string
}

export interface Driver {
  id: string
  name: string
  license: string
  licenseExpiry: Date
  phone: string
  status: 'active' | 'inactive'
}

export interface Route {
  id: string
  name: string
  from: string
  to: string
  distance: number
  duration: number
  schedule?: string
}

export interface Document {
  id: string
  type: 'phu_hieu' | 'dang_kiem' | 'bao_hiem' | 'dang_ky_xe'
  typeName: string
  number: string
  expiryDate: Date
  status: 'valid' | 'expired'
  fileUrl?: string
}

export interface Payment {
  id: string
  vehicleId: string
  amount: number
  method: 'cash' | 'transfer' | 'card'
  status: 'pending' | 'completed'
  createdAt: Date
  invoiceId?: string
}

export interface Invoice {
  id: string
  code: string
  vehicleId: string
  customerName: string
  customerTaxCode?: string
  customerAddress?: string
  customerEmail?: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'paid' | 'cancelled'
  createdAt: Date
  paidAt?: Date
}

export interface InvoiceItem {
  id: string
  service: string
  unitPrice: number
  quantity: number
  amount: number
}

export interface Transaction {
  id: string
  type: 'entry' | 'exit' | 'payment' | 'cancel'
  vehicleId: string
  vehicle?: Vehicle
  driverId?: string
  driver?: Driver
  routeId?: string
  route?: Route
  passengers: number
  amount?: number
  status: 'completed' | 'pending' | 'cancelled'
  createdAt: Date
  notes?: string
  performedBy?: string
}

export interface Plan {
  id: string
  date: Date
  routeId: string
  route?: Route
  trips: number
  vehicleIds: string[]
  vehicles?: Vehicle[]
  driverIds: string[]
  drivers?: Driver[]
  notes?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
}

export interface User {
  id: string
  username: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'viewer'
}

