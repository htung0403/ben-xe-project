import { useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Bus, TrendingUp, DollarSign, AlertTriangle, Plus, FileText, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function Dashboard() {
  const { vehicles, transactions, invoices } = useStore()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const inStation = vehicles.filter(v => v.status === 'in_station').length
    const todayExits = vehicles.filter(v => {
      if (v.exitTime) {
        const today = new Date()
        return v.exitTime.toDateString() === today.toDateString()
      }
      return false
    }).length
    const todayRevenue = invoices
      .filter(inv => {
        const today = new Date()
        return inv.paidAt && new Date(inv.paidAt).toDateString() === today.toDateString()
      })
      .reduce((sum, inv) => sum + inv.total, 0)
    const pending = vehicles.filter(v => v.status === 'in_station' || v.status === 'granted').length

    return { inStation, todayExits, todayRevenue, pending }
  }, [vehicles, invoices])

  // Chart data - last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const entryExitData = last7Days.map(date => {
    const entries = vehicles.filter(v => {
      const entryDate = new Date(v.entryTime)
      return entryDate.toDateString() === date.toDateString()
    }).length
    const exits = vehicles.filter(v => {
      if (v.exitTime) {
        const exitDate = new Date(v.exitTime)
        return exitDate.toDateString() === date.toDateString()
      }
      return false
    }).length
    return {
      date: format(date, 'dd/MM'),
      'Vào bến': entries,
      'Ra bến': exits,
    }
  })

  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const revenue = invoices
      .filter(inv => {
        if (inv.paidAt) {
          const paidDate = new Date(inv.paidAt)
          return paidDate.toDateString() === date.toDateString()
        }
        return false
      })
      .reduce((sum, inv) => sum + inv.total, 0)
    return {
      date: format(date, 'dd/MM'),
      'Doanh thu': revenue,
    }
  })

  const routeDistribution = useMemo(() => {
    const routeCounts: Record<string, number> = {}
    vehicles.forEach(v => {
      if (v.route) {
        routeCounts[v.route.name] = (routeCounts[v.route.name] || 0) + 1
      }
    })
    return Object.entries(routeCounts).map(([name, value]) => ({ name, value }))
  }, [vehicles])

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trang chủ</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động bến xe</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/dieu-do')}>
            <Plus className="h-4 w-4 mr-2" />
            Cho xe vào bến
          </Button>
          <Button variant="outline" onClick={() => navigate('/bao-cao')}>
            <FileText className="h-4 w-4 mr-2" />
            Xem báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng xe trong bến</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inStation}</div>
            <p className="text-xs text-muted-foreground">Xe đang chờ xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xe đã xuất bến hôm nay</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayExits}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% so với hôm qua
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(stats.todayRevenue)}đ
            </div>
            <p className="text-xs text-muted-foreground">Tổng thu từ các giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xe chờ xử lý</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            {stats.pending > 5 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Cần xử lý ngay
              </p>
            )}
            {stats.pending <= 5 && (
              <p className="text-xs text-muted-foreground">Trong giới hạn cho phép</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lượng xe ra vào bến (7 ngày)</CardTitle>
            <CardDescription>Biểu đồ theo dõi hoạt động</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={entryExitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Vào bến" stroke="#2563eb" />
                <Line type="monotone" dataKey="Ra bến" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tuần</CardTitle>
            <CardDescription>Biểu đồ doanh thu 7 ngày gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(Number(value)) + 'đ'} />
                <Bar dataKey="Doanh thu" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố xe theo tuyến đường</CardTitle>
            <CardDescription>Tỷ lệ xe theo từng tuyến</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={routeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {routeDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>10 giao dịch mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Biển số xe</TableHead>
                  <TableHead>Tuyến đường</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.createdAt), 'HH:mm dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.vehicle?.licensePlate}
                    </TableCell>
                    <TableCell>{transaction.route?.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={
                        transaction.status === 'completed' ? 'success' :
                        transaction.status === 'pending' ? 'warning' : 'destructive'
                      }>
                        {transaction.status === 'completed' ? 'Hoàn thành' :
                         transaction.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

