import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Clock, ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const routeMap: Record<string, string> = {
  '/': 'Trang chủ',
  '/dieu-do': 'Điều độ',
  '/hoa-don': 'Hóa đơn điện tử',
  '/lich-su': 'Lịch sử giao dịch',
  '/thanh-toan': 'Thanh toán',
  '/bao-cao': 'Báo cáo',
  '/tra-cuu': 'Tra cứu thông tin',
  '/ke-hoach': 'Kế hoạch',
}

export function Header() {
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getBreadcrumbs = () => {
    const pathname = location.pathname
    const breadcrumbs = []
    
    // Always start with Home
    breadcrumbs.push({ label: 'Trang chủ', path: '/' })
    
    // If not on home page, add current page
    if (pathname !== '/') {
      const currentLabel = routeMap[pathname] || pathname
      breadcrumbs.push({ label: currentLabel, path: pathname })
    }
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-2">
              {index === 0 && <Home className="h-4 w-4 text-muted-foreground" />}
              <span
                className={cn(
                  index === breadcrumbs.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground cursor-pointer"
                )}
              >
                {crumb.label}
              </span>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </nav>

        {/* Right side: Clock and Notifications */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-mono">
              {format(currentTime, 'HH:mm:ss')}
            </span>
            <span className="text-muted-foreground">
              {format(currentTime, 'dd/MM/yyyy')}
            </span>
          </div>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

