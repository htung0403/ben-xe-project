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

interface CapLenhXuatBenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleId: string
}

export function CapLenhXuatBenDialog({ open, onOpenChange, vehicleId }: CapLenhXuatBenDialogProps) {
  const { vehicles, updateVehicle } = useStore()
  const { toast } = useToast()
  const vehicle = vehicles.find(v => v.id === vehicleId)
  
  const [passengers, setPassengers] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (vehicle) {
      setPassengers(vehicle.passengers || 0)
    }
  }, [vehicle])

  if (!vehicle) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    updateVehicle(vehicleId, {
      status: 'ready_depart',
      passengers: Number(passengers),
      notes,
    })

    toast({
      title: "Thành công",
      description: `Đã cấp lệnh xuất bến cho xe ${vehicle.licensePlate}`,
      variant: "success",
    })

    // In a real app, you'd generate and show PDF preview here
    toast({
      title: "Lệnh xuất bến",
      description: "Đã tạo lệnh xuất bến (PDF)",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cấp lệnh xuất bến</DialogTitle>
          <DialogDescription>
            Cấp lệnh xuất bến cho xe {vehicle.licensePlate}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="passengers">
                Số khách xuất bến * (Mặc định: {vehicle.passengers})
              </Label>
              <Input
                id="passengers"
                type="number"
                min="0"
                max={vehicle.seats}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                required
              />
              <p className="text-sm text-muted-foreground">
                Có thể điều chỉnh nếu có khách hủy hoặc thêm khách
              </p>
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
            <Button type="submit">Cấp lệnh xuất bến</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

