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
import { Plus, Edit, Home, Globe, AlertCircle, MapPin, ChevronRight, Calendar, Check } from 'lucide-react'
import { ChonLyDoKhongDuDieuKienDialog } from './ChonLyDoKhongDuDieuKienDialog'
import { SuaHieuLucGiayToDialog } from './SuaHieuLucGiayToDialog'

interface CapPhepLenNotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleId: string
}

export function CapPhepLenNotDialog({ open, onOpenChange, vehicleId }: CapPhepLenNotDialogProps) {
  const { vehicles, drivers, routes, updateVehicle, addTransaction } = useStore()
  const { toast } = useToast()
  const vehicle = vehicles.find(v => v.id === vehicleId)
  
  const [permitType, setPermitType] = useState('fixed')
  const [routeId, setRouteId] = useState<string | undefined>(undefined)
  const [transportOrderCode, setTransportOrderCode] = useState('')
  const [replacementVehicle, setReplacementVehicle] = useState<string | undefined>(undefined)
  const [seats, setSeats] = useState('2')
  const [beds, setBeds] = useState('41')
  const [hhTickets, setHhTickets] = useState('0')
  const [hhPercent, setHhPercent] = useState('0')
  const [hhPercentChecked, setHhPercentChecked] = useState(false)
  const [entryPlateChecked, setEntryPlateChecked] = useState(false)
  const [otherDepartureTime, setOtherDepartureTime] = useState('')
  const [otherDepartureTimeChecked, setOtherDepartureTimeChecked] = useState(false)
  const [departureDate, setDepartureDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [scheduleTime, setScheduleTime] = useState('17:00:00')
  const [driverId, setDriverId] = useState<string | undefined>(undefined)
  const [serviceTotal] = useState(0)
  const [showReasonDialog, setShowReasonDialog] = useState(false)
  const [showEditDocumentsDialog, setShowEditDocumentsDialog] = useState(false)

  useEffect(() => {
    if (vehicle) {
      setRouteId(vehicle.route?.id)
      setTransportOrderCode(vehicle.transportOrderCode || '')
      setSeats(String(vehicle.seats || 2))
      setDriverId(vehicle.driver?.id)
      if (vehicle.expectedDeparture) {
        setDepartureDate(format(vehicle.expectedDeparture, 'yyyy-MM-dd'))
        setScheduleTime(format(vehicle.expectedDeparture, 'HH:mm:ss'))
      }
    }
  }, [vehicle])

  if (!vehicle) return null

  const selectedRoute = routes.find(r => r.id === routeId)
  const allDocumentsValid = vehicle.documents.every(doc => {
    const expiryDate = new Date(doc.expiryDate)
    return expiryDate > new Date() && doc.status === 'valid'
  })

  const handleMarkNotQualified = () => {
    setShowReasonDialog(true)
  }

  const handleConfirmReason = (reasons: string[]) => {
    updateVehicle(vehicleId, {
      qualificationStatus: 'not_qualified',
      qualificationReason: reasons.join('; '),
    })
    
    toast({
      title: "Đã đánh dấu",
      description: "Xe không đủ điều kiện",
      variant: "default",
    })
    
    onOpenChange(false)
  }

  const handleConfirmQualified = () => {
    if (!routeId || !transportOrderCode || !departureDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    const codePattern = /^VL\d{4}-\d{6}$/
    if (!codePattern.test(transportOrderCode)) {
      toast({
        title: "Lỗi",
        description: "Mã vận lệnh không đúng format (VD: VL2024-000001)",
        variant: "destructive",
      })
      return
    }

    const departureDateTime = otherDepartureTimeChecked && otherDepartureTime
      ? new Date(otherDepartureTime)
      : new Date(`${departureDate}T${scheduleTime}`)

    updateVehicle(vehicleId, {
      status: 'granted',
      driver: driverId ? drivers.find(d => d.id === driverId) : undefined,
      route: selectedRoute,
      transportOrderCode,
      qualificationStatus: 'qualified',
      expectedDeparture: departureDateTime,
    })

    addTransaction({
      id: Date.now().toString(),
      type: 'entry',
      vehicleId: vehicle.id,
      driverId: driverId || undefined,
      routeId: routeId || undefined,
      passengers: Number(seats),
      status: 'completed',
      createdAt: new Date(),
      performedBy: 'user1',
    })

    toast({
      title: "Thành công",
      description: `Đã cấp phép lên nốt cho xe ${vehicle.licensePlate}`,
      variant: "success",
    })

    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90rem] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-xl font-bold">Cấp phép lên nốt</h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              HỦY
            </Button>
            <Button
              variant="destructive"
              onClick={handleMarkNotQualified}
            >
              KHÔNG ĐỦ ĐIỀU KIỆN
            </Button>
            <Button
              onClick={handleConfirmQualified}
              className="bg-green-600 hover:bg-green-700"
              disabled={!allDocumentsValid}
            >
              ĐỦ ĐIỀU KIỆN
            </Button>
          </div>
        </div>

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-3 gap-6 py-4">
          {/* Left Panel - Form (2/3 width) */}
          <div className="col-span-2 space-y-6">
            {/* Section: Thông tin chuyến đi */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin chuyến đi</h3>
              
              {/* Row 1 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permitType">Loại cấp phép</Label>
                  <Select value={permitType} onValueChange={setPermitType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Cố định</SelectItem>
                      <SelectItem value="flexible">Linh hoạt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entryTime">Giờ vào bến</Label>
                  <Input
                    id="entryTime"
                    value={format(new Date(vehicle.entryTime), 'HH:mm dd/MM/yyyy')}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportOrderCode">Mã lệnh vận chuyển (*)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="transportOrderCode"
                      placeholder="VL2024-000001"
                      value={transportOrderCode}
                      onChange={(e) => setTransportOrderCode(e.target.value)}
                      required
                    />
                    {transportOrderCode && /^VL\d{4}-\d{6}$/.test(transportOrderCode) && (
                      <Check className="h-5 w-5 text-green-500 mt-2" />
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">Biển số đăng ký</Label>
                  <Input
                    id="licensePlate"
                    value={vehicle.licensePlate}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replacementVehicle">Chọn xe được đi thay</Label>
                  <Select 
                    value={replacementVehicle || ''} 
                    onValueChange={(value) => setReplacementVehicle(value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.filter(v => v.id !== vehicleId).map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seats">Số ghế</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beds">Số giường</Label>
                  <Input
                    id="beds"
                    type="number"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hhTickets">Số vé HH</Label>
                  <Input
                    id="hhTickets"
                    type="number"
                    value={hhTickets}
                    onChange={(e) => setHhTickets(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hhPercent">(%) HH</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="hhPercent"
                      type="number"
                      value={hhPercent}
                      onChange={(e) => setHhPercent(e.target.value)}
                      className="flex-1"
                    />
                    <Checkbox
                      checked={hhPercentChecked}
                      onCheckedChange={(checked) => setHhPercentChecked(checked === true)}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="entryPlate">Biển số khi vào</Label>
                    <Checkbox
                      checked={entryPlateChecked}
                      onCheckedChange={(checked) => setEntryPlateChecked(checked === true)}
                    />
                  </div>
                  <Input
                    id="entryPlate"
                    value={vehicle.licensePlate}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Đơn vị vận tải</Label>
                  <Input
                    id="company"
                    value={vehicle.company}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="route">Tuyến vận chuyển (*)</Label>
                  <Select 
                    value={routeId || ''} 
                    onValueChange={(value) => setRouteId(value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tuyến vận chuyển (*)" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.name} ({route.distance} Km)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduleTime">Biểu đồ giờ (*)</Label>
                  <Select value={scheduleTime} onValueChange={setScheduleTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00:00">06:00:00</SelectItem>
                      <SelectItem value="08:00:00">08:00:00</SelectItem>
                      <SelectItem value="10:00:00">10:00:00</SelectItem>
                      <SelectItem value="12:00:00">12:00:00</SelectItem>
                      <SelectItem value="14:00:00">14:00:00</SelectItem>
                      <SelectItem value="16:00:00">16:00:00</SelectItem>
                      <SelectItem value="17:00:00">17:00:00</SelectItem>
                      <SelectItem value="18:00:00">18:00:00</SelectItem>
                      <SelectItem value="20:00:00">20:00:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="otherDepartureTime">Giờ xuất bến khác</Label>
                    <Checkbox
                      checked={otherDepartureTimeChecked}
                      onCheckedChange={(checked) => setOtherDepartureTimeChecked(checked === true)}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      id="otherDepartureTime"
                      type="datetime-local"
                      value={otherDepartureTime}
                      onChange={(e) => setOtherDepartureTime(e.target.value)}
                      disabled={!otherDepartureTimeChecked}
                      className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Ngày xuất bến (*)</Label>
                  <div className="relative">
                    <Input
                      id="departureDate"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Lái xe */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Lái xe</h3>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="border-2 border-dashed border-muted rounded-lg h-32 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Không có dữ liệu!</p>
              </div>
            </div>

            {/* Section: Dịch vụ */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Dịch vụ</h3>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="border-2 border-dashed border-muted rounded-lg h-32 flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Không có dữ liệu!</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <Label className="font-semibold">Thành tiền (VND)</Label>
                <span className="text-lg font-bold">{new Intl.NumberFormat('vi-VN').format(serviceTotal)}</span>
              </div>
            </div>
          </div>

          {/* Right Panel (1/3 width) */}
          <div className="space-y-4">
            {/* Ảnh xe vào bến */}
            <div className="space-y-2">
              <div className="border-2 border-dashed border-muted rounded-lg h-64 flex items-center justify-center bg-muted/20 relative">
                <p className="text-muted-foreground text-sm">Ảnh xe vào bến</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  title="Xem ảnh tiếp theo"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Điều kiện thông tin xe */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Điều kiện thông tin xe</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => setShowEditDocumentsDialog(true)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                  {allDocumentsValid ? (
                    <>
                      <Check className="h-4 w-4" />
                      Giấy tờ đủ điều kiện
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      Giấy tờ không đủ điều kiện
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Kiểm tra GSHT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Kiểm tra GSHT</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded border">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-blue-600">(Chưa đăng nhập)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-blue-600">(Chưa đăng nhập)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-blue-600">(Chưa đăng nhập)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded border">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-blue-600">(Chưa đăng nhập)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Dialog chọn lý do - Render outside to avoid nested dialogs */}
      <ChonLyDoKhongDuDieuKienDialog
        open={showReasonDialog}
        onOpenChange={setShowReasonDialog}
        onConfirm={handleConfirmReason}
      />

      {/* Dialog sửa hiệu lực giấy tờ */}
      <SuaHieuLucGiayToDialog
        open={showEditDocumentsDialog}
        onOpenChange={setShowEditDocumentsDialog}
        vehicle={vehicle}
        onSave={(updatedDocs) => {
          updateVehicle(vehicleId, { documents: updatedDocs })
          toast({
            title: "Thành công",
            description: "Đã cập nhật hiệu lực giấy tờ",
            variant: "success",
          })
        }}
      />
    </Dialog>
  )
}
