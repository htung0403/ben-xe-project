import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { Search } from 'lucide-react'

interface XeTraKhachDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleId: string
}

export function XeTraKhachDialog({ open, onOpenChange, vehicleId }: XeTraKhachDialogProps) {
  const { vehicles, routes, updateVehicle } = useStore()
  const { toast } = useToast()
  const vehicle = vehicles.find(v => v.id === vehicleId)
  
  const [transportLog, setTransportLog] = useState<string | undefined>(undefined)
  const [passengers, setPassengers] = useState('1')
  const [transportRoute, setTransportRoute] = useState<string | undefined>(undefined)
  const [signAndTransmit, setSignAndTransmit] = useState(true)
  const [printDisplay, setPrintDisplay] = useState(false)

  useEffect(() => {
    if (vehicle) {
      setTransportLog(vehicle.transportLog ? vehicle.transportLog : undefined)
      setPassengers(String(vehicle.passengers || 1))
      setTransportRoute(vehicle.route?.id)
    }
  }, [vehicle])

  if (!vehicle) return null

  const handleSubmit = () => {
    if (!transportLog || !passengers || !transportRoute) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    updateVehicle(vehicleId, {
      transportLog,
      passengers: Number(passengers),
      route: routes.find(r => r.id === transportRoute),
    })

    toast({
      title: "Thành công",
      description: `Đã cập nhật thông tin xe trả khách cho xe ${vehicle.licensePlate}`,
      variant: "success",
    })

    onOpenChange(false)
  }

  const handleCancel = () => {
    setTransportLog(undefined)
    setPassengers('1')
    setTransportRoute(undefined)
    setSignAndTransmit(true)
    setPrintDisplay(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-xl font-bold">Xác nhận trả khách</h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              HỦY
            </Button>
            <Button onClick={handleSubmit}>
              XÁC NHẬN
            </Button>
          </div>
        </div>

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            {/* Section 1: Thông tin xe vào bến */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin xe vào bến</h3>
              
              <div className="space-y-2">
                <Label htmlFor="licensePlate">Biển kiểm soát</Label>
                <Input
                  id="licensePlate"
                  value={`${vehicle.licensePlate} (${vehicle.company})`}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryTime">Thời gian vào</Label>
                <Input
                  id="entryTime"
                  value={format(new Date(vehicle.entryTime), 'HH:mm dd/MM/yyyy')}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Section 2: Thông tin xe trả khách */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin xe trả khách</h3>
              
              <div className="space-y-2">
                <Label htmlFor="transportLog">Chọn nhật trình</Label>
                <Select 
                  value={transportLog || ''} 
                  onValueChange={(value) => setTransportLog(value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tìm kiếm" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.name}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengers">Số khách đến bến (*)</Label>
                <Input
                  id="passengers"
                  type="number"
                  min="0"
                  max={vehicle.seats}
                  value={passengers}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= vehicle.seats)) {
                      setPassengers(value)
                    }
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transportRoute">Tuyến vận chuyển (*)</Label>
                <Select 
                  value={transportRoute || ''} 
                  onValueChange={(value) => setTransportRoute(value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tuyến vận chuyển (*)" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Bản thể hiện lệnh vận chuyển</h3>
            <div className="border-2 border-dashed border-muted rounded-lg h-[400px] flex items-center justify-center bg-muted/20 relative">
              <div className="text-center text-muted-foreground">
                <p className="text-lg">Không có bản thể hiện</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-4 right-4"
                title="Tìm kiếm"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Checkboxes */}
        <div className="flex items-center gap-6 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="signAndTransmit"
              checked={signAndTransmit}
              onCheckedChange={(checked) => setSignAndTransmit(checked === true)}
            />
            <Label htmlFor="signAndTransmit" className="cursor-pointer font-normal">
              Ký lệnh và truyền tải
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="printDisplay"
              checked={printDisplay}
              onCheckedChange={(checked) => setPrintDisplay(checked === true)}
            />
            <Label htmlFor="printDisplay" className="cursor-pointer font-normal">
              In bản thể hiện
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
