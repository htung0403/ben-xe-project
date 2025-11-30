import { useState, useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'

interface ChoXeRaBenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleId: string
}

export function ChoXeRaBenDialog({ open, onOpenChange, vehicleId }: ChoXeRaBenDialogProps) {
  const { vehicles, updateVehicle, addTransaction } = useStore()
  const { toast } = useToast()
  const vehicle = vehicles.find(v => v.id === vehicleId)
  
  const [exitTime, setExitTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [passengers, setPassengers] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (vehicle) {
      setPassengers(vehicle.passengers || 0)
    }
  }, [vehicle])

  if (!vehicle) return null

  const isNotQualified = vehicle.qualificationStatus === 'not_qualified'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const exitDate = new Date(exitTime)
    
    // Add transaction
    addTransaction({
      id: Date.now().toString(),
      type: 'exit',
      vehicleId: vehicle.id,
      driverId: vehicle.driver?.id,
      routeId: vehicle.route?.id,
      passengers: isNotQualified ? 0 : Number(passengers),
      amount: vehicle.payments.reduce((sum, p) => sum + p.amount, 0),
      status: 'completed',
      createdAt: exitDate,
      notes,
      performedBy: 'user1',
    })

    // Update vehicle
    updateVehicle(vehicleId, {
      status: 'departed',
      exitTime: exitDate,
      passengers: isNotQualified ? 0 : Number(passengers),
      notes,
    })

    // Remove from active list after a delay (in real app, you'd move to history)
    setTimeout(() => {
      // In a real app, you'd archive this instead of removing
      // removeVehicle(vehicleId)
    }, 1000)

    toast({
      title: "Thành công",
      description: `Xe ${vehicle.licensePlate} đã xuất bến lúc ${format(exitDate, 'HH:mm dd/MM/yyyy')}`,
      variant: "success",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cho xe ra bến</DialogTitle>
          <DialogDescription>
            Xác nhận xe {vehicle.licensePlate} xuất bến
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exitTime">Thời gian ra bến *</Label>
              <Input
                id="exitTime"
                type="datetime-local"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengers">
                Số khách xuất bến *
                {isNotQualified && <span className="text-muted-foreground ml-2">(Không đủ điều kiện: 0)</span>}
              </Label>
              <Input
                id="passengers"
                type="number"
                min="0"
                max={vehicle.seats}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                required
                disabled={isNotQualified}
              />
              {!isNotQualified && (
                <p className="text-sm text-muted-foreground">
                  Số khách đã đăng ký: {vehicle.passengers}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                placeholder="Nhập ghi chú (nếu có)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Xác nhận xuất bến</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

