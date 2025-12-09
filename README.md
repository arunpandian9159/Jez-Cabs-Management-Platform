# Jez Cabs Management Platform

A comprehensive, production-ready multi-tenant SaaS platform for B2B cab rental companies to manage their vehicle fleet, bookings, drivers, maintenance, and invoicing.

## Live Demo
https://jez-cabs-management-frontend.vercel.app/

## 🏗️ Architecture

**Modular Monolith Architecture** with clear separation of concerns:
- Single NestJS application with independent modules
- Event-driven communication using NestJS Event Emitter
- Polyglot persistence (PostgreSQL + MongoDB)
- Ready for microservices extraction when needed

## 🛠️ Technology Stack

### Backend
- **Framework:** NestJS (Node.js + TypeScript)
- **Databases:** 
  - PostgreSQL (relational data: users, companies, cabs, bookings, drivers, invoices)
  - MongoDB (flexible data: checklists, telematics logs, GPS data)
- **Authentication:** JWT with Role-Based Access Control (RBAC)
- **API Documentation:** Swagger/OpenAPI
- **Message Queue:** RabbitMQ (for future microservices)

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI)
- **State Management:** React Query + Context API
- **Routing:** React Router v6
- **Maps:** Leaflet with OpenStreetMap

### DevOps
- **Containerization:** Docker + Docker Compose
- **Database Migrations:** TypeORM migrations
- **Testing:** Jest + Supertest + React Testing Library
- **Code Quality:** ESLint + Prettier

## 📦 Project Structure

```
jez-cabs-platform/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── modules/
│   │   │   ├── iam/           # Identity & Access Management
│   │   │   ├── cab/           # Cab Inventory Management
│   │   │   ├── driver/        # Driver Management
│   │   │   ├── booking/       # Booking & Rental Management
│   │   │   ├── checklist/     # Checklist & Maintenance
│   │   │   ├── invoice/       # Invoicing & Payment
│   │   │   ├── telematics/    # GPS & Telematics
│   │   │   ├── analytics/     # Analytics & Reporting
│   │   │   └── notification/  # Notification Service
│   │   ├── common/            # Shared utilities, guards, decorators
│   │   ├── config/            # Configuration management
│   │   └── database/          # Database connections & migrations
│   ├── test/                  # E2E tests
│   └── package.json
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React Context providers
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   └── package.json
├── docker-compose.yml         # Local development environment
├── docker-compose.prod.yml    # Production deployment
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd jez-cabs-platform
```

2. **Start infrastructure services (PostgreSQL, MongoDB, RabbitMQ)**
```bash
docker-compose up -d
```

3. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run migration:run
npm run seed
npm run start:dev
```

Backend will be available at: `http://localhost:3000`
API Documentation (Swagger): `http://localhost:3000/api/docs`

4. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 🔑 Default Credentials

After running the seed script:

**Owner Account:**
- Email: `owner@jezcabs.com`
- Password: `Owner@123`

**Manager Account:**
- Email: `manager@jezcabs.com`
- Password: `Manager@123`

**Staff Account:**
- Email: `staff@jezcabs.com`
- Password: `Staff@123`

## 📚 Core Features

### 1. Identity & Access Management (IAM)
- Multi-tenant company registration
- JWT-based authentication
- Role-based access control (Owner, Manager, Staff)
- Data isolation per company

### 2. Cab Inventory Management
- Complete vehicle fleet CRUD operations
- Status tracking: Available, Rented, In Maintenance
- Document expiry alerts (insurance, registration, permits)
- Filterable and searchable vehicle lists

### 3. Booking & Rental Management
- Create and manage vehicle rental bookings
- Automatic status updates based on booking lifecycle
- Client management and booking history
- Availability checking and conflict prevention

### 4. Checklist & Maintenance
- Customizable inspection checklist templates
- Mandatory post-rental inspection workflow
- Approval gates (vehicles locked until checklist approved)
- Photo upload for damage documentation

### 5. Driver Management
- Driver profile management
- License tracking with expiry notifications
- Driver-to-booking assignments
- Performance tracking

### 6. GPS & Telematics
- Real-time vehicle location tracking
- Driver behavior monitoring (speed, harsh braking)
- Geofencing with entry/exit alerts
- Historical route playback

### 7. Invoicing & Payment
- Automated invoice generation
- PDF invoice creation and email delivery
- Payment status tracking
- Overdue payment reminders

### 8. Analytics & Reporting
- Fleet utilization metrics
- Revenue analytics per vehicle
- Booking trends and insights
- Customizable date-range reports

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (12 rounds)
- Role-based access control (RBAC)
- Multi-tenant data isolation
- Rate limiting on public endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## 📊 Database Schema

### PostgreSQL Tables
- `companies` - Company/tenant information
- `users` - User accounts with roles
- `cabs` - Vehicle fleet inventory
- `drivers` - Driver profiles
- `bookings` - Rental bookings
- `invoices` - Invoice records

### MongoDB Collections
- `checklists` - Inspection checklists
- `telematics_logs` - GPS and telematics data

## 🧪 Testing

```bash
# Backend unit tests
cd backend
npm run test

# Backend E2E tests
npm run test:e2e

# Frontend tests
cd frontend
npm run test

# Test coverage
npm run test:cov
```

## 📖 API Documentation

Once the backend is running, access the interactive API documentation at:
`http://localhost:3000/api/docs`

All endpoints are documented with request/response schemas, authentication requirements, and example payloads.

## 🐳 Docker Deployment

### Development
```bash
docker-compose up
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jezcabs
MONGODB_URI=mongodb://localhost:27017/jezcabs
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d
RABBITMQ_URL=amqp://localhost:5672
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAP_PROVIDER=leaflet
```

## 📈 Performance Targets

- API Response Time: <200ms (95th percentile)
- Database Query Optimization: Indexed on frequently queried fields
- Pagination: Default 50 items per page
- Uptime Target: 99.9%

## 🛣️ Roadmap

- [x] Phase 1: Modular Monolith Implementation
- [ ] Phase 2: Advanced Analytics with ML predictions
- [ ] Phase 3: Mobile App (React Native)
- [ ] Phase 4: Microservices Migration (high-load modules)
- [ ] Phase 5: Multi-language Support (i18n)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@jezcabs.com or open an issue in the repository.

---

**Built with ❤️ for the cab rental industry**

