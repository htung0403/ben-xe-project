import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Bus, 
  FileText, 
  History, 
  CreditCard, 
  BarChart3, 
  Search, 
  Calendar,
  Bell,
  Mail,
  Settings,
  Power,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'

const menuItems = [
  { path: '/', label: 'Trang chủ', icon: Home },
  { path: '/dieu-do', label: 'Điều độ', icon: Bus },
  { path: '/hoa-don', label: 'Hóa đơn điện tử', icon: FileText },
  { path: '/lich-su', label: 'Lịch sử giao dịch', icon: History },
  { path: '/thanh-toan', label: 'Thanh toán', icon: CreditCard },
  { path: '/bao-cao', label: 'Báo cáo', icon: BarChart3 },
  { path: '/tra-cuu', label: 'Tra cứu thông tin', icon: Search },
  { path: '/ke-hoach', label: 'Kế hoạch', icon: Calendar },
]

export function Sidebar() {
  const { user, setUser } = useStore()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const handleLogout = () => {
    setUser(null)
    navigate('/login')
    // In a real app, you'd also clear tokens, etc.
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <aside className={cn(
      "border-r bg-background flex flex-col h-full transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo, Title and Toggle Button */}
      <div className={cn("flex items-center border-b", isCollapsed ? "justify-center p-2" : "justify-between p-4")}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 flex-1">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
              🚌
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold truncate">Bến Xe Trung Tâm</h1>
              <p className="text-xs text-muted-foreground truncate">Hệ thống quản lý bến xe</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-white font-bold">
            🚌
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={toggleSidebar}
          title={isCollapsed ? "Mở rộng" : "Thu nhỏ"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Info */}
      {user && (
        <div className={cn("p-4 border-b", isCollapsed && "p-2")}>
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium">{user.name.charAt(0)}</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className={cn("space-y-1 flex-1 overflow-y-auto", isCollapsed ? "p-2" : "p-4")}>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg text-sm font-medium transition-colors",
                  isCollapsed 
                    ? "justify-center px-2 py-2" 
                    : "gap-3 px-3 py-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom Navigation Buttons */}
      {user && (
        <div className={cn("p-4 border-t", isCollapsed && "p-2")}>
          <div className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-col" : "justify-around"
          )}>
            <Button
              variant="ghost"
              size="icon"
              className={isCollapsed ? "w-full" : "flex-1"}
              title="Thông báo"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={isCollapsed ? "w-full" : "flex-1"}
              title="Tin nhắn"
            >
              <Mail className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={isCollapsed ? "w-full" : "flex-1"}
              title="Cài đặt"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={isCollapsed ? "w-full" : "flex-1"}
              title="Đăng xuất"
              onClick={handleLogout}
            >
              <Power className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </aside>
  )
}

