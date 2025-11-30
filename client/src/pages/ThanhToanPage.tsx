import { useStore } from '@/store/useStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

export function ThanhToanPage() {
  const { vehicles, invoices } = useStore()

  const pendingVehicles = vehicles.filter(v => v.status === 'granted' && v.qualificationStatus === 'qualified')
  const paidInvoices = invoices.filter(inv => inv.status === 'paid')

  const today = new Date()
  const todayRevenue = paidInvoices
    .filter(inv => {
      if (inv.paidAt) {
        const paidDate = new Date(inv.paidAt)
        return paidDate.toDateString() === today.toDateString()
      }
      return false
    })
    .reduce((sum, inv) => sum + inv.total, 0)

  const cashRevenue = paidInvoices
    .filter(inv => {
      const vehicle = vehicles.find(v => v.id === inv.vehicleId)
      return vehicle?.payments[0]?.method === 'cash'
    })
    .reduce((sum, inv) => sum + inv.total, 0)

  const transferRevenue = paidInvoices
    .filter(inv => {
      const vehicle = vehicles.find(v => v.id === inv.vehicleId)
      return vehicle?.payments[0]?.method === 'transfer'
    })
    .reduce((sum, inv) => sum + inv.total, 0)

  const cardRevenue = paidInvoices
    .filter(inv => {
      const vehicle = vehicles.find(v => v.id === inv.vehicleId)
      return vehicle?.payments[0]?.method === 'card'
    })
    .reduce((sum, inv) => sum + inv.total, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thanh toán</h1>
        <p className="text-muted-foreground">Quản lý thanh toán và doanh thu</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng thu hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(todayRevenue)}đ
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tiền mặt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(cashRevenue)}đ
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chuyển khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(transferRevenue)}đ
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Thẻ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(cardRevenue)}đ
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ thanh toán ({pendingVehicles.length})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Đã thanh toán ({paidInvoices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biển số xe</TableHead>
                <TableHead>Tuyến đường</TableHead>
                <TableHead>Lái xe</TableHead>
                <TableHead>Giờ vào bến</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Không có xe nào chờ thanh toán
                  </TableCell>
                </TableRow>
              ) : (
                pendingVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.route?.name || '-'}</TableCell>
                    <TableCell>{vehicle.driver?.name || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(vehicle.entryTime), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="warning">Chờ thanh toán</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="paid" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hóa đơn</TableHead>
                <TableHead>Biển số xe</TableHead>
                <TableHead>Ngày thanh toán</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paidInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Chưa có thanh toán nào
                  </TableCell>
                </TableRow>
              ) : (
                paidInvoices.map((invoice) => {
                  const vehicle = vehicles.find(v => v.id === invoice.vehicleId)
                  const payment = vehicle?.payments[0]
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.code}</TableCell>
                      <TableCell>{invoice.vehicleId}</TableCell>
                      <TableCell>
                        {invoice.paidAt ? format(new Date(invoice.paidAt), 'dd/MM/yyyy HH:mm') : '-'}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('vi-VN').format(invoice.total)}đ
                      </TableCell>
                      <TableCell>
                        {payment?.method === 'cash' ? 'Tiền mặt' :
                         payment?.method === 'transfer' ? 'Chuyển khoản' : 'Thẻ'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">Đã thanh toán</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

