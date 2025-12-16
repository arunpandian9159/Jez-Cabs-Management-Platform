# 📚 API Reference

> Complete API documentation for the Jez Cabs Management Platform backend.

---

## 📋 Table of Contents

- [Base URL](#-base-url)
- [Authentication](#-authentication)
- [Rate Limiting](#-rate-limiting)
- [Error Handling](#-error-handling)
- [Endpoints](#-endpoints)
  - [Authentication](#authentication)
  - [Trips](#trips)
  - [Cabs](#cabs)
  - [Driver](#driver)
  - [Owner](#owner)
  - [Users](#users)
  - [Rentals](#rentals)
  - [Disputes](#disputes)
  - [Safety](#safety)
  - [Community](#community)
  - [Admin](#admin)

---

## 🌐 Base URL

| Environment | URL |
|-------------|-----|
| **Development** | `http://localhost:3000/api/v1` |
| **Production** | `https://your-domain.com/api/v1` |

All endpoints are prefixed with `/api/v1`.

---

## 🔐 Authentication

### Authentication Method

The API uses **JWT (JSON Web Tokens)** for authentication. Include the token in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

1. **Register** a new account via `POST /auth/register`
2. **Login** with credentials via `POST /auth/login`
3. The response includes an `access_token` that should be used for all subsequent requests

### Token Expiration

| Token Type | Expiration |
|------------|------------|
| Access Token | 7 days (configurable via `JWT_EXPIRATION`) |
| Refresh Token | 30 days (configurable via `JWT_REFRESH_EXPIRATION`) |

### Protected Routes

Most endpoints require authentication. Public endpoints are explicitly marked with `@Public()` decorator.

---

## ⏱️ Rate Limiting

The API implements rate limiting to prevent abuse:

| Endpoint Type | Limit |
|--------------|-------|
| **Registration** | 3 requests per minute |
| **Login** | 5 requests per minute |
| **General API** | 10 requests per minute (default) |
| **Authenticated** | Skip rate limiting |

When rate limited, the API returns:

```json
{
  "statusCode": 429,
  "message": "Too many requests"
}
```

---

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Missing or invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found |
| `409` | Conflict - Resource already exists |
| `429` | Too Many Requests - Rate limited |
| `500` | Internal Server Error |

---

## 📡 Endpoints

### Authentication

Authentication endpoints for user registration, login, and profile management.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login with credentials | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ |

#### POST /auth/register

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210",
  "role": "customer"
}
```

**Validation Rules:**

- `email`: Valid email format
- `password`: Min 8 characters, must contain uppercase, lowercase, and number/special char
- `firstName`: Min 2 characters
- `lastName`: Min 1 character
- `phone`: 10-digit Indian phone number (starts with 6-9)
- `role`: One of `customer`, `driver`, `cab_owner` (optional, defaults to `customer`)

**Response (201):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### POST /auth/login

Authenticate and receive JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### GET /auth/me

Get the currently authenticated user's profile.

**Headers:**

```http
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210",
  "role": "customer",
  "status": "active",
  "is_verified": true
}
```

---

### Trips

Trip management endpoints for booking and tracking rides.

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `POST` | `/trips` | Create a new trip | ✅ | All |
| `GET` | `/trips` | List trips | ✅ | All |
| `GET` | `/trips/:id` | Get trip details | ✅ | All |
| `PATCH` | `/trips/:id/accept` | Accept a trip (driver) | ✅ | Driver |
| `PATCH` | `/trips/:id/start` | Start trip with OTP | ✅ | Driver |
| `PATCH` | `/trips/:id/complete` | Complete a trip | ✅ | Driver |
| `PATCH` | `/trips/:id/cancel` | Cancel a trip | ✅ | All |
| `POST` | `/trips/:id/rate` | Rate a completed trip | ✅ | All |

#### POST /trips

Create a new trip booking.

**Request Body:**

```json
{
  "pickup_address": "123 Main Street, Chennai",
  "pickup_lat": 13.0827,
  "pickup_lng": 80.2707,
  "dropoff_address": "Tech Park, OMR Road, Chennai",
  "dropoff_lat": 12.9716,
  "dropoff_lng": 80.2401,
  "estimated_fare": 250.00,
  "cab_type": "sedan"
}
```

**Response (201):**

```json
{
  "id": "trip-uuid",
  "customer_id": "user-uuid",
  "pickup_address": "123 Main Street, Chennai",
  "dropoff_address": "Tech Park, OMR Road, Chennai",
  "status": "pending",
  "otp": "123456",
  "estimated_fare": 250.00,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

#### PATCH /trips/:id/accept

Driver accepts a pending trip.

**Request Body:**

```json
{
  "cab_id": "cab-uuid"
}
```

**Response (200):**

```json
{
  "id": "trip-uuid",
  "driver_id": "driver-uuid",
  "cab_id": "cab-uuid",
  "status": "accepted",
  "accepted_at": "2024-01-15T10:31:00Z"
}
```

---

#### PATCH /trips/:id/start

Start the trip after OTP verification.

**Request Body:**

```json
{
  "otp": "123456"
}
```

**Response (200):**

```json
{
  "id": "trip-uuid",
  "status": "in_progress",
  "started_at": "2024-01-15T10:35:00Z"
}
```

---

#### PATCH /trips/:id/complete

Complete the trip and calculate final fare.

**Request Body:**

```json
{
  "actual_fare": 275.50
}
```

**Response (200):**

```json
{
  "id": "trip-uuid",
  "status": "completed",
  "actual_fare": 275.50,
  "distance_km": 12.5,
  "duration_minutes": 35,
  "completed_at": "2024-01-15T11:10:00Z"
}
```

---

### Cabs

Vehicle fleet management endpoints.

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `POST` | `/cabs` | Add a new vehicle | ✅ | Owner, Admin |
| `GET` | `/cabs` | List all vehicles | ✅ | All |
| `GET` | `/cabs/available` | Get available cabs | ✅ | All |
| `GET` | `/cabs/statistics` | Get fleet statistics | ✅ | Owner, Admin |
| `GET` | `/cabs/:id` | Get vehicle details | ✅ | All |
| `PATCH` | `/cabs/:id` | Update vehicle | ✅ | Owner, Admin |
| `PATCH` | `/cabs/:id/status` | Update vehicle status | ✅ | Owner, Admin, Driver |
| `PATCH` | `/cabs/:id/assign-driver` | Assign driver to vehicle | ✅ | Owner, Admin |
| `DELETE` | `/cabs/:id` | Remove a vehicle | ✅ | Owner, Admin |

#### POST /cabs

Add a new vehicle to the fleet.

**Request Body:**

```json
{
  "make": "Maruti",
  "model": "Swift Dzire",
  "year": 2023,
  "registration_number": "TN01AB1234",
  "cab_type": "sedan",
  "color": "White",
  "seating_capacity": 4,
  "fuel_type": "Petrol",
  "ac_available": true,
  "base_fare": 50.00,
  "per_km_rate": 12.00,
  "per_min_rate": 2.00
}
```

**Cab Types:** `sedan`, `suv`, `hatchback`, `premium`, `electric`, `auto`

**Response (201):**

```json
{
  "id": "cab-uuid",
  "owner_id": "owner-uuid",
  "make": "Maruti",
  "model": "Swift Dzire",
  "registration_number": "TN01AB1234",
  "cab_type": "sedan",
  "status": "inactive",
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

#### GET /cabs/available

Get available cabs near a location.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `lat` | number | Latitude (optional) |
| `lng` | number | Longitude (optional) |
| `type` | string | Cab type filter (optional) |

**Response (200):**

```json
[
  {
    "id": "cab-uuid",
    "make": "Maruti",
    "model": "Swift Dzire",
    "cab_type": "sedan",
    "status": "available",
    "rating": 4.8,
    "driver": {
      "name": "Rajesh Kumar",
      "rating": 4.9
    }
  }
]
```

---

### Driver

Driver-specific operations.

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/drivers/profile` | Get driver profile | ✅ | Driver |
| `GET` | `/drivers/verification-status` | Get verification status | ✅ | Driver |
| `POST` | `/drivers/onboarding` | Complete onboarding | ✅ | Driver |
| `GET` | `/drivers/stats` | Get dashboard stats | ✅ | Driver |
| `GET` | `/drivers/trip-requests` | Get pending trip requests | ✅ | Driver |
| `PATCH` | `/drivers/profile` | Update profile | ✅ | Driver |
| `PATCH` | `/drivers/status` | Update availability status | ✅ | Driver |
| `PATCH` | `/drivers/location` | Update GPS location | ✅ | Driver |
| `GET` | `/drivers/earnings` | Get earnings summary | ✅ | Driver |
| `PATCH` | `/drivers/go-online` | Go online | ✅ | Driver |
| `PATCH` | `/drivers/go-offline` | Go offline | ✅ | Driver |

#### POST /drivers/onboarding

Complete driver onboarding with document uploads.

**Content-Type:** `multipart/form-data`

**Form Fields:**

```
license_number: "TN1234567890"
license_expiry: "2025-12-31"
date_of_birth: "1990-05-15"
address: "123 Driver Street, Chennai"
license_front: <file>
license_back: <file>
aadhaar_front: <file>
aadhaar_back: <file>
police_clearance: <file> (optional)
vehicle_rc: <file> (optional)
vehicle_insurance: <file> (optional)
```

**Response (201):**

```json
{
  "message": "Onboarding completed successfully",
  "verification_status": "pending",
  "profile": {
    "id": "profile-uuid",
    "user_id": "user-uuid",
    "license_number": "TN1234567890",
    "status": "offline"
  }
}
```

---

#### PATCH /drivers/location

Update real-time driver location.

**Request Body:**

```json
{
  "lat": 13.0827,
  "lng": 80.2707
}
```

**Response (200):**

```json
{
  "message": "Location updated",
  "current_location_lat": 13.0827,
  "current_location_lng": 80.2707
}
```

---

### Owner

Cab owner portal endpoints.

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/owner/drivers` | List assigned drivers | ✅ | Owner |
| `GET` | `/owner/drivers/:id` | Get driver details | ✅ | Owner |
| `PATCH` | `/owner/drivers/:id/assign` | Assign vehicle to driver | ✅ | Owner |
| `DELETE` | `/owner/drivers/:id` | Remove driver | ✅ | Owner |
| `GET` | `/owner/earnings/summary` | Get earnings summary | ✅ | Owner |
| `GET` | `/owner/earnings/by-cab` | Earnings by vehicle | ✅ | Owner |
| `GET` | `/owner/earnings/monthly` | Monthly earnings chart | ✅ | Owner |
| `GET` | `/owner/transactions` | Transaction history | ✅ | Owner |
| `GET` | `/owner/contracts` | List contracts | ✅ | Owner |
| `GET` | `/owner/contracts/:id` | Get contract details | ✅ | Owner |
| `POST` | `/owner/contracts` | Create new contract | ✅ | Owner |
| `PATCH` | `/owner/contracts/:id` | Update contract | ✅ | Owner |
| `PATCH` | `/owner/contracts/:id/renew` | Renew contract | ✅ | Owner |
| `PATCH` | `/owner/contracts/:id/terminate` | Terminate contract | ✅ | Owner |
| `GET` | `/owner/settings` | Get owner settings | ✅ | Owner |
| `PATCH` | `/owner/settings` | Update settings | ✅ | Owner |

#### GET /owner/earnings/summary

Get earnings summary with period filter.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | string | `week`, `month`, `quarter`, `year` |

**Response (200):**

```json
{
  "totalEarnings": 125000.00,
  "totalTrips": 450,
  "averagePerTrip": 277.78,
  "commissionPaid": 25000.00,
  "netEarnings": 100000.00,
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-31"
}
```

---

### Users

User profile and preferences.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/addresses` | Get saved addresses | ✅ |
| `POST` | `/users/addresses` | Add saved address | ✅ |
| `PATCH` | `/users/addresses/:id` | Update address | ✅ |
| `DELETE` | `/users/addresses/:id` | Delete address | ✅ |
| `GET` | `/users/recent-destinations` | Get recent destinations | ✅ |
| `GET` | `/users/payment-methods` | List payment methods | ✅ |
| `POST` | `/users/payment-methods` | Add payment method | ✅ |
| `DELETE` | `/users/payment-methods/:id` | Remove payment method | ✅ |
| `PATCH` | `/users/payment-methods/:id/default` | Set default method | ✅ |
| `GET` | `/users/wallet` | Get wallet balance | ✅ |
| `GET` | `/users/transactions` | Transaction history | ✅ |
| `GET` | `/users/payment-stats` | Payment statistics | ✅ |

#### POST /users/addresses

Add a saved address (Home, Work, etc.)

**Request Body:**

```json
{
  "label": "Home",
  "address": "123 Main Street, Chennai",
  "lat": 13.0827,
  "lng": 80.2707,
  "icon": "🏠",
  "is_default": true
}
```

**Response (201):**

```json
{
  "id": "address-uuid",
  "label": "Home",
  "address": "123 Main Street, Chennai",
  "is_default": true,
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

### Rentals

Vehicle rental management.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/rentals` | Create rental booking | ✅ |
| `GET` | `/rentals` | List user's rentals | ✅ |
| `GET` | `/rentals/:id` | Get rental details | ✅ |
| `PATCH` | `/rentals/:id/confirm` | Confirm rental | ✅ |
| `PATCH` | `/rentals/:id/cancel` | Cancel rental | ✅ |

#### POST /rentals

Create a new rental booking.

**Request Body:**

```json
{
  "cab_id": "cab-uuid",
  "start_date": "2024-02-01T10:00:00Z",
  "end_date": "2024-02-03T10:00:00Z",
  "pickup_location": "Chennai Airport",
  "return_location": "Chennai Airport",
  "with_driver": true,
  "km_limit_per_day": 300
}
```

**Response (201):**

```json
{
  "id": "rental-uuid",
  "customer_id": "user-uuid",
  "cab_id": "cab-uuid",
  "status": "pending",
  "daily_rate": 2500.00,
  "total_amount": 7500.00,
  "deposit_amount": 5000.00,
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

### Disputes

Dispute filing and management.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/disputes` | File a dispute | ✅ |
| `GET` | `/disputes` | List disputes | ✅ |
| `GET` | `/disputes/:id` | Get dispute details | ✅ |
| `PATCH` | `/disputes/:id/resolve` | Resolve dispute | ✅ Admin |
| `PATCH` | `/disputes/:id/status` | Update status | ✅ Admin |

#### POST /disputes

File a new dispute.

**Request Body:**

```json
{
  "trip_id": "trip-uuid",
  "issue_type": "fare_issue",
  "description": "The driver took a longer route and charged extra.",
  "priority": "medium"
}
```

**Issue Types:** `fare_issue`, `route_issue`, `driver_behavior`, `vehicle_condition`, `safety_concern`, `payment_issue`, `other`

**Response (201):**

```json
{
  "id": "dispute-uuid",
  "ticket_number": "DSP-2024-001234",
  "status": "open",
  "priority": "medium",
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

### Safety

Emergency contact and SOS features.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/safety/contacts` | List emergency contacts | ✅ |
| `POST` | `/safety/contacts` | Add emergency contact | ✅ |
| `PATCH` | `/safety/contacts/:id` | Update contact | ✅ |
| `DELETE` | `/safety/contacts/:id` | Remove contact | ✅ |
| `PATCH` | `/safety/contacts/:id/primary` | Set as primary | ✅ |
| `POST` | `/safety/sos` | Trigger SOS alert | ✅ |

#### POST /safety/contacts

Add an emergency contact.

**Request Body:**

```json
{
  "name": "Jane Doe",
  "phone": "9876543210",
  "relationship": "Spouse",
  "notify_on_ride_start": true,
  "notify_on_ride_end": true,
  "notify_on_sos": true
}
```

---

#### POST /safety/sos

Trigger emergency SOS alert to all contacts.

**Response (200):**

```json
{
  "message": "SOS alert sent to emergency contacts",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

### Community

Community ride-sharing features.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/community/trips` | List community trips | ✅ |
| `GET` | `/community/trips/my` | Get user's posts | ✅ |
| `POST` | `/community/trips` | Post a trip exchange | ✅ |
| `GET` | `/community/trips/:id` | Get trip details | ✅ |
| `POST` | `/community/trips/:id/book` | Book seats | ✅ |
| `PATCH` | `/community/trips/:id/cancel` | Cancel post | ✅ |

#### POST /community/trips

Post a trip for exchange or sharing.

**Request Body:**

```json
{
  "trip_type": "offering",
  "from_location": "Chennai",
  "from_lat": 13.0827,
  "from_lng": 80.2707,
  "to_location": "Bangalore",
  "to_lat": 12.9716,
  "to_lng": 77.5946,
  "departure_date": "2024-02-01",
  "departure_time": "06:00",
  "seats_available": 3,
  "price_per_seat": 500.00,
  "description": "Early morning trip to Bangalore. AC car."
}
```

**Trip Types:** `offering`, `requesting`

---

### Admin

Administrative endpoints (requires `admin` or `support` role).

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/admin/dashboard/stats` | Dashboard statistics | ✅ | Admin |
| `GET` | `/admin/users` | List all users | ✅ | Admin |
| `GET` | `/admin/users/stats` | User statistics | ✅ | Admin |
| `GET` | `/admin/verifications` | List verifications | ✅ | Admin |
| `GET` | `/admin/verifications/stats` | Verification stats | ✅ | Admin |
| `GET` | `/admin/verifications/:id` | Get verification | ✅ | Admin |
| `PATCH` | `/admin/verifications/:id/approve` | Approve verification | ✅ | Admin |
| `PATCH` | `/admin/verifications/:id/reject` | Reject verification | ✅ | Admin |

#### GET /admin/dashboard/stats

Get platform-wide statistics.

**Response (200):**

```json
{
  "totalUsers": 15420,
  "totalDrivers": 523,
  "totalOwners": 89,
  "totalCabs": 312,
  "totalTrips": 45230,
  "totalRevenue": 12500000.00,
  "pendingVerifications": 23,
  "activeDisputes": 12,
  "todayTrips": 156
}
```

---

#### PATCH /admin/verifications/:id/approve

Approve a driver or owner verification.

**Request Body:**

```json
{
  "notes": "All documents verified successfully."
}
```

**Response (200):**

```json
{
  "id": "verification-uuid",
  "status": "approved",
  "verified_by": "admin-uuid",
  "verified_at": "2024-01-15T10:00:00Z"
}
```

---

#### PATCH /admin/verifications/:id/reject

Reject a verification request.

**Request Body:**

```json
{
  "reason": "License document is not clearly visible. Please resubmit."
}
```

**Response (200):**

```json
{
  "id": "verification-uuid",
  "status": "rejected",
  "rejection_reason": "License document is not clearly visible.",
  "rejected_by": "admin-uuid"
}
```

---

## 📖 Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

Features:

- Try out endpoints directly
- View request/response schemas
- JWT authentication support
- Download OpenAPI spec

---

<p align="center">
  <i>API documentation generated from codebase analysis</i><br>
  <i>Last updated: December 2024</i>
</p>
