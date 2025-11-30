import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Mail, Calendar } from 'lucide-react'

const reportTypes = [
  'Bảng kê hóa đơn',
  'Báo cáo tổng hợp',
  'Nhật trình xe',
  'Xe đi thay',
  'Xe không đủ điều kiện',
  'Xe ra vào bến',
  'Xe tăng cường',
  'Xe trả khách',
  'Lịch sử hủy đơn',
]

export function BaoCao() {
  const [selectedReport, setSelectedReport] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Báo cáo</h1>
        <p className="text-muted-foreground">Xem và xuất các loại báo cáo</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Loại báo cáo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {reportTypes.map((type) => (
              <Button
                key={type}
                variant={selectedReport === type ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedReport(type)}
              >
                {type}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedReport || 'Chọn loại báo cáo'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Từ ngày</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">Đến ngày</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            {selectedReport && (
              <div className="flex gap-2">
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Xem báo cáo
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi email
                </Button>
              </div>
            )}

            {selectedReport && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Báo cáo sẽ hiển thị tại đây sau khi chọn khoảng thời gian và nhấn "Xem báo cáo"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

