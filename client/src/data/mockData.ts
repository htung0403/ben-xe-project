import type { Vehicle, Driver, Route, Document, Transaction, Invoice, Plan } from '@/types'

// Mock Routes
export const mockRoutes: Route[] = [
  { id: '1', name: 'Sài Gòn - Cần Thơ (Sáng)', from: 'Sài Gòn', to: 'Cần Thơ', distance: 170, duration: 4, schedule: 'Sáng' },
  { id: '2', name: 'Sài Gòn - Đà Lạt (Chiều)', from: 'Sài Gòn', to: 'Đà Lạt', distance: 300, duration: 6, schedule: 'Chiều' },
  { id: '3', name: 'Sài Gòn - Nha Trang', from: 'Sài Gòn', to: 'Nha Trang', distance: 450, duration: 8, schedule: 'Sáng' },
  { id: '4', name: 'Sài Gòn - Phan Thiết', from: 'Sài Gòn', to: 'Phan Thiết', distance: 200, duration: 4, schedule: 'Sáng' },
  { id: '5', name: 'Sài Gòn - Vũng Tàu', from: 'Sài Gòn', to: 'Vũng Tàu', distance: 120, duration: 2.5, schedule: 'Sáng' },
  { id: '6', name: 'Sài Gòn - Mỹ Tho', from: 'Sài Gòn', to: 'Mỹ Tho', distance: 70, duration: 1.5, schedule: 'Sáng' },
  { id: '7', name: 'Sài Gòn - Long Xuyên', from: 'Sài Gòn', to: 'Long Xuyên', distance: 190, duration: 4, schedule: 'Chiều' },
  { id: '8', name: 'Sài Gòn - Cà Mau', from: 'Sài Gòn', to: 'Cà Mau', distance: 350, duration: 7, schedule: 'Sáng' },
  { id: '9', name: 'Sài Gòn - Bến Tre', from: 'Sài Gòn', to: 'Bến Tre', distance: 85, duration: 2, schedule: 'Sáng' },
  { id: '10', name: 'Sài Gòn - Rạch Giá', from: 'Sài Gòn', to: 'Rạch Giá', distance: 250, duration: 5, schedule: 'Chiều' },
]

// Mock Drivers
export const mockDrivers: Driver[] = [
  { id: '1', name: 'Nguyễn Văn A', license: 'GPLX-12345', licenseExpiry: new Date('2026-12-31'), phone: '0901234567', status: 'active' },
  { id: '2', name: 'Trần Văn B', license: 'GPLX-12346', licenseExpiry: new Date('2025-06-30'), phone: '0901234568', status: 'active' },
  { id: '3', name: 'Lê Văn C', license: 'GPLX-12347', licenseExpiry: new Date('2025-01-15'), phone: '0901234569', status: 'active' },
  { id: '4', name: 'Phạm Văn D', license: 'GPLX-12348', licenseExpiry: new Date('2026-03-20'), phone: '0901234570', status: 'active' },
  { id: '5', name: 'Hoàng Văn E', license: 'GPLX-12349', licenseExpiry: new Date('2025-11-10'), phone: '0901234571', status: 'active' },
  { id: '6', name: 'Vũ Văn F', license: 'GPLX-12350', licenseExpiry: new Date('2026-08-25'), phone: '0901234572', status: 'active' },
  { id: '7', name: 'Đỗ Văn G', license: 'GPLX-12351', licenseExpiry: new Date('2025-04-12'), phone: '0901234573', status: 'active' },
  { id: '8', name: 'Bùi Văn H', license: 'GPLX-12352', licenseExpiry: new Date('2026-09-30'), phone: '0901234574', status: 'active' },
  { id: '9', name: 'Đinh Văn I', license: 'GPLX-12353', licenseExpiry: new Date('2025-07-18'), phone: '0901234575', status: 'active' },
  { id: '10', name: 'Lý Văn K', license: 'GPLX-12354', licenseExpiry: new Date('2026-05-22'), phone: '0901234576', status: 'active' },
  { id: '11', name: 'Phan Văn L', license: 'GPLX-12355', licenseExpiry: new Date('2025-02-28'), phone: '0901234577', status: 'active' },
  { id: '12', name: 'Võ Văn M', license: 'GPLX-12356', licenseExpiry: new Date('2026-10-15'), phone: '0901234578', status: 'active' },
  { id: '13', name: 'Dương Văn N', license: 'GPLX-12357', licenseExpiry: new Date('2025-09-05'), phone: '0901234579', status: 'active' },
  { id: '14', name: 'Ngô Văn O', license: 'GPLX-12358', licenseExpiry: new Date('2026-11-20'), phone: '0901234580', status: 'active' },
  { id: '15', name: 'Đặng Văn P', license: 'GPLX-12359', licenseExpiry: new Date('2025-12-10'), phone: '0901234581', status: 'active' },
]

// Helper function to generate documents
function generateDocuments(vehicleId: string): Document[] {
  const now = new Date()
  return [
    {
      id: `${vehicleId}-doc-1`,
      type: 'phu_hieu',
      typeName: 'Phù hiệu',
      number: `PH-${vehicleId.padStart(5, '0')}`,
      expiryDate: new Date(now.getFullYear() + 1, 11, 31),
      status: 'valid',
    },
    {
      id: `${vehicleId}-doc-2`,
      type: 'dang_kiem',
      typeName: 'Đăng kiểm',
      number: `DK-${vehicleId.padStart(5, '0')}`,
      expiryDate: new Date(now.getFullYear(), 0, 15),
      status: now.getMonth() === 0 && now.getDate() > 15 ? 'expired' : 'valid',
    },
    {
      id: `${vehicleId}-doc-3`,
      type: 'bao_hiem',
      typeName: 'Bảo hiểm',
      number: `BH-${vehicleId.padStart(5, '0')}`,
      expiryDate: new Date(now.getFullYear(), 5, 20),
      status: 'valid',
    },
    {
      id: `${vehicleId}-doc-4`,
      type: 'dang_ky_xe',
      typeName: 'Đăng ký xe',
      number: `51B-${vehicleId.padStart(3, '0')}.${Math.floor(Math.random() * 100)}`,
      expiryDate: new Date(now.getFullYear() + 1, 2, 10),
      status: 'valid',
    },
  ]
}

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    licensePlate: '51B-123.45',
    type: 'Xe khách 45 chỗ',
    seats: 45,
    company: 'Công ty ABC',
    status: 'in_station',
    entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    passengers: 0,
    documents: generateDocuments('1'),
    payments: [],
    route: mockRoutes[0],
  },
  {
    id: '2',
    licensePlate: '51B-234.56',
    type: 'Xe khách 35 chỗ',
    seats: 35,
    company: 'Công ty XYZ',
    status: 'in_station',
    entryTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    passengers: 0,
    documents: generateDocuments('2'),
    payments: [],
    route: mockRoutes[1],
  },
  {
    id: '3',
    licensePlate: '51B-345.67',
    type: 'Xe khách 29 chỗ',
    seats: 29,
    company: 'Công ty DEF',
    status: 'granted',
    entryTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    passengers: 25,
    documents: generateDocuments('3'),
    payments: [],
    route: mockRoutes[2],
    driver: mockDrivers[0],
    transportLog: mockRoutes[2].name,
    qualificationStatus: 'qualified',
  },
  {
    id: '4',
    licensePlate: '51B-456.78',
    type: 'Xe khách 45 chỗ',
    seats: 45,
    company: 'Công ty GHI',
    status: 'granted',
    entryTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    passengers: 30,
    documents: generateDocuments('4'),
    payments: [],
    route: mockRoutes[3],
    driver: mockDrivers[1],
    transportLog: mockRoutes[3].name,
    qualificationStatus: 'qualified',
  },
  {
    id: '5',
    licensePlate: '51B-567.89',
    type: 'Xe khách 35 chỗ',
    seats: 35,
    company: 'Công ty JKL',
    status: 'paid',
    entryTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
    passengers: 28,
    documents: generateDocuments('5'),
    payments: [{ id: 'p1', vehicleId: '5', amount: 100000, method: 'cash', status: 'completed', createdAt: new Date() }],
    route: mockRoutes[4],
    driver: mockDrivers[2],
    transportLog: mockRoutes[4].name,
    qualificationStatus: 'qualified',
    transportOrderCode: 'VL2024-000001',
  },
  {
    id: '6',
    licensePlate: '51B-678.90',
    type: 'Xe khách 29 chỗ',
    seats: 29,
    company: 'Công ty MNO',
    status: 'paid',
    entryTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
    passengers: 22,
    documents: generateDocuments('6'),
    payments: [{ id: 'p2', vehicleId: '6', amount: 100000, method: 'transfer', status: 'completed', createdAt: new Date() }],
    route: mockRoutes[5],
    driver: mockDrivers[3],
    transportLog: mockRoutes[5].name,
    qualificationStatus: 'qualified',
    transportOrderCode: 'VL2024-000002',
  },
  {
    id: '7',
    licensePlate: '51B-789.01',
    type: 'Xe khách 45 chỗ',
    seats: 45,
    company: 'Công ty PQR',
    status: 'ready_depart',
    entryTime: new Date(Date.now() - 7 * 60 * 60 * 1000),
    passengers: 35,
    documents: generateDocuments('7'),
    payments: [{ id: 'p3', vehicleId: '7', amount: 100000, method: 'cash', status: 'completed', createdAt: new Date() }],
    route: mockRoutes[6],
    driver: mockDrivers[4],
    transportLog: mockRoutes[6].name,
    qualificationStatus: 'qualified',
    transportOrderCode: 'VL2024-000003',
    expectedDeparture: new Date(Date.now() + 30 * 60 * 1000),
  },
  {
    id: '8',
    licensePlate: '51B-890.12',
    type: 'Xe khách 35 chỗ',
    seats: 35,
    company: 'Công ty STU',
    status: 'ready_depart',
    entryTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
    passengers: 30,
    documents: generateDocuments('8'),
    payments: [{ id: 'p4', vehicleId: '8', amount: 100000, method: 'card', status: 'completed', createdAt: new Date() }],
    route: mockRoutes[7],
    driver: mockDrivers[5],
    transportLog: mockRoutes[7].name,
    qualificationStatus: 'qualified',
    transportOrderCode: 'VL2024-000004',
    expectedDeparture: new Date(Date.now() + 15 * 60 * 1000),
  },
  {
    id: '9',
    licensePlate: '51B-901.23',
    type: 'Xe khách 29 chỗ',
    seats: 29,
    company: 'Công ty VWX',
    status: 'granted',
    entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    passengers: 20,
    documents: generateDocuments('9'),
    payments: [],
    route: mockRoutes[8],
    driver: mockDrivers[6],
    transportLog: mockRoutes[8].name,
    qualificationStatus: 'not_qualified',
    qualificationReason: 'Giấy tờ thiếu',
  },
  {
    id: '10',
    licensePlate: '51B-012.34',
    type: 'Xe khách 45 chỗ',
    seats: 45,
    company: 'Công ty YZA',
    status: 'in_station',
    entryTime: new Date(Date.now() - 30 * 60 * 1000),
    passengers: 0,
    documents: generateDocuments('10'),
    payments: [],
    route: mockRoutes[9],
  },
]

// Generate more vehicles to reach 20
for (let i = 11; i <= 20; i++) {
  const statuses: Vehicle['status'][] = ['in_station', 'granted', 'paid', 'ready_depart']
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const route = mockRoutes[Math.floor(Math.random() * mockRoutes.length)]
  const driver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)]
  
  mockVehicles.push({
    id: i.toString(),
    licensePlate: `51B-${String(i).padStart(3, '0')}.${Math.floor(Math.random() * 100)}`,
    type: ['Xe khách 45 chỗ', 'Xe khách 35 chỗ', 'Xe khách 29 chỗ'][Math.floor(Math.random() * 3)],
    seats: [45, 35, 29][Math.floor(Math.random() * 3)],
    company: `Công ty ${String.fromCharCode(65 + (i % 26))}`,
    status,
    entryTime: new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000),
    passengers: status === 'in_station' ? 0 : Math.floor(Math.random() * 30) + 10,
    documents: generateDocuments(i.toString()),
    payments: status === 'paid' || status === 'ready_depart' ? [{ id: `p${i}`, vehicleId: i.toString(), amount: 100000, method: ['cash', 'transfer', 'card'][Math.floor(Math.random() * 3)] as any, status: 'completed', createdAt: new Date() }] : [],
    route,
    driver: status !== 'in_station' ? driver : undefined,
    transportLog: status !== 'in_station' ? route.name : undefined,
    qualificationStatus: status !== 'in_station' ? (Math.random() > 0.2 ? 'qualified' : 'not_qualified') : undefined,
    transportOrderCode: status === 'paid' || status === 'ready_depart' ? `VL2024-${String(i).padStart(6, '0')}` : undefined,
    expectedDeparture: status === 'ready_depart' ? new Date(Date.now() + Math.random() * 60 * 60 * 1000) : undefined,
  })
}

// Mock Transactions
export const mockTransactions: Transaction[] = []

mockVehicles.forEach((vehicle, index) => {
  if (vehicle.status !== 'in_station') {
    mockTransactions.push({
      id: `t${index + 1}`,
      type: 'entry',
      vehicleId: vehicle.id,
      vehicle,
      driverId: vehicle.driver?.id,
      driver: vehicle.driver,
      routeId: vehicle.route?.id,
      route: vehicle.route,
      passengers: vehicle.passengers,
      status: 'completed',
      createdAt: vehicle.entryTime,
      performedBy: 'user1',
    })
  }
  
  if (vehicle.status === 'departed' || vehicle.status === 'ready_depart') {
    mockTransactions.push({
      id: `t${index + 1}-exit`,
      type: 'exit',
      vehicleId: vehicle.id,
      vehicle,
      driverId: vehicle.driver?.id,
      driver: vehicle.driver,
      routeId: vehicle.route?.id,
      route: vehicle.route,
      passengers: vehicle.passengers,
      status: 'completed',
      createdAt: vehicle.exitTime || new Date(),
      performedBy: 'user1',
    })
  }
})

// Mock Invoices
export const mockInvoices: Invoice[] = mockVehicles
  .filter(v => v.payments.length > 0)
  .map((vehicle, index) => ({
    id: `inv${index + 1}`,
    code: `HD-${String(index + 1).padStart(6, '0')}`,
    vehicleId: vehicle.id,
    customerName: vehicle.company,
    items: [
      { id: '1', service: 'Phí vào bến', unitPrice: 50000, quantity: 1, amount: 50000 },
      { id: '2', service: 'Phí quản lý', unitPrice: 30000, quantity: 1, amount: 30000 },
      { id: '3', service: 'Phí vệ sinh', unitPrice: 20000, quantity: 1, amount: 20000 },
    ],
    subtotal: 100000,
    tax: 0,
    total: 100000,
    status: 'paid',
    createdAt: vehicle.payments[0]?.createdAt || new Date(),
    paidAt: vehicle.payments[0]?.createdAt || new Date(),
  }))

// Mock Plans
export const mockPlans: Plan[] = [
  {
    id: '1',
    date: new Date(),
    routeId: mockRoutes[0].id,
    route: mockRoutes[0],
    trips: 2,
    vehicleIds: ['1', '2'],
    driverIds: ['1', '2'],
    status: 'scheduled',
  },
  {
    id: '2',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    routeId: mockRoutes[1].id,
    route: mockRoutes[1],
    trips: 3,
    vehicleIds: ['3', '4', '5'],
    driverIds: ['3', '4', '5'],
    status: 'scheduled',
  },
]

