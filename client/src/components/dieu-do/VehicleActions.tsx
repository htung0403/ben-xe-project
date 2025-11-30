import type { Vehicle } from '@/types'
import { Button } from '@/components/ui/button'
import { Users, FileCheck, CreditCard, FileText, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface VehicleActionsProps {
  vehicle: Vehicle
  onAction: (action: string) => void
}

export function VehicleActions({ vehicle, onAction }: VehicleActionsProps) {
  const getAvailableActions = () => {
    const actions: Array<{ id: string; label: string; icon: any }> = []

    if (vehicle.status === 'in_station') {
      actions.push({ id: 'xe-tra-khach', label: 'Xe trả khách', icon: Users })
      actions.push({ id: 'cap-phep', label: 'Cấp phép lên nốt', icon: FileCheck })
    }

    if (vehicle.status === 'granted' && vehicle.qualificationStatus === 'qualified') {
      actions.push({ id: 'thanh-toan', label: 'Thanh toán', icon: CreditCard })
    }

    if (vehicle.status === 'paid' && vehicle.qualificationStatus === 'qualified') {
      actions.push({ id: 'cap-lenh', label: 'Cấp lệnh xuất bến', icon: FileText })
    }

    if (vehicle.status === 'ready_depart') {
      actions.push({ id: 'cho-xe-ra', label: 'Cho xe ra bến', icon: LogOut })
    }

    if (vehicle.qualificationStatus === 'not_qualified') {
      actions.push({ id: 'cho-xe-ra', label: 'Cho xe ra bến', icon: LogOut })
    }

    return actions
  }

  const actions = getAvailableActions()

  if (actions.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  if (actions.length === 1) {
    const action = actions[0]
    const Icon = action.icon
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction(action.id)}
      >
        <Icon className="h-4 w-4 mr-2" />
        {action.label}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          Hành động
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <DropdownMenuItem
              key={action.id}
              onClick={() => onAction(action.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

