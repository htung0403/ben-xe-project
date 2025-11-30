import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/types'

interface SuaHieuLucGiayToDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: Vehicle | null
  onSave: (documents: Vehicle['documents']) => void
}

export function SuaHieuLucGiayToDialog({
  open,
  onOpenChange,
  vehicle,
  onSave,
}: SuaHieuLucGiayToDialogProps) {
  const [documents, setDocuments] = useState<Vehicle['documents']>([])
  const [selectedDates, setSelectedDates] = useState<Record<string, Date | undefined>>({})

  useEffect(() => {
    if (vehicle) {
      setDocuments(vehicle.documents)
      // Initialize selected dates
      const dates: Record<string, Date> = {}
      vehicle.documents.forEach((doc) => {
        dates[doc.id] = new Date(doc.expiryDate)
      })
      setSelectedDates(dates)
    }
  }, [vehicle])

  if (!vehicle) return null

  const handleDateSelect = (docId: string, date: Date | undefined) => {
    if (!date) return

    setSelectedDates((prev) => ({
      ...prev,
      [docId]: date,
    }))

    const isValid = date > new Date()
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            expiryDate: date,
            status: isValid ? 'valid' : 'expired',
          }
        }
        return doc
      })
    )
  }

  const handleSave = () => {
    onSave(documents)
    onOpenChange(false)
  }

  const handleCancel = () => {
    if (vehicle) {
      setDocuments(vehicle.documents)
    }
    onOpenChange(false)
  }

  const documentFields = [
    { key: 'dang_ky_xe', label: 'Đăng ký xe (*)' },
    { key: 'phu_hieu', label: 'Hạn phù hiệu (*)' },
    { key: 'dang_kiem', label: 'Hạn đăng kiểm (*)' },
    { key: 'bao_hiem', label: 'Hạn bảo hiểm (*)' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="text-xl font-bold pb-4 border-b">
          Sửa hiệu lực giấy tờ
        </DialogTitle>

        {/* Form */}
        <div className="space-y-4 py-4">
          {documentFields.map((field) => {
            const doc = documents.find((d) => d.type === field.key)
            if (!doc) return null

            const selectedDate = selectedDates[doc.id] || new Date(doc.expiryDate)
            const isValid = selectedDate > new Date()
            const dateValue = format(selectedDate, 'dd/MM/yyyy', { locale: vi })

            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id={field.key}
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateValue}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => handleDateSelect(doc.id, date || undefined)}
                        defaultMonth={selectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex-shrink-0">
                    {isValid ? (
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                        <X className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="ghost" onClick={handleCancel}>
            HỦY
          </Button>
          <Button onClick={handleSave}>
            LƯU
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

