import type { Vehicle } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bus, FileText, Home, Route, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

interface VehicleCardProps {
  vehicle: Vehicle
  onAction: (action: string, vehicleId: string) => void
}

export function VehicleCard({ vehicle, onAction }: VehicleCardProps) {
  const isReadyDepart = vehicle.status === 'ready_depart'

  return (
    <Card className="p-3 mb-3 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        {/* Header with license plate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isReadyDepart && (
              <Bus className="h-4 w-4 text-green-500" />
            )}
            <span className="font-semibold text-sm">{vehicle.licensePlate}</span>
          </div>
        </div>

        {/* Entry time */}
        <div className="text-xs text-muted-foreground">
          {format(new Date(vehicle.entryTime), 'HH:mm dd/MM/yyyy')}
        </div>

        {/* Detailed info for ready_depart status */}
        {isReadyDepart && vehicle.route && (
          <div className="space-y-1.5 pt-2 border-t">
            <div className="flex items-center gap-2 text-xs">
              <Route className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate">{vehicle.route.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{vehicle.transportOrderCode || '1'}</span>
            </div>
            {vehicle.expectedDeparture && (
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{format(new Date(vehicle.expectedDeparture), 'HH:mm dd/MM/yyyy')}</span>
              </div>
            )}
            {vehicle.driver && (
              <div className="flex items-center gap-2 text-xs">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{vehicle.driver.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          {vehicle.status === 'in_station' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onAction('xe-tra-khach', vehicle.id)}
                title="Xe trả khách"
              >
                <Bus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onAction('cap-phep', vehicle.id)}
                title="Cấp phép lên nốt"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onAction('cho-xe-vao', vehicle.id)}
                title="Cho xe vào bến"
              >
                <Home className="h-4 w-4" />
              </Button>
            </>
          )}
          {vehicle.status === 'granted' && vehicle.qualificationStatus === 'qualified' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onAction('thanh-toan', vehicle.id)}
              title="Thanh toán"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}
          {vehicle.status === 'paid' && vehicle.qualificationStatus === 'qualified' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onAction('cap-lenh', vehicle.id)}
              title="Cấp lệnh xuất bến"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}
          {vehicle.status === 'ready_depart' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onAction('cho-xe-ra', vehicle.id)}
              title="Cho xe ra bến"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

