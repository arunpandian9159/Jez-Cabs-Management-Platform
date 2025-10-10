# Jez Cabs Management Platform - Frontend

A modern, fully-featured React application for managing cab rental businesses with real-time analytics, fleet management, booking system, and comprehensive reporting.

## 🎯 Features

### ✅ Completed Features

- **Authentication & Authorization**
  - User login and registration
  - JWT token management
  - Protected routes
  - Role-based access control

- **Dashboard**
  - Real-time KPI cards (Fleet, Drivers, Bookings, Revenue)
  - Revenue trend charts (last 30 days)
  - Fleet status pie chart
  - Revenue breakdown
  - Alerts and notifications

- **Fleet Management**
  - Complete CRUD operations for vehicles
  - Status management (Available, Rented, In Maintenance)
  - Document expiry alerts (Insurance, Registration)
  - Search and filtering
  - Detailed vehicle information

- **Booking Management**
  - Create and manage bookings
  - Customer information tracking
  - Vehicle assignment
  - Status tracking (Pending, Active, Completed, Cancelled)
  - Date range selection
  - Conflict detection

- **Driver Management**
  - Driver roster management
  - License tracking and expiry alerts
  - Active/Inactive status toggle
  - Emergency contact information
  - Search and filtering

- **Checklist Management**
  - Vehicle inspection checklists
  - Template-based creation
  - Approval/rejection workflow
  - Status tracking

- **Invoice Management**
  - Invoice creation and editing
  - Automatic tax calculation
  - Discount support
  - Status tracking (Draft, Sent, Paid, Overdue, Cancelled)
  - Mark as paid functionality
  - Due date tracking

- **Reports & Analytics**
  - Revenue trends (90-day view)
  - Fleet utilization metrics
  - Booking statistics
  - Revenue breakdown

## 🛠️ Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI) v7
- **Routing:** React Router DOM v7
- **State Management:** TanStack React Query v5
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Date Handling:** date-fns

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx       # Main layout with sidebar
│   │   ├── ProtectedRoute.tsx
│   │   └── StatusBadge.tsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/                 # Utilities
│   │   └── axios.ts         # Axios instance with interceptors
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Cabs/
│   │   │   ├── CabList.tsx
│   │   │   └── CabForm.tsx
│   │   ├── Bookings/
│   │   │   ├── BookingList.tsx
│   │   │   └── BookingForm.tsx
│   │   ├── Drivers/
│   │   │   ├── DriverList.tsx
│   │   │   └── DriverForm.tsx
│   │   ├── Checklists/
│   │   │   └── ChecklistList.tsx
│   │   ├── Invoices/
│   │   │   ├── InvoiceList.tsx
│   │   │   └── InvoiceForm.tsx
│   │   └── Reports/
│   │       └── Reports.tsx
│   ├── services/            # API services
│   │   ├── auth.service.ts
│   │   ├── analytics.service.ts
│   │   ├── cab.service.ts
│   │   ├── booking.service.ts
│   │   ├── driver.service.ts
│   │   ├── checklist.service.ts
│   │   └── invoice.service.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── theme.ts             # MUI theme configuration
├── .env                     # Environment variables
├── package.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:3000

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Configure environment variables:
The `.env` file is already configured with:
```
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:5173
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI/UX Features

### Theme
- Primary Color: Blue (#1976d2)
- Secondary Color: Pink (#dc004e)
- Success: Green (#4caf50)
- Warning: Orange (#ff9800)
- Error: Red (#f44336)

### Status Colors
- **Available:** Green
- **Rented/Active:** Blue
- **Maintenance/Pending:** Orange
- **Overdue/Cancelled:** Red

### Responsive Design
- **Desktop:** Full sidebar navigation, multi-column layouts
- **Tablet:** Collapsible sidebar, 2-column layouts
- **Mobile:** Mobile-optimized navigation, single-column layouts

## 🔐 Authentication Flow

1. User visits the application
2. Redirected to `/login` if not authenticated
3. Login with email and password
4. JWT token stored in localStorage
5. Token automatically attached to all API requests
6. Auto-logout on 401 responses

## 📊 Key Pages

### Dashboard (`/dashboard`)
- KPI cards for fleet, drivers, bookings, and revenue
- Revenue trend chart (30 days)
- Fleet status pie chart
- Alerts for overdue invoices and maintenance

### Fleet Management (`/cabs`)
- Grid view of all vehicles
- Filter by status
- Search by registration, make, or model
- Add/Edit/Delete vehicles
- Expiry warnings for insurance and registration

### Bookings (`/bookings`)
- List of all bookings
- Filter by status
- Search by customer details
- Create new bookings with vehicle assignment
- Track rental periods and locations

### Drivers (`/drivers`)
- Driver roster with active/inactive status
- License expiry tracking
- Emergency contact information
- Toggle driver status

### Invoices (`/invoices`)
- Invoice list with status badges
- Automatic tax calculation
- Mark as paid functionality
- Filter by status

### Reports (`/reports`)
- 90-day revenue trend
- Fleet utilization metrics
- Booking and revenue statistics

## 🔧 Configuration

### API Integration
All API calls are configured through service files in `src/services/`. The base URL is set in `.env`:

```typescript
// Example service usage
import { cabService } from '../services/cab.service';

const { data } = await cabService.getAll({ status: 'AVAILABLE' });
```

### Adding New Features

1. Create service file in `src/services/`
2. Add TypeScript types in `src/types/index.ts`
3. Create page components in `src/pages/`
4. Add routes in `src/App.tsx`
5. Update navigation in `src/components/Layout.tsx`

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend is running on http://localhost:3000
   - Check `.env` file configuration

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check if JWT token is valid

3. **Build Errors**
   - Delete `node_modules` and run `npm install` again
   - Clear Vite cache: `rm -rf node_modules/.vite`

## 📈 Performance

- React Query caching for optimal performance
- Lazy loading for routes (can be added)
- Optimized re-renders with React.memo (where needed)
- Debounced search inputs

## 🔒 Security

- JWT tokens stored in localStorage
- Automatic token refresh on API calls
- Protected routes with authentication checks
- Input validation with Zod schemas
- XSS protection via React's built-in escaping

## 🎯 Future Enhancements

- [ ] GPS tracking and live maps
- [ ] Real-time notifications with WebSockets
- [ ] PDF export for invoices and reports
- [ ] Advanced filtering and sorting
- [ ] Bulk operations
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 📄 License

This project is part of the Jez Cabs Management Platform.

## 🤝 Support

For issues or questions, please refer to the main project documentation or contact the development team.

---

**Built with ❤️ using React, TypeScript, and Material-UI**

