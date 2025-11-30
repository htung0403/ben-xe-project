import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'

export function XacNhanThanhToanPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const navigate = useNavigate()
  const { vehicles, updateVehicle, addInvoice } = useStore()
  const { toast } = useToast()
  
  const vehicle = vehicles.find(v => v.id === vehicleId)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [paymentSymbol, setPaymentSymbol] = useState('QLBX')
  const [print1Copy, setPrint1Copy] = useState(true)
  const [print2Copies, setPrint2Copies] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (vehicle) {
      const entryDateTime = format(new Date(vehicle.entryTime), 'dd/MM/yyyy HH:mm')
      setNote(`Đơn hàng điều độ (${entryDateTime})`)
      // Expand the order by default
      const orderCode = vehicle.transportOrderCode || `2202221516564ZHWU`
      setExpandedOrders(new Set([orderCode]))
    }
  }, [vehicle])

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Không tìm thấy thông tin xe</p>
      </div>
    )
  }

  // Mock service items based on the image
  const orderCode = vehicle.transportOrderCode || `2202221516564ZHWU`
  const orderDate = format(new Date(vehicle.entryTime), 'dd/MM/yyyy')
  
  const serviceItems = [
    {
      id: '1',
      service: 'Dịch vụ cho thuê nơi...',
      unitPrice: 15000,
      quantity: 1,
      discount: 0,
      discountPercent: 0,
      taxPercent: 0,
      amount: 15000,
      debt: false,
    },
    {
      id: '2',
      service: 'Dịch vụ xe ra vào bến',
      unitPrice: 251600,
      quantity: 1,
      discount: 0,
      discountPercent: 0,
      taxPercent: 0,
      amount: 251600,
      debt: false,
    },
    {
      id: '3',
      service: 'Dịch vụ bán vé',
      unitPrice: 183400,
      quantity: 1,
      discount: 0,
      discountPercent: 0,
      taxPercent: 0,
      amount: 183400,
      debt: false,
    },
  ]

  const totalAmount = serviceItems.reduce((sum, item) => sum + item.amount, 0)
  const totalDiscount = serviceItems.reduce((sum, item) => sum + item.discount, 0)
  const totalTax = useMemo(() => {
    return serviceItems.reduce((sum, item) => {
      return sum + (item.amount * item.taxPercent / 100)
    }, 0)
  }, [serviceItems])
  const actualAmount = totalAmount - totalDiscount + totalTax

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const handleCancel = () => {
    navigate('/dieu-do')
  }

  const handlePayment = () => {
    // Update vehicle status
    updateVehicle(vehicleId!, {
      status: 'paid',
      payments: [
        {
          id: Date.now().toString(),
          vehicleId: vehicleId!,
          amount: actualAmount,
          method: 'cash',
          status: 'completed',
          createdAt: new Date(),
        },
      ],
    })

    // Create invoice
    const invoice = {
      id: `inv-${Date.now()}`,
      code: orderCode,
      vehicleId: vehicleId!,
      customerName: vehicle.driver?.name || vehicle.company,
      customerTaxCode: '5600269234',
      customerAddress: '518 - tổ 21 - Phường Him Lam - Điện Biên',
      items: serviceItems.map((item) => ({
        id: item.id,
        service: item.service,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        amount: item.amount,
      })),
      subtotal: totalAmount,
      tax: totalTax,
      total: actualAmount,
      status: 'paid' as const,
      createdAt: new Date(),
      paidAt: new Date(),
    }

    addInvoice(invoice)

    toast({
      title: "Thanh toán thành công",
      description: `Đã thanh toán ${new Intl.NumberFormat('vi-VN').format(actualAmount)}đ cho xe ${vehicle.licensePlate}`,
      variant: "success",
    })

    navigate('/dieu-do')
  }

  const controlSheetId = '27B-00020'
  const routeName = vehicle.route?.name || 'BX TP Điện Biên Phủ - Bắc Giang (2798.1111.A)'
  const entryTime = format(new Date(vehicle.entryTime), 'HH:mm dd/MM/yyyy')
  const seats = vehicle.seats || 2
  const beds = 41 // Mock data
  const plannedDeparture = vehicle.expectedDeparture 
    ? format(new Date(vehicle.expectedDeparture), 'HH:mm dd/MM/yyyy')
    : '16:00 22/02/2022'

  const buyerName = vehicle.driver?.name || 'Lê Thế Hà'
  const carrierName = vehicle.company || 'Công ty TNHH Long Giang'
  const taxCode = '5600269234'
  const address = '518 - tổ 21 - Phường Him Lam - Điện Biên'

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumb */}
      <div className="mb-4 pb-4 border-b">
        <p className="text-sm text-muted-foreground">Quản lý đơn hàng &gt; Thanh toán</p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
        {/* Left and Center: Service List and Control Sheet */}
        <div className="col-span-2 flex flex-col gap-6 overflow-y-auto">
          {/* Title */}
          <h1 className="text-2xl font-bold">Xác nhận thanh toán</h1>

          {/* Service List Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách dịch vụ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Dịch vụ</TableHead>
                    <TableHead className="text-right">Đơn giá (đ)</TableHead>
                    <TableHead className="text-right">Số lượng</TableHead>
                    <TableHead className="text-right">Chiết khấu (đ)</TableHead>
                    <TableHead className="text-right">Chiết khấu (%)</TableHead>
                    <TableHead className="text-right">Phần trăm thuế (%)</TableHead>
                    <TableHead className="text-right">Thành tiền (đ)</TableHead>
                    <TableHead className="text-center">Nợ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Collapsible Order Row */}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={9} className="p-0">
                      <button
                        onClick={() => toggleOrder(orderCode)}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/70"
                      >
                        <span className="font-medium">
                          Mã đơn hàng: {orderCode} ({orderDate})
                        </span>
                        {expandedOrders.has(orderCode) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>

                  {/* Service Items */}
                  {expandedOrders.has(orderCode) && serviceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.service}
                          <span className="text-blue-500">●</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('vi-VN').format(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('vi-VN').format(item.discount)}
                      </TableCell>
                      <TableCell className="text-right">{item.discountPercent}%</TableCell>
                      <TableCell className="text-right">{item.taxPercent}%</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('vi-VN').format(item.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={item.debt} />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Total Row */}
                  {expandedOrders.has(orderCode) && (
                    <TableRow className="font-bold">
                      <TableCell colSpan={7} className="text-right">Tổng tiền</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('vi-VN').format(totalAmount)}₫
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Control Sheet */}
          <Card>
            <CardHeader>
              <CardTitle>Biên kiểm soát</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Biến kiểm soát:</Label>
                  <p className="font-medium">{controlSheetId}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Tuyến vận chuyển:</Label>
                  <p className="font-medium">{routeName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Giờ vào bến:</Label>
                  <p className="font-medium">{entryTime}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Số ghế | Số giường:</Label>
                  <p className="font-medium">{seats} | {beds}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Giờ xuất bến kế hoạch:</Label>
                  <p className="font-medium">{plannedDeparture}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="destructive" onClick={handleCancel}>
              HỦY THANH TOÁN
            </Button>
            <Button variant="outline">
              LỊCH SỬ XE TRẢ KHÁCH
            </Button>
            <Button variant="outline">
              LỊCH SỬ XE RA VÀO BẾN
            </Button>
          </div>
        </div>

        {/* Right Sidebar: Payment */}
        <div className="flex flex-col gap-6 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Symbol */}
              <div className="space-y-2">
                <Label>Ký hiệu:</Label>
                <Select value={paymentSymbol} onValueChange={setPaymentSymbol}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QLBX">QLBX</SelectItem>
                    <SelectItem value="KHAC">KHAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Đơn hàng điều độ (22/02/2022 15:16)"
                  rows={3}
                />
              </div>

              {/* Customer Info */}
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <Label className="text-sm text-muted-foreground">Người mua:</Label>
                  <p className="font-medium">{buyerName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Đơn vị vận tải:</Label>
                  <p className="font-medium">{carrierName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mã số thuế:</Label>
                  <p className="font-medium">{taxCode}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Địa chỉ:</Label>
                  <p className="font-medium">{address}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <Label className="text-sm text-muted-foreground">Tổng tiền:</Label>
                  <p className="font-medium">{new Intl.NumberFormat('vi-VN').format(totalAmount)} đồng</p>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm text-muted-foreground">Chiết khấu:</Label>
                  <p className="font-medium">{new Intl.NumberFormat('vi-VN').format(totalDiscount)} đồng</p>
                </div>
                <div className="flex justify-between">
                  <Label className="text-sm text-muted-foreground">Tiền thuế GTGT:</Label>
                  <p className="font-medium">{new Intl.NumberFormat('vi-VN').format(totalTax)} đồng</p>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <Label className="text-sm font-semibold">Thực thu:</Label>
                  <p className="font-bold text-lg">{new Intl.NumberFormat('vi-VN').format(actualAmount)} đồng</p>
                </div>
              </div>

              {/* Print Options */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print1"
                    checked={print1Copy}
                    onCheckedChange={(checked) => setPrint1Copy(checked as boolean)}
                  />
                  <Label htmlFor="print1" className="cursor-pointer">In 1 liên</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print2"
                    checked={print2Copies}
                    onCheckedChange={(checked) => setPrint2Copies(checked as boolean)}
                  />
                  <Label htmlFor="print2" className="cursor-pointer">In 2 liên</Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Button variant="outline" className="w-full">
                  XEM TRƯỚC BẢN IN
                </Button>
                <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700">
                  THANH TOÁN
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

