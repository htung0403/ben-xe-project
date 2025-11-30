import { useState } from 'react'
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
import { Calendar, Search } from 'lucide-react'

interface ChoXeVaoBenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChoXeVaoBenDialog({ open, onOpenChange }: ChoXeVaoBenDialogProps) {
  const { vehicles, routes, addVehicle, updateVehicle } = useStore()
  const { toast } = useToast()
  const [licensePlate, setLicensePlate] = useState('')
  const [entryTime, setEntryTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [confirmPassengerDrop, setConfirmPassengerDrop] = useState(false)
  const [transportLog, setTransportLog] = useState<string | undefined>(undefined)
  const [passengers, setPassengers] = useState('')
  const [transportRoute, setTransportRoute] = useState<string | undefined>(undefined)
  const [signAndTransmit, setSignAndTransmit] = useState(true)
  const [printDisplay, setPrintDisplay] = useState(false)

  const handleSubmit = () => {
    if (!licensePlate || !entryTime) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }
    
    // Find existing vehicle or create new
    let vehicle = vehicles.find(v => v.licensePlate === licensePlate)
    
    if (!vehicle) {
      // Create new vehicle entry
      const newVehicle = {
        id: Date.now().toString(),
        licensePlate,
        type: 'Xe khách 45 chỗ',
        seats: 45,
        company: 'Công ty mới',
        status: 'in_station' as const,
        entryTime: new Date(entryTime),
        passengers: confirmPassengerDrop ? Number(passengers) : 0,
        documents: [],
        payments: [],
        transportLog: confirmPassengerDrop ? transportLog : undefined,
        route: transportRoute ? routes.find(r => r.id === transportRoute) : undefined,
      }
      addVehicle(newVehicle)
      toast({
        title: "Thành công",
        description: `Đã thêm xe ${licensePlate} vào bến`,
        variant: "success",
      })
    } else {
      // Update existing vehicle
      updateVehicle(vehicle.id, {
        status: 'in_station',
        entryTime: new Date(entryTime),
        passengers: confirmPassengerDrop ? Number(passengers) : 0,
        transportLog: confirmPassengerDrop ? transportLog : undefined,
        route: transportRoute ? routes.find(r => r.id === transportRoute) : undefined,
      })
      toast({
        title: "Thành công",
        description: `Đã cập nhật xe ${licensePlate}`,
        variant: "success",
      })
    }

    // Reset form
    setLicensePlate('')
    setEntryTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
    setConfirmPassengerDrop(false)
    setTransportLog(undefined)
    setPassengers('')
    setTransportRoute(undefined)
    setSignAndTransmit(true)
    setPrintDisplay(false)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setLicensePlate('')
    setEntryTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
    setConfirmPassengerDrop(false)
    setTransportLog(undefined)
    setPassengers('')
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
          <h2 className="text-xl font-bold">Cho xe vào bến</h2>
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
                <Label htmlFor="licensePlate">Biển kiểm soát (*)</Label>
                <div className="relative">
                  <Input
                    id="licensePlate"
                    placeholder="Biển kiểm soát (*)"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryTime">Thời gian vào (*)</Label>
                <div className="relative">
                  <Input
                    id="entryTime"
                    type="datetime-local"
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Section 2: Thông tin xe trả khách */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin xe trả khách</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirmPassengerDrop"
                  checked={confirmPassengerDrop}
                  onCheckedChange={(checked) => setConfirmPassengerDrop(checked === true)}
                />
                <Label htmlFor="confirmPassengerDrop" className="cursor-pointer font-normal">
                  Xác nhận trả khách
                </Label>
              </div>

              {confirmPassengerDrop && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="transportLog">Chọn nhật trình</Label>
                    <Select value={transportLog || ''} onValueChange={(value) => setTransportLog(value || undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhật trình" />
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
                      placeholder="Số khách đến bến (*)"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      required={confirmPassengerDrop}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transportRoute">Tuyến vận chuyển (*)</Label>
                    <Select value={transportRoute || ''} onValueChange={(value) => setTransportRoute(value || undefined)}>
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
                </>
              )}
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
