import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, RefreshCw, Upload } from 'lucide-react'
import { ChoXeVaoBenDialog } from '@/components/dieu-do/ChoXeVaoBenDialog'
import { XeTraKhachDialog } from '@/components/dieu-do/XeTraKhachDialog'
import { CapPhepLenNotDialog } from '@/components/dieu-do/CapPhepLenNotDialog'
import { CapLenhXuatBenDialog } from '@/components/dieu-do/CapLenhXuatBenDialog'
import { ChoXeRaBenDialog } from '@/components/dieu-do/ChoXeRaBenDialog'
import { VehicleCard } from '@/components/dieu-do/VehicleCard'

export function DieuDo() {
  const navigate = useNavigate()
  const { vehicles, vehicleFilters, setVehicleFilters } = useStore()
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<string | null>(null)
  const [notType, setNotType] = useState<string | undefined>(undefined)

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles

    if (vehicleFilters.search) {
      filtered = filtered.filter(v =>
        v.licensePlate.toLowerCase().includes(vehicleFilters.search.toLowerCase())
      )
    }

    if (vehicleFilters.routeId) {
      filtered = filtered.filter(v => v.route?.id === vehicleFilters.routeId)
    }

    if (vehicleFilters.status) {
      filtered = filtered.filter(v => v.status === vehicleFilters.status)
    }

    return filtered
  }, [vehicles, vehicleFilters])

  const vehiclesByStatus = useMemo(() => {
    return {
      in_station: filteredVehicles.filter(v => v.status === 'in_station'),
      granted: filteredVehicles.filter(v => v.status === 'granted'),
      paid: filteredVehicles.filter(v => v.status === 'paid'),
      ready_depart: filteredVehicles.filter(v => v.status === 'ready_depart'),
    }
  }, [filteredVehicles])

  const handleAction = (action: string, vehicleId: string) => {
    if (action === 'thanh-toan') {
      // Navigate to payment confirmation page
      navigate(`/thanh-toan/xac-nhan/${vehicleId}`)
    } else {
      setSelectedVehicle(vehicleId)
      setDialogOpen(action)
    }
  }

  const columns = [
    {
      id: 'in_station',
      title: 'Danh sách xe trong bến',
      vehicles: vehiclesByStatus.in_station,
    },
    {
      id: 'granted',
      title: 'Danh sách xe đã cấp nốt',
      vehicles: vehiclesByStatus.granted,
    },
    {
      id: 'paid',
      title: 'Danh sách xe đã thanh toán',
      vehicles: vehiclesByStatus.paid,
    },
    {
      id: 'ready_depart',
      title: 'Danh sách xe đã cấp lệnh xuất bến',
      vehicles: vehiclesByStatus.ready_depart,
    },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <h1 className="text-2xl font-bold">Điều độ - Đăng tài</h1>
      </div>

      {/* Global Actions, Search Bar and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Làm mới">
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" title="Cho xe vào bến" onClick={() => setDialogOpen('cho-xe-vao')}>
            <Upload className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm"
              className="pr-10"
              value={vehicleFilters.search}
              onChange={(e) => setVehicleFilters({ search: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={notType || 'all'} onValueChange={(value) => setNotType(value === 'all' ? undefined : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Loại cấp nốt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="regular">Cấp nốt thường</SelectItem>
              <SelectItem value="express">Cấp nốt nhanh</SelectItem>
              <SelectItem value="special">Cấp nốt đặc biệt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col border rounded-lg bg-background overflow-hidden">
            {/* Column Header */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">
                  {column.title} ({column.vehicles.length})
                </h3>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Column Content */}
            <div className="flex-1 overflow-y-auto p-3">
              {column.vehicles.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Không có dữ liệu!
                </div>
              ) : (
                column.vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onAction={handleAction}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      {dialogOpen === 'cho-xe-vao' && (
        <ChoXeVaoBenDialog
          open={true}
          onOpenChange={(open) => !open && setDialogOpen(null)}
        />
      )}

      {dialogOpen === 'xe-tra-khach' && selectedVehicle && (
        <XeTraKhachDialog
          open={true}
          onOpenChange={(open) => !open && setDialogOpen(null)}
          vehicleId={selectedVehicle}
        />
      )}

      {dialogOpen === 'cap-phep' && selectedVehicle && (
        <CapPhepLenNotDialog
          open={true}
          onOpenChange={(open) => !open && setDialogOpen(null)}
          vehicleId={selectedVehicle}
        />
      )}

      {dialogOpen === 'cap-lenh' && selectedVehicle && (
        <CapLenhXuatBenDialog
          open={true}
          onOpenChange={(open) => !open && setDialogOpen(null)}
          vehicleId={selectedVehicle}
        />
      )}

      {dialogOpen === 'cho-xe-ra' && selectedVehicle && (
        <ChoXeRaBenDialog
          open={true}
          onOpenChange={(open) => !open && setDialogOpen(null)}
          vehicleId={selectedVehicle}
        />
      )}
    </div>
  )
}
