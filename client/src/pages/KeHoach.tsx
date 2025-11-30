import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'

export function KeHoach() {
  const { plans, routes, vehicles, drivers } = useStore()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const selectedDatePlans = plans.filter(p => {
    const planDate = new Date(p.date)
    return planDate.toDateString() === selectedDate.toDateString()
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kế hoạch</h1>
          <p className="text-muted-foreground">Quản lý kế hoạch và lịch trình</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Lập kế hoạch mới
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Lịch tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, 'MMMM yyyy')}
              </p>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                  <div key={day} className="text-center font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 30 }, (_, i) => {
                  const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1)
                  const dayPlans = plans.filter(p => {
                    const planDate = new Date(p.date)
                    return planDate.toDateString() === date.toDateString()
                  })
                  return (
                    <button
                      key={i}
                      className={`p-2 rounded text-center ${
                        date.toDateString() === selectedDate.toDateString()
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div>{i + 1}</div>
                      {dayPlans.length > 0 && (
                        <div className="text-xs mt-1">
                          {dayPlans.length} kế hoạch
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Kế hoạch ngày {format(selectedDate, 'dd/MM/yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDatePlans.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Không có kế hoạch nào cho ngày này
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tuyến đường</TableHead>
                    <TableHead>Số chuyến</TableHead>
                    <TableHead>Xe</TableHead>
                    <TableHead>Lái xe</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDatePlans.map((plan) => {
                    const route = routes.find(r => r.id === plan.routeId)
                    const planVehicles = plan.vehicleIds.map(id => vehicles.find(v => v.id === id)).filter(Boolean)
                    const planDrivers = plan.driverIds.map(id => drivers.find(d => d.id === id)).filter(Boolean)
                    
                    return (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{route?.name || '-'}</TableCell>
                        <TableCell>{plan.trips}</TableCell>
                        <TableCell>
                          {planVehicles.map(v => v?.licensePlate).join(', ') || '-'}
                        </TableCell>
                        <TableCell>
                          {planDrivers.map(d => d?.name).join(', ') || '-'}
                        </TableCell>
                        <TableCell>{plan.status}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

