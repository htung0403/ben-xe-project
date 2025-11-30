# Ứng Dụng Web Quản Lý Bến Xe

Ứng dụng web quản lý bến xe hoàn chỉnh được xây dựng với React, TypeScript, Tailwind CSS và shadcn/ui.

## 🚀 Tính năng

### 1. Trang chủ (Dashboard)
- Overview cards: Tổng xe trong bến, Xe đã xuất bến hôm nay, Doanh thu, Xe chờ xử lý
- Biểu đồ: Lượng xe ra vào bến 7 ngày, Doanh thu theo tuần, Phân bố xe theo tuyến
- Bảng hoạt động gần đây: 10 giao dịch mới nhất
- Quick actions: Cho xe vào bến, Xem báo cáo

### 2. Điều độ (Module chính)
- **4 Tabs với số đếm:**
  - Xe trong bến
  - Đã cấp nốt
  - Đã thanh toán
  - Sẵn sàng xuất bến

- **Quy trình đầy đủ:**
  1. Cho xe vào bến
  2. Xe trả khách (Nhật trình, Số khách)
  3. Cấp phép lên nốt (Kiểm tra giấy tờ, Thông tin lái xe, Mã vận lệnh)
  4. Thanh toán (Chi tiết phí, Phương thức thanh toán)
  5. Cấp lệnh xuất bến
  6. Cho xe ra bến

- **Tính năng đặc biệt:**
  - Kiểm tra giấy tờ tự động (Phù hiệu, Đăng kiểm, Bảo hiểm, Đăng ký xe)
  - Sửa giấy tờ hết hạn inline
  - Đánh dấu xe không đủ điều kiện
  - Filter & Search theo biển số, tuyến đường, trạng thái

### 3. Hóa đơn điện tử
- Danh sách hóa đơn với trạng thái
- Xem chi tiết hóa đơn
- In hóa đơn
- Gửi email hóa đơn

### 4. Lịch sử giao dịch
- Filter theo ngày, loại giao dịch
- Bảng chi tiết giao dịch
- Export Excel

### 5. Thanh toán
- Tab: Chờ thanh toán / Đã thanh toán
- Thống kê: Tổng thu hôm nay, Tiền mặt, Chuyển khoản, Thẻ

### 6. Báo cáo
- 9 loại báo cáo:
  - Bảng kê hóa đơn
  - Báo cáo tổng hợp
  - Nhật trình xe
  - Xe đi thay
  - Xe không đủ điều kiện
  - Xe ra vào bến
  - Xe tăng cường
  - Xe trả khách
  - Lịch sử hủy đơn
- Export Excel/PDF
- Gửi email báo cáo

### 7. Tra cứu thông tin
- Tra cứu xe
- Tra cứu lái xe
- Tra cứu tuyến đường
- Search nhanh

### 8. Kế hoạch
- Calendar view (tháng/tuần/ngày)
- Lập kế hoạch mới
- Xem chi tiết kế hoạch theo ngày

## 🛠️ Công nghệ sử dụng

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Lucide React** - Icons
- **React Router** - Navigation
- **Zustand** - State management
- **Recharts** - Charts
- **date-fns** - Date formatting
- **Radix UI** - Headless UI components

## 📦 Cài đặt

### Yêu cầu
- Node.js >= 20.15.1
- npm >= 10.7.0

### Các bước cài đặt

1. **Clone repository hoặc tải source code**

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Chạy development server:**
```bash
npm run dev
```

4. **Mở trình duyệt:**
```
http://localhost:5173
```

5. **Đăng nhập:**
   - Username: (bất kỳ)
   - Password: (bất kỳ)
   - (Hiện tại là demo, không có validation thật)

## 🏗️ Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── layout/          # Layout components (Header, Sidebar)
│   └── dieu-do/        # Điều độ module components
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── DieuDo.tsx
│   ├── HoaDon.tsx
│   ├── LichSu.tsx
│   ├── ThanhToanPage.tsx
│   ├── BaoCao.tsx
│   ├── TraCuu.tsx
│   ├── KeHoach.tsx
│   └── Login.tsx
├── store/              # Zustand store
│   └── useStore.ts
├── types/              # TypeScript types
│   └── index.ts
├── data/               # Mock data
│   └── mockData.ts
└── lib/                # Utilities
    └── utils.ts
```

## 📝 Mock Data

Ứng dụng đi kèm với mock data đầy đủ:
- 20 xe với các trạng thái khác nhau
- 15 lái xe
- 10 tuyến đường
- 50+ giao dịch mẫu
- Hóa đơn mẫu
- Kế hoạch mẫu

## 🎨 UI/UX

- **Colors:**
  - Primary: Blue #2563eb
  - Success: Green #10b981
  - Warning: Amber #f59e0b
  - Danger: Red #ef4444

- **Typography:** Consistent font sizes và weights
- **Spacing:** Consistent padding và gaps
- **Animations:** Smooth transitions (200-300ms)
- **Icons:** Lucide React (16px, 20px, 24px)

## 🔐 Authentication

- Login page với form đơn giản
- Protected routes
- User session management
- (Demo mode - không có backend validation)

## 📱 Responsive Design

- Desktop: Full features
- Tablet: Sidebar collapsible
- Mobile: Simplified tables (có thể cải thiện thêm)

## 🚧 Tính năng có thể mở rộng

- [ ] Backend API integration
- [ ] Real-time updates với WebSocket
- [ ] PDF generation cho hóa đơn và lệnh xuất bến
- [ ] Email sending
- [ ] Excel export thực tế
- [ ] Drag & drop cho xe giữa các tabs
- [ ] Timeline view chi tiết
- [ ] Bulk actions
- [ ] Advanced filters
- [ ] User roles và permissions
- [ ] Settings page
- [ ] Backup & Restore

## 📄 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Lỗi import path aliases (@/)
- Đảm bảo `tsconfig.app.json` có cấu hình paths
- Đảm bảo `vite.config.ts` có resolve alias

### Lỗi Tailwind CSS không hoạt động
- Kiểm tra `tailwind.config.js`
- Kiểm tra `postcss.config.js`
- Đảm bảo `src/index.css` có `@tailwind` directives

### Lỗi Radix UI components
- Đảm bảo đã cài đặt đầy đủ dependencies
- Chạy `npm install` lại nếu cần

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console để xem lỗi
2. Đảm bảo đã cài đặt đúng dependencies
3. Xóa `node_modules` và `package-lock.json`, sau đó chạy `npm install` lại

## 📄 License

Dự án này được tạo cho mục đích demo và học tập.

---

**Lưu ý:** Đây là ứng dụng demo với mock data. Để sử dụng trong production, cần:
- Tích hợp backend API
- Thêm authentication thực tế
- Thêm validation và error handling
- Thêm testing
- Tối ưu performance
- Thêm security measures
