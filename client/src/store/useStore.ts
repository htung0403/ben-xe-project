import { create } from 'zustand'
import type { Vehicle, Driver, Route, Transaction, Invoice, Plan, User } from '@/types'
import { mockVehicles, mockDrivers, mockRoutes, mockTransactions, mockInvoices, mockPlans } from '@/data/mockData'

interface AppState {
  // User
  user: User | null
  setUser: (user: User | null) => void
  
  // Data
  vehicles: Vehicle[]
  drivers: Driver[]
  routes: Route[]
  transactions: Transaction[]
  invoices: Invoice[]
  plans: Plan[]
  
  // Actions
  addVehicle: (vehicle: Vehicle) => void
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void
  removeVehicle: (id: string) => void
  
  addTransaction: (transaction: Transaction) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  
  addPlan: (plan: Plan) => void
  updatePlan: (id: string, updates: Partial<Plan>) => void
  
  // Filters
  vehicleFilters: {
    search: string
    routeId: string
    status: string
  }
  setVehicleFilters: (filters: Partial<AppState['vehicleFilters']>) => void
}

export const useStore = create<AppState>((set) => ({
  // User
  user: {
    id: '1',
    username: 'admin',
    name: 'Nguyễn Văn Admin',
    email: 'admin@benxe.vn',
    role: 'admin',
  },
  setUser: (user) => set({ user }),
  
  // Data
  vehicles: mockVehicles,
  drivers: mockDrivers,
  routes: mockRoutes,
  transactions: mockTransactions,
  invoices: mockInvoices,
  plans: mockPlans,
  
  // Actions
  addVehicle: (vehicle) => set((state) => ({
    vehicles: [...state.vehicles, vehicle],
  })),
  
  updateVehicle: (id, updates) => set((state) => ({
    vehicles: state.vehicles.map((v) =>
      v.id === id ? { ...v, ...updates } : v
    ),
  })),
  
  removeVehicle: (id) => set((state) => ({
    vehicles: state.vehicles.filter((v) => v.id !== id),
  })),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions],
  })),
  
  addInvoice: (invoice) => set((state) => ({
    invoices: [invoice, ...state.invoices],
  })),
  
  updateInvoice: (id, updates) => set((state) => ({
    invoices: state.invoices.map((inv) =>
      inv.id === id ? { ...inv, ...updates } : inv
    ),
  })),
  
  addPlan: (plan) => set((state) => ({
    plans: [...state.plans, plan],
  })),
  
  updatePlan: (id, updates) => set((state) => ({
    plans: state.plans.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    ),
  })),
  
  // Filters
  vehicleFilters: {
    search: '',
    routeId: '',
    status: '',
  },
  setVehicleFilters: (filters) => set((state) => ({
    vehicleFilters: { ...state.vehicleFilters, ...filters },
  })),
}))

