import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { DieuDo } from './pages/DieuDo'
import { HoaDon } from './pages/HoaDon'
import { LichSu } from './pages/LichSu'
import { ThanhToanPage } from './pages/ThanhToanPage'
import { XacNhanThanhToanPage } from './pages/XacNhanThanhToanPage'
import { BaoCao } from './pages/BaoCao'
import { TraCuu } from './pages/TraCuu'
import { KeHoach } from './pages/KeHoach'
import { Toaster } from './components/ui/toaster'
import { useStore } from './store/useStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useStore()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dieu-do" element={<DieuDo />} />
          <Route path="hoa-don" element={<HoaDon />} />
          <Route path="lich-su" element={<LichSu />} />
          <Route path="thanh-toan" element={<ThanhToanPage />} />
          <Route path="thanh-toan/xac-nhan/:vehicleId" element={<XacNhanThanhToanPage />} />
          <Route path="bao-cao" element={<BaoCao />} />
          <Route path="tra-cuu" element={<TraCuu />} />
          <Route path="ke-hoach" element={<KeHoach />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
