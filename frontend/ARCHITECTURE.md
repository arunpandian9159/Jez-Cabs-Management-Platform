# 🏗️ Frontend Architecture

This document describes the restructured frontend architecture following **Feature-Based Organization** with clear **Separation of Concerns**.

## 📁 Directory Structure Overview

```
src/
├── app/                          # App-level configuration (future)
│   └── providers/                # App-wide providers
│
├── components/                   # 🎨 SHARED UI PRIMITIVES (Dumb Components)
│   ├── ui/                       # Pure presentational components
│   │   ├── Avatar/
│   │   ├── Badge/
│   │   ├── Button/
│   │   ├── Calendar/             # Calendar + DateRangePicker
│   │   ├── Card/
│   │   ├── Input/                # Input + TextArea
│   │   ├── Loading/              # Loading + LoadingAnimation
│   │   ├── Logo/
│   │   ├── Modal/
│   │   ├── Select/
│   │   ├── Tabs/
│   │   ├── Toast/
│   │   └── index.ts              # Barrel export
│   └── layout/                   # Layout primitives (legacy - being migrated)
│
├── features/                     # 🧠 FEATURE MODULES
│   ├── auth/                     # Authentication feature
│   │   ├── components/           # AuthModal, LoginForm, RegisterForm
│   │   ├── contexts/             # AuthContext, AuthModalContext
│   │   ├── hooks/                # useAuthModal
│   │   └── index.ts
│   │
│   ├── booking/                  # Booking flow feature
│   │   ├── components/           # QuickBookingForm, CabSelection, etc.
│   │   ├── types/                # Booking-related types
│   │   └── index.ts
│   │
│   ├── trips/                    # Trips feature
│   │   ├── pages/                # TripHistory, PlanTrip
│   │   ├── services/             # trips.service.ts
│   │   └── index.ts
│   │
│   ├── rentals/                  # Rentals feature
│   │   ├── pages/                # ActiveRentals, BrowseCabs
│   │   ├── services/             # rentals.service.ts
│   │   ├── types/                # rental.types.ts
│   │   └── index.ts
│   │
│   ├── payments/                 # Payments feature
│   │   ├── pages/                # Payments
│   │   ├── types/                # payment.types.ts
│   │   └── index.ts
│   │
│   ├── disputes/                 # Disputes feature
│   │   ├── pages/                # Disputes
│   │   ├── services/             # disputes.service.ts
│   │   └── index.ts
│   │
│   ├── safety/                   # Safety feature
│   │   ├── pages/                # SafetyCenter, EmergencyContacts
│   │   ├── services/             # safety.service.ts
│   │   ├── types/                # emergency.types.ts
│   │   └── index.ts
│   │
│   ├── rideshare/                # Rideshare feature
│   │   ├── pages/                # ShareRide, TripExchange, ExchangeHistory
│   │   ├── services/             # rideshare.service.ts
│   │   └── index.ts
│   │
│   ├── driver/                   # Driver portal feature
│   │   ├── components/           # Driver-specific components
│   │   ├── pages/                # Dashboard, ActiveTrip, Earnings, etc.
│   │   ├── services/             # driver.service.ts
│   │   ├── types/                # driver.types.ts
│   │   └── index.ts
│   │
│   ├── owner/                    # Cab owner portal feature
│   │   ├── components/           # Owner-specific components
│   │   ├── pages/                # Dashboard, ManageCabs, ManageDrivers, etc.
│   │   ├── services/             # owner.service.ts, cabs.service.ts
│   │   └── index.ts
│   │
│   ├── admin/                    # Admin portal feature
│   │   ├── components/           # Admin-specific components
│   │   ├── pages/                # Dashboard, Users, Disputes, Verification
│   │   ├── services/             # admin.service.ts, users.service.ts
│   │   └── index.ts
│   │
│   ├── customer/                 # Customer portal feature
│   │   ├── pages/                # Dashboard, PostTrip
│   │   └── index.ts
│   │
│   ├── public/                   # Public pages feature
│   │   ├── pages/                # Home
│   │   └── index.ts
│   │
│   └── index.ts                  # Features barrel export
│
├── layouts/                      # 🏠 LAYOUT CONTAINERS (Smart Components)
│   ├── Navbar/                   # Navigation component
│   ├── Sidebar/                  # Sidebar component
│   ├── PublicLayout.tsx
│   ├── CustomerLayout.tsx
│   ├── DriverLayout.tsx
│   ├── CabOwnerLayout.tsx
│   ├── AdminLayout.tsx
│   ├── ProtectedRoute.tsx
│   └── index.ts
│
├── shared/                       # 🔧 SHARED UTILITIES
│   ├── api/                      # API configuration
│   ├── constants/                # App constants, routes
│   ├── hooks/                    # Shared hooks (useWebSocket)
│   ├── types/                    # Shared types
│   ├── utils/                    # Utility functions
│   └── index.ts
│
├── styles/                       # 🎨 GLOBAL STYLES
│   ├── animations.css
│   ├── design-tokens.css
│   └── globals.css
│
└── [Legacy folders]              # To be migrated
    ├── pages/                    # Old pages (now in features)
    ├── services/                 # Old services (now in features)
    ├── types/                    # Old types (now in features)
    ├── contexts/                 # Old contexts (now in features)
    ├── hooks/                    # Old hooks (now in shared)
    └── lib/                      # Old lib (now in shared)
```

## 🎯 Key Principles

### 1. Separation of Concerns

| Layer | Location | Responsibility |
|-------|----------|---------------|
| **UI Primitives** | `/components/ui/` | Stateless, reusable, no business logic |
| **Feature Components** | `/features/*/components/` | Feature-specific, may contain business logic |
| **Layout Containers** | `/layouts/` | Page structure, navigation, auth guards |
| **Pages** | `/features/*/pages/` | Page-level components, data orchestration |
| **Services** | `/features/*/services/` | API calls, data fetching |

### 2. Feature-Based Organization

Each feature is self-contained:

```
feature/
├── components/     # Feature-specific components
├── pages/         # Pages for this feature
├── services/      # API services
├── hooks/         # Feature-specific hooks
├── types/         # Feature-specific types
├── contexts/      # Feature-specific contexts
└── index.ts       # Public API (barrel export)
```

### 3. Import Patterns

```typescript
// UI Primitives
import { Button, Card, Modal } from '@/components/ui';

// Feature components
import { QuickBookingForm } from '@/features/booking';
import { AuthModal } from '@/features/auth';

// Layouts
import { CustomerLayout, ProtectedRoute } from '@/layouts';

// Shared utilities
import { formatCurrency, cn } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
```

## 📝 Migration Notes

### Files Copied (Original files preserved for now)

The refactoring created **copies** of files in the new structure. The original files in `/pages/`, `/services/`, `/types/`, etc. are still present.

### Next Steps

1. **Update imports** in App.tsx to use the new structure
2. **Test the application** to ensure everything works
3. **Remove old files** once verified
4. **Update path aliases** in tsconfig.json for cleaner imports

## 🔄 Component Categorization

### UI Primitives (`/components/ui/`)

- Avatar, Badge, Button, Calendar, Card
- DateRangePicker, Input, Loading, LoadingAnimation
- Logo, Modal, Select, Tabs, TextArea, Toast

### Feature Components (`/features/*/components/`)

- QuickBookingForm → `/features/booking/`
- AuthModal, LoginForm, RegisterForm → `/features/auth/`
- CabSelection, DriverSearch, LiveTracking → `/features/booking/`
- LocationEntry, TripComplete → `/features/booking/`

### Layout Components (`/layouts/`)

- Navbar, Sidebar
- PublicLayout, CustomerLayout, DriverLayout
- CabOwnerLayout, AdminLayout
- ProtectedRoute, PublicOnlyRoute
