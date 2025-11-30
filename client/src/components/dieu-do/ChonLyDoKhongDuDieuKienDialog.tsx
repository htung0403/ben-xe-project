import { useState } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

interface ChonLyDoKhongDuDieuKienDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reasons: string[]) => void
}

const reasonCategories = [
  {
    id: 'driver',
    title: 'Phân loại: Các điều kiện không được phép xuất bến liên quan đến lái xe',
    reasons: [
      'Không có hoặc có nhưng không đủ số lượng giấy phép lái xe so với số lái xe ghi trên lệnh vận chuyển',
      'Giấy phép lái xe đã hết hạn hoặc sử dụng giấy phép lái xe giả',
      'Hạng giấy phép lái xe không phù hợp với các loại xe được phép điều khiển',
      'Thông tin của lái xe không đúng với thông tin được ghi trên lệnh vận chuyển',
      'Lái xe sử dụng rượu bia',
      'Lái xe sử dụng chất ma tuý',
    ],
  },
  {
    id: 'vehicle',
    title: 'Phân loại: Các điều kiện không được phép xuất bến liên quan đến xe',
    reasons: [
      'Xe không đủ điều kiện kỹ thuật',
      'Giấy tờ xe không đầy đủ hoặc hết hạn',
      'Xe không đúng với thông tin trên lệnh vận chuyển',
    ],
  },
  {
    id: 'other',
    title: 'Phân loại: Các lý do khác',
    reasons: [
      'Vi phạm an toàn',
      'Vi phạm pháp luật',
      'Giấy tờ thiếu',
      'Lý do khác',
    ],
  },
]

export function ChonLyDoKhongDuDieuKienDialog({
  open,
  onOpenChange,
  onConfirm,
}: ChonLyDoKhongDuDieuKienDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    driver: true,
    vehicle: true,
    other: true,
  })
  const [createOrder, setCreateOrder] = useState(true)
  const [signAndTransmit, setSignAndTransmit] = useState(true)
  const [printDisplay, setPrintDisplay] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    )
  }

  const filteredCategories = reasonCategories.map((category) => ({
    ...category,
    reasons: category.reasons.filter((reason) =>
      reason.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => category.reasons.length > 0)

  const handleConfirm = () => {
    if (selectedReasons.length === 0) {
      return
    }
    onConfirm(selectedReasons)
    onOpenChange(false)
    // Reset
    setSelectedReasons([])
    setCreateOrder(true)
    setSignAndTransmit(true)
    setPrintDisplay(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedReasons([])
    setSearchTerm('')
    setCreateOrder(true)
    setSignAndTransmit(true)
    setPrintDisplay(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-xl font-bold">Chọn lý do xe không đủ điều kiện xuất bến</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content - Scrollable list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <div
                className="flex items-center gap-2 p-2 bg-muted/50 rounded cursor-pointer hover:bg-muted"
                onClick={() => toggleCategory(category.id)}
              >
                {expandedCategories[category.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{category.title}</span>
              </div>
              {expandedCategories[category.id] && (
                <div className="pl-6 space-y-1">
                  {category.reasons.map((reason, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                      onClick={() => toggleReason(reason)}
                    >
                      <Checkbox
                        checked={selectedReasons.includes(reason)}
                        onCheckedChange={() => toggleReason(reason)}
                      />
                      <Label className="text-sm font-normal cursor-pointer flex-1">
                        {reason}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t pt-4 space-y-4">
          {/* Pagination */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              1
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              2
            </Button>
          </div>

          {/* Action buttons and checkboxes */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleCancel}>
              HỦY
            </Button>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createOrder"
                  checked={createOrder}
                  onCheckedChange={(checked) => setCreateOrder(checked === true)}
                />
                <Label htmlFor="createOrder" className="cursor-pointer font-normal text-sm">
                  Tạo đơn hàng
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="signAndTransmit"
                  checked={signAndTransmit}
                  onCheckedChange={(checked) => setSignAndTransmit(checked === true)}
                />
                <Label htmlFor="signAndTransmit" className="cursor-pointer font-normal text-sm">
                  Ký lệnh và truyền tải
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="printDisplay"
                  checked={printDisplay}
                  onCheckedChange={(checked) => setPrintDisplay(checked === true)}
                />
                <Label htmlFor="printDisplay" className="cursor-pointer font-normal text-sm">
                  In bản thể hiện
                </Label>
              </div>
              <Button
                onClick={handleConfirm}
                disabled={selectedReasons.length === 0}
              >
                XÁC NHẬN
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

