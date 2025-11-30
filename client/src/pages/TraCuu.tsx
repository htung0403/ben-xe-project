import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search } from 'lucide-react'
import { format } from 'date-fns'

export function TraCuu() {
  const { vehicles, drivers, routes } = useStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVehicles = vehicles.filter(v =>
    v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDrivers = drivers.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone.includes(searchTerm)
  )

  const filteredRoutes = routes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.to.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tra cứu thông tin</h1>
        <p className="text-muted-foreground">Tìm kiếm thông tin xe, lái xe, tuyến đường</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList>
          <TabsTrigger value="vehicles">Tra cứu xe</TabsTrigger>
          <TabsTrigger value="drivers">Tra cứu lái xe</TabsTrigger>
          <TabsTrigger value="routes">Tra cứu tuyến đường</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biển số xe</TableHead>
                <TableHead>Loại xe</TableHead>
                <TableHead>Số ghế</TableHead>
                <TableHead>Nhà xe</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.seats}</TableCell>
                  <TableCell>{vehicle.company}</TableCell>
                  <TableCell>{vehicle.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="drivers" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>GPLX</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Ngày hết hạn GPLX</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.license}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>
                    {format(new Date(driver.licenseExpiry), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{driver.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="routes" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên tuyến</TableHead>
                <TableHead>Điểm đi</TableHead>
                <TableHead>Điểm đến</TableHead>
                <TableHead>Quãng đường (km)</TableHead>
                <TableHead>Thời gian (giờ)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>{route.from}</TableCell>
                  <TableCell>{route.to}</TableCell>
                  <TableCell>{route.distance}</TableCell>
                  <TableCell>{route.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

