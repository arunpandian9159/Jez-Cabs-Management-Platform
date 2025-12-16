# 🚕 Jez Cabs Management Platform

> A comprehensive, multi-tenant cab rental and ride-hailing management platform built for the Indian market, supporting customers, drivers, cab owners, and administrators in a unified ecosystem.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [License](#-license)

---

## 🎯 Overview

**Jez Cabs Management Platform** is a production-ready, full-stack ride-hailing and cab rental solution designed specifically for the Indian transportation market. It provides a complete ecosystem connecting:

- **Customers** who need rides or want to rent vehicles
- **Drivers** who provide transportation services
- **Cab Owners** who manage vehicle fleets and driver contracts
- **Administrators** who oversee the entire platform

The platform supports real-time trip booking, vehicle rentals, community ride-sharing, driver onboarding with document verification, earnings management, dispute resolution, and comprehensive safety features.

---

## ✨ Key Features

### 🚗 Trip Management

- **Real-time Booking Flow**: Location entry → Cab selection → Driver matching → Live tracking → Trip completion
- **Multiple Cab Types**: Sedan, SUV, Hatchback, Premium, Electric, Auto
- **Trip Rating & Feedback**: Two-way rating system for customers and drivers
- **OTP Verification**: Secure trip start verification
- **Surge Pricing**: Dynamic fare calculation based on demand

### 🔑 Vehicle Rentals

- **Self-Drive & Chauffeur-Driven**: Flexible rental options
- **Browse Available Cabs**: Filter by type, availability, and features
- **Active Rental Management**: Track ongoing rentals with daily rates

### 👥 Community Ride-Sharing

- **Trip Exchange**: Drivers can post and share trip opportunities
- **Ride Sharing**: Customers can find shared rides to reduce costs
- **Seat Booking System**: Reserve seats on community trips

### 👨‍✈️ Driver Management

- **Onboarding Workflow**: Complete KYC with document uploads
- **Document Verification**: License, Aadhaar, Police Clearance verification
- **Online/Offline Toggle**: Control availability status
- **Location Tracking**: Real-time GPS updates
- **Earnings Dashboard**: Track trip earnings, tips, and incentives

### 🏢 Cab Owner Portal

- **Fleet Management**: Add, update, and monitor vehicles
- **Driver Management**: Assign drivers to vehicles, manage contracts
- **Earnings Analytics**: Revenue tracking by vehicle and driver
- **Contract Management**: Handle driver agreements and insurance

### 🛡️ Admin Dashboard

- **User Management**: View and manage all platform users
- **Verification Queue**: Approve/reject driver and owner registrations
- **Dispute Resolution**: Handle customer and driver complaints
- **Platform Analytics**: Dashboard with key metrics and reports

### 🆘 Safety Features

- **Emergency Contacts**: Manage trusted contacts for SOS alerts
- **SOS Trigger**: One-tap emergency notification system
- **Ride Sharing**: Share live trip location with contacts

### 💳 Payments & Wallet

- **Multiple Payment Methods**: Cash, UPI, Card, Wallet
- **In-App Wallet**: Balance management with top-up
- **Transaction History**: Complete payment audit trail
- **Commission Management**: Automated driver payouts

### 📝 Dispute Management

- **Ticket System**: Structured dispute filing
- **Priority Levels**: Low, Medium, High categorization
- **Resolution Workflow**: Track status from open to resolved

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **NestJS 11** | Enterprise-grade Node.js framework |
| **TypeORM** | PostgreSQL ORM for relational data |
| **Mongoose** | MongoDB ODM for document storage |
| **Supabase** | Managed PostgreSQL with RLS |
| **Passport + JWT** | Authentication & authorization |
| **Swagger** | Auto-generated API documentation |
| **class-validator** | Request validation |
| **bcrypt** | Password hashing |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with latest features |
| **Vite 7** | Lightning-fast build tool |
| **TypeScript 5.9** | Type-safe development |
| **TailwindCSS 4** | Utility-first styling |
| **React Router 7** | Client-side routing |
| **TanStack Query** | Server state management |
| **Zustand** | Client state management |
| **React Hook Form + Zod** | Form handling & validation |
| **Radix UI** | Accessible component primitives |
| **Framer Motion** | Animations |
| **Recharts** | Data visualization |
| **Leaflet** | Interactive maps |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker Compose** | Container orchestration |
| **Redis** | Caching layer |
| **RabbitMQ** | Message queue (configured) |
| **Vercel** | Frontend deployment |
| **Railway** | Backend deployment |

---

## 🏗️ Architecture Overview

The platform follows a **modular monolith** architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Customer │ │  Driver  │ │  Owner   │ │  Admin   │ │ Public │ │
│  │  Portal  │ │  Portal  │ │  Portal  │ │  Portal  │ │  Pages │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (NestJS API)                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    API Gateway Layer                         ││
│  │        (JWT Auth, Rate Limiting, Validation, CORS)           ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────────┐ │
│  │   IAM   │ │  Trips  │ │  Cabs   │ │ Driver  │ │   Admin    │ │
│  │ Module  │ │ Module  │ │ Module  │ │ Module  │ │   Module   │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────────────┘ │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────────┐ │
│  │ Rentals │ │Disputes │ │ Safety  │ │Community│ │   Users    │ │
│  │ Module  │ │ Module  │ │ Module  │ │ Module  │ │   Module   │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌────────────┐  ┌────────────┐  ┌────────────┐
       │ PostgreSQL │  │  MongoDB   │  │   Redis    │
       │ (Supabase) │  │            │  │  (Cache)   │
       └────────────┘  └────────────┘  └────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Docker & Docker Compose** (for local services)
- **Git**

### Quick Start with Docker

1. **Clone the repository**

   ```bash
   git clone https://github.com/arunpandian9159/Jez-Cabs-Management-Platform.git
   cd Jez-Cabs-Management-Platform
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

   This starts:
   - Frontend at `http://localhost:5173`
   - Backend API at `http://localhost:3000/api`
   - RabbitMQ at `http://localhost:15672`
   - Redis at `localhost:6379`

3. **Access the application**
   - Frontend: <http://localhost:5173>
   - API Docs: <http://localhost:3000/api/docs>

### Manual Setup

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Run in development mode
npm run start:dev
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Run in development mode
npm run dev
```

### Database Setup

1. **PostgreSQL (Supabase)**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `complete_setup.sql`
   - Copy the connection string to `DATABASE_URL`

2. **MongoDB**
   - Use a local instance or MongoDB Atlas
   - Update `MONGODB_URI` in your `.env`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | ✅ |
| `PORT` | Server port (default: 3000) | ✅ |
| `API_PREFIX` | API route prefix (default: api) | ✅ |
| `DATABASE_URL` | Supabase PostgreSQL connection string | ✅ |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret for JWT token signing | ✅ |
| `JWT_EXPIRATION` | Token expiration (e.g., 7d) | ✅ |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | ✅ |
| `REDIS_HOST` | Redis host for caching | ⬜ |
| `REDIS_PORT` | Redis port (default: 6379) | ⬜ |
| `RABBITMQ_URL` | RabbitMQ connection URL | ⬜ |
| `SUPABASE_URL` | Supabase project URL | ⬜ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ⬜ |
| `CORS_ORIGIN` | Allowed CORS origins | ✅ |
| `SWAGGER_ENABLED` | Enable Swagger docs | ⬜ |
| `BCRYPT_ROUNDS` | Password hashing rounds | ⬜ |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | ✅ |
| `VITE_MAP_PROVIDER` | Map provider (leaflet) | ⬜ |

---

## 📁 Project Structure

```
Jez-Cabs-Management-Platform/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── common/            # Shared utilities, decorators, guards
│   │   ├── config/            # Configuration modules
│   │   ├── health/            # Health check endpoints
│   │   └── modules/           # Feature modules
│   │       ├── admin/         # Admin operations
│   │       ├── cab/           # Vehicle management
│   │       ├── community/     # Ride-sharing
│   │       ├── disputes/      # Dispute handling
│   │       ├── driver/        # Driver operations
│   │       ├── iam/           # Auth & authorization
│   │       ├── notification/  # Push notifications
│   │       ├── rentals/       # Vehicle rentals
│   │       ├── safety/        # Emergency features
│   │       ├── trips/         # Trip management
│   │       └── users/         # User profiles
│   └── test/                  # E2E tests
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── contexts/          # React contexts
│   │   ├── features/          # Feature modules
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── auth/          # Authentication
│   │   │   ├── booking/       # Trip booking flow
│   │   │   ├── customer/      # Customer pages
│   │   │   ├── disputes/      # Dispute filing
│   │   │   ├── driver/        # Driver pages
│   │   │   ├── owner/         # Cab owner pages
│   │   │   ├── payments/      # Payment management
│   │   │   ├── public/        # Landing pages
│   │   │   ├── rentals/       # Rental management
│   │   │   ├── rideshare/     # Community features
│   │   │   └── safety/        # Safety center
│   │   ├── layouts/           # Page layouts
│   │   ├── services/          # API services
│   │   ├── shared/            # Shared utilities
│   │   ├── styles/            # Global styles
│   │   └── types/             # TypeScript types
│   └── public/                # Static assets
│
├── docker-compose.yml         # Docker orchestration
├── complete_setup.sql         # Database schema
├── supabase_dummy_data.sql    # Sample data
└── vercel.json               # Vercel deployment config
```

---

## 👥 User Roles

| Role | Description | Access |
|------|-------------|--------|
| **Customer** | End users who book rides or rent vehicles | Booking, Rentals, Payments, Disputes |
| **Driver** | Provide transportation services | Trips, Earnings, Profile, Onboarding |
| **Cab Owner** | Own and manage vehicle fleets | Vehicles, Drivers, Contracts, Earnings |
| **Admin** | Platform administrators | Full access, Verification, Reports |
| **Support** | Customer support staff | Disputes, User queries |
| **Trip Planner** | Plan custom trips (Experimental) | Trip planning features |

---

## 📄 License

This project is **UNLICENSED** - Private use only.

---

## 🤝 Contributing

This is a private project. Please contact the repository owner for contribution guidelines.

---

<p align="center">
  Built with ❤️ for the Indian transportation sector
</p>
