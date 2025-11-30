import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Printer, Mail } from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function HoaDon() {
  const { invoices } = useStore()
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  const invoice = selectedInvoice ? invoices.find(inv => inv.id === selectedInvoice) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hóa đơn điện tử</h1>
          <p className="text-muted-foreground">Quản lý hóa đơn điện tử</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo hóa đơn mới
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã hóa đơn</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Biển số xe</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Chưa có hóa đơn nào
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.code}</TableCell>
                <TableCell>
                  {format(new Date(inv.createdAt), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>{inv.vehicleId}</TableCell>
                <TableCell>{inv.customerName}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('vi-VN').format(inv.total)}đ
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.status === 'paid' ? 'success' :
                      inv.status === 'pending' ? 'warning' : 'destructive'
                    }
                  >
                    {inv.status === 'paid' ? 'Đã thanh toán' :
                     inv.status === 'pending' ? 'Chờ thanh toán' : 'Đã hủy'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInvoice(inv.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {invoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết hóa đơn {invoice.code}</DialogTitle>
              <DialogDescription>
                Thông tin đầy đủ về hóa đơn
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Khách hàng:</p>
                  <p>{invoice.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ngày tạo:</p>
                  <p>{format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>
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
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.service}</TableCell>
                      <TableCell>{new Intl.NumberFormat('vi-VN').format(item.unitPrice)}đ</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('vi-VN').format(item.amount)}đ
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell colSpan={3}>TỔNG CỘNG</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('vi-VN').format(invoice.total)}đ
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

