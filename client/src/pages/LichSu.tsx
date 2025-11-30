import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download } from 'lucide-react'
import { format } from 'date-fns'

export function LichSu() {
  const { transactions } = useStore()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)

  const filteredTransactions = transactions.filter(t => {
    if (dateFrom && new Date(t.createdAt) < new Date(dateFrom)) return false
    if (dateTo && new Date(t.createdAt) > new Date(dateTo)) return false
    if (typeFilter && typeFilter !== 'all' && t.type !== typeFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
          <p className="text-muted-foreground">Xem và tra cứu lịch sử giao dịch</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
      </div>

      <div className="flex gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Từ ngày</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Đến ngày</label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Loại giao dịch</label>
          <Select value={typeFilter || 'all'} onValueChange={(value) => setTypeFilter(value === 'all' ? undefined : value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="entry">Vào bến</SelectItem>
              <SelectItem value="exit">Ra bến</SelectItem>
              <SelectItem value="payment">Thanh toán</SelectItem>
              <SelectItem value="cancel">Hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(dateFrom || dateTo || typeFilter) && (
          <Button variant="outline" onClick={() => {
            setDateFrom('')
            setDateTo('')
            setTypeFilter(undefined)
          }}>
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Loại giao dịch</TableHead>
            <TableHead>Biển số xe</TableHead>
            <TableHead>Lái xe</TableHead>
            <TableHead>Tuyến đường</TableHead>
            <TableHead>Số khách</TableHead>
            <TableHead>Doanh thu</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                Không có giao dịch nào
              </TableCell>
            </TableRow>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <TableRow key={transaction.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {transaction.type === 'entry' ? 'Vào bến' :
                   transaction.type === 'exit' ? 'Ra bến' :
                   transaction.type === 'payment' ? 'Thanh toán' : 'Hủy'}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.vehicle?.licensePlate || transaction.vehicleId}
                </TableCell>
                <TableCell>{transaction.driver?.name || '-'}</TableCell>
                <TableCell>{transaction.route?.name || '-'}</TableCell>
                <TableCell>{transaction.passengers}</TableCell>
                <TableCell>
                  {transaction.amount ? new Intl.NumberFormat('vi-VN').format(transaction.amount) + 'đ' : '-'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === 'completed' ? 'success' :
                      transaction.status === 'pending' ? 'warning' : 'destructive'
                    }
                  >
                    {transaction.status === 'completed' ? 'Hoàn thành' :
                     transaction.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

