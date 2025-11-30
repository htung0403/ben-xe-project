import { useState } from 'react'
import { useStore } from '@/store/useStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

interface ThanhToanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleId: string
}

const feeItems = [
  { service: 'Phí vào bến', unitPrice: 50000, quantity: 1 },
  { service: 'Phí quản lý', unitPrice: 30000, quantity: 1 },
  { service: 'Phí vệ sinh', unitPrice: 20000, quantity: 1 },
]

export function ThanhToanDialog({ open, onOpenChange, vehicleId }: ThanhToanDialogProps) {
  const { vehicles, updateVehicle, addInvoice } = useStore()
  const { toast } = useToast()
  const vehicle = vehicles.find(v => v.id === vehicleId)
  
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card'>('cash')

  if (!vehicle) return null

  const total = feeItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const handlePayment = () => {
    // Update vehicle status
    updateVehicle(vehicleId, {
      status: 'paid',
      payments: [
        {
          id: Date.now().toString(),
          vehicleId,
          amount: total,
          method: paymentMethod,
          status: 'completed',
          createdAt: new Date(),
        },
      ],
    })

    // Create invoice
    const invoice = {
      id: `inv-${Date.now()}`,
      code: `HD-${String(Date.now()).slice(-6)}`,
      vehicleId,
      customerName: vehicle.company,
      items: feeItems.map((item, index) => ({
        id: `item-${index}`,
        service: item.service,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        amount: item.unitPrice * item.quantity,
      })),
      subtotal: total,
      tax: 0,
      total,
      status: 'paid' as const,
      createdAt: new Date(),
      paidAt: new Date(),
    }

    addInvoice(invoice)

    toast({
      title: "Thanh toán thành công",
      description: `Đã thanh toán ${new Intl.NumberFormat('vi-VN').format(total)}đ cho xe ${vehicle.licensePlate}`,
      variant: "success",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thanh toán</DialogTitle>
          <DialogDescription>
            Thanh toán phí dịch vụ cho xe {vehicle.licensePlate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Fee Details Table */}
          <div>
            <h3 className="font-semibold mb-3">Chi tiết phí</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN').format(item.unitPrice)}đ
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('vi-VN').format(item.unitPrice * item.quantity)}đ
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell colSpan={3}>TỔNG CỘNG</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('vi-VN').format(total)}đ
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Phương thức thanh toán</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="cursor-pointer">Tiền mặt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="cursor-pointer">Chuyển khoản</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="cursor-pointer">Thẻ</Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'transfer' && (
              <div className="p-4 bg-muted rounded-md space-y-2">
                <p className="text-sm"><strong>Thông tin tài khoản:</strong></p>
                <p className="text-sm">Số TK: 1234567890</p>
                <p className="text-sm">Ngân hàng: Vietcombank</p>
                <p className="text-sm">Chủ TK: Bến Xe Trung Tâm</p>
                <p className="text-sm">Nội dung: {vehicle.licensePlate}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="outline" onClick={() => {
            toast({
              title: "In hóa đơn tạm",
              description: "Đã tạo hóa đơn tạm",
            })
          }}>
            In hóa đơn tạm
          </Button>
          <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700">
            Xác nhận thanh toán
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

