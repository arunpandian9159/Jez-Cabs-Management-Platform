# Frontend Implementation Guide

## Overview

The Jez Cabs Management Platform frontend has been initialized with React + TypeScript + Vite and all necessary dependencies installed. This guide provides the structure and implementation approach for completing the frontend.

## ✅ Completed Setup (Task 12)

### Dependencies Installed
- **UI Framework:** Material-UI (@mui/material, @mui/icons-material)
- **Routing:** React Router DOM
- **State Management:** TanStack React Query
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Date Handling:** date-fns

### Project Structure Created
```
frontend/
├── src/
│   ├── lib/
│   │   └── axios.ts              ✅ Axios instance with interceptors
│   ├── types/
│   │   └── index.ts              ✅ TypeScript interfaces
│   ├── contexts/                 📋 Auth context (to be created)
│   ├── hooks/                    📋 Custom hooks (to be created)
│   ├── components/               📋 Reusable components
│   ├── pages/                    📋 Page components
│   ├── services/                 📋 API services
│   └── App.tsx                   📋 Main app component
├── .env                          ✅ Environment variables
└── package.json                  ✅ Dependencies installed
```

## 📋 Remaining Frontend Tasks (13-18)

### Task 13: Authentication & Dashboard
**Files to Create:**
1. `src/contexts/AuthContext.tsx` - Authentication state management
2. `src/pages/Login.tsx` - Login page
3. `src/pages/Register.tsx` - Company registration page
4. `src/pages/Dashboard.tsx` - Main dashboard with KPIs
5. `src/services/auth.service.ts` - Authentication API calls
6. `src/services/analytics.service.ts` - Analytics API calls
7. `src/components/Layout.tsx` - Main layout with sidebar
8. `src/components/ProtectedRoute.tsx` - Route protection

**Key Features:**
- JWT token management
- Login/logout functionality
- Company registration
- Dashboard with KPI cards
- Revenue charts
- Fleet utilization metrics

### Task 14: Fleet Management UI
**Files to Create:**
1. `src/pages/Cabs/CabList.tsx` - Vehicle list with filters
2. `src/pages/Cabs/CabForm.tsx` - Add/edit vehicle form
3. `src/pages/Cabs/CabDetails.tsx` - Vehicle details view
4. `src/services/cab.service.ts` - Cab API calls
5. `src/components/CabCard.tsx` - Vehicle card component
6. `src/components/StatusBadge.tsx` - Status indicator

**Key Features:**
- CRUD operations for vehicles
- Status management (Available/Rented/Maintenance)
- Document expiry alerts
- Search and filtering
- Pagination

### Task 15: Booking Management UI
**Files to Create:**
1. `src/pages/Bookings/BookingList.tsx` - Booking list
2. `src/pages/Bookings/BookingForm.tsx` - Create/edit booking
3. `src/pages/Bookings/BookingCalendar.tsx` - Calendar view
4. `src/services/booking.service.ts` - Booking API calls
5. `src/components/BookingCard.tsx` - Booking card
6. `src/components/DateRangePicker.tsx` - Date selection

**Key Features:**
- Create/edit bookings
- Driver assignment
- Calendar view of bookings
- Conflict detection
- Status tracking

### Task 16: Driver & Checklist UI
**Files to Create:**
1. `src/pages/Drivers/DriverList.tsx` - Driver list
2. `src/pages/Drivers/DriverForm.tsx` - Add/edit driver
3. `src/pages/Checklists/ChecklistList.tsx` - Checklist list
4. `src/pages/Checklists/ChecklistForm.tsx` - Create checklist
5. `src/services/driver.service.ts` - Driver API calls
6. `src/services/checklist.service.ts` - Checklist API calls

**Key Features:**
- Driver management
- License expiry tracking
- Checklist creation from templates
- Approval/rejection workflow
- Image attachments

### Task 17: GPS Tracking & Maps (Optional)
**Files to Create:**
1. `src/pages/Tracking/LiveTracking.tsx` - Real-time tracking
2. `src/pages/Tracking/RouteHistory.tsx` - Historical routes
3. `src/services/telematics.service.ts` - Telematics API calls
4. `src/components/Map.tsx` - Map component (Leaflet/Google Maps)

**Additional Dependencies Needed:**
```bash
npm install leaflet react-leaflet @types/leaflet
```

**Key Features:**
- Live vehicle tracking
- Route playback
- Geofencing alerts
- Speed monitoring

### Task 18: Invoicing & Reports
**Files to Create:**
1. `src/pages/Invoices/InvoiceList.tsx` - Invoice list
2. `src/pages/Invoices/InvoiceForm.tsx` - Create/edit invoice
3. `src/pages/Invoices/InvoiceDetails.tsx` - Invoice view/print
4. `src/pages/Reports/RevenueReport.tsx` - Revenue analytics
5. `src/pages/Reports/FleetReport.tsx` - Fleet utilization
6. `src/services/invoice.service.ts` - Invoice API calls

**Key Features:**
- Invoice generation
- Payment tracking
- Revenue charts
- Fleet utilization reports
- Export to PDF

## 🎨 UI/UX Guidelines

### Theme Configuration
```typescript
// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### Layout Structure
- **Sidebar Navigation:** Collapsible sidebar with menu items
- **Top Bar:** User profile, notifications, logout
- **Main Content:** Responsive grid layout
- **Cards:** Material-UI Card components for data display
- **Tables:** Material-UI DataGrid for lists
- **Forms:** React Hook Form with Zod validation

### Color Coding
- **Available:** Green (#4caf50)
- **Rented:** Blue (#2196f3)
- **Maintenance:** Orange (#ff9800)
- **Overdue:** Red (#f44336)
- **Pending:** Yellow (#ffc107)

## 🔌 API Integration Pattern

### Example Service
```typescript
// src/services/cab.service.ts
import axios from '../lib/axios';
import { Cab } from '../types';

export const cabService = {
  getAll: async (params?: any) => {
    const { data } = await axios.get('/cabs', { params });
    return data;
  },
  
  getOne: async (id: string) => {
    const { data } = await axios.get(`/cabs/${id}`);
    return data;
  },
  
  create: async (cab: Partial<Cab>) => {
    const { data } = await axios.post('/cabs', cab);
    return data;
  },
  
  update: async (id: string, cab: Partial<Cab>) => {
    const { data } = await axios.patch(`/cabs/${id}`, cab);
    return data;
  },
  
  delete: async (id: string) => {
    const { data } = await axios.delete(`/cabs/${id}`);
    return data;
  },
};
```

### React Query Hook
```typescript
// src/hooks/useCabs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cabService } from '../services/cab.service';

export const useCabs = (params?: any) => {
  return useQuery({
    queryKey: ['cabs', params],
    queryFn: () => cabService.getAll(params),
  });
};

export const useCreateCab = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cabService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cabs'] });
    },
  });
};
```

## 📱 Responsive Design

- **Desktop:** Full sidebar, multi-column layouts
- **Tablet:** Collapsible sidebar, 2-column layouts
- **Mobile:** Bottom navigation, single-column layouts

## 🔒 Security Considerations

1. **Token Storage:** JWT in localStorage
2. **Route Protection:** ProtectedRoute wrapper
3. **Role-Based Access:** Conditional rendering based on user role
4. **Input Validation:** Zod schemas for all forms
5. **XSS Protection:** React's built-in escaping

## 🚀 Quick Start Commands

```bash
# Development
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Estimated Implementation Time

- **Task 13 (Auth & Dashboard):** 8-10 hours
- **Task 14 (Fleet Management):** 6-8 hours
- **Task 15 (Booking Management):** 8-10 hours
- **Task 16 (Driver & Checklist):** 6-8 hours
- **Task 17 (GPS Tracking):** 6-8 hours (Optional)
- **Task 18 (Invoicing & Reports):** 6-8 hours

**Total:** 40-52 hours for complete frontend

## 🎯 MVP Approach

For a faster MVP, prioritize:
1. ✅ Authentication (Login/Register)
2. ✅ Dashboard (KPIs only)
3. ✅ Fleet Management (CRUD)
4. ✅ Booking Management (Basic CRUD)
5. ⏭️ Skip GPS Tracking initially
6. ✅ Basic Invoicing

This reduces implementation to ~24-30 hours.

## 📝 Next Steps

1. Create authentication context and pages
2. Implement main layout and routing
3. Build dashboard with KPI cards
4. Implement fleet management pages
5. Add booking management
6. Complete driver and checklist features
7. Add invoicing and reports
8. Optional: GPS tracking

---

**Note:** The backend is 100% complete with all APIs ready. The frontend just needs to consume these APIs following the patterns outlined above.

