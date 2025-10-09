# Cab Inventory Management Module

## Overview

The Cab Inventory Management Module provides comprehensive vehicle fleet management capabilities for the Jez Cabs platform. It enables companies to manage their entire vehicle inventory with features including CRUD operations, status tracking, document expiry alerts, and fleet analytics.

## Features

### ✅ Implemented Features

1. **Complete CRUD Operations**
   - Create new vehicles with detailed information
   - Read vehicle details with filtering and pagination
   - Update vehicle information
   - Delete vehicles (with safety checks)

2. **Vehicle Status Management**
   - Track vehicle status: AVAILABLE, RENTED, IN_MAINTENANCE
   - Update status with event emission
   - Prevent deletion of rented vehicles

3. **Document Expiry Alerts**
   - Automatic detection of expiring insurance
   - Automatic detection of expiring registration
   - Alert severity levels: critical, high, medium
   - Configurable alert window (default: 30 days)

4. **Advanced Filtering & Search**
   - Filter by status, make, model, fuel type
   - Full-text search across registration number, VIN, make, model
   - Filter vehicles with expiring documents
   - Pagination support
   - Customizable sorting

5. **Fleet Statistics**
   - Total vehicle count
   - Available vehicles count
   - Rented vehicles count
   - In-maintenance vehicles count
   - Expiring documents count
   - Fleet utilization rate

6. **Multi-Tenant Support**
   - Automatic data isolation by company
   - Unique registration numbers per company
   - Company-specific statistics

7. **Event-Driven Architecture**
   - Emits events on cab creation, update, deletion
   - Status change events
   - Ready for integration with notification system

## API Endpoints

### 1. Create Vehicle
**POST** `/api/cabs`

**Authorization:** Owner, Manager

**Request Body:**
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "registrationNumber": "ABC-1234",
  "vin": "1HGBH41JXMN109186",
  "status": "AVAILABLE",
  "color": "White",
  "seatingCapacity": 5,
  "fuelType": "Petrol",
  "insuranceExpiry": "2025-12-31",
  "insuranceProvider": "ABC Insurance Co.",
  "insurancePolicyNumber": "POL-123456",
  "registrationExpiry": "2026-06-30",
  "gpsDeviceId": "GPS-12345",
  "dailyRentalRate": 150.00,
  "currentMileage": 50000,
  "notes": "Recently serviced, excellent condition"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "companyId": "uuid",
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "registrationNumber": "ABC-1234",
  "status": "AVAILABLE",
  "createdAt": "2025-10-09T15:00:00.000Z",
  "updatedAt": "2025-10-09T15:00:00.000Z"
}
```

### 2. Get All Vehicles (with Filtering)
**GET** `/api/cabs`

**Authorization:** Any authenticated user

**Query Parameters:**
- `status` (optional): Filter by status (AVAILABLE, RENTED, IN_MAINTENANCE)
- `make` (optional): Filter by vehicle make
- `model` (optional): Filter by vehicle model
- `fuelType` (optional): Filter by fuel type
- `search` (optional): Search in registration number, VIN, make, model
- `expiringDocuments` (optional): Show only vehicles with expiring documents
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50): Items per page
- `sortBy` (optional, default: createdAt): Sort field
- `sortOrder` (optional, default: DESC): Sort order (ASC, DESC)

**Example:** `/api/cabs?status=AVAILABLE&page=1&limit=10`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "make": "Toyota",
      "model": "Camry",
      "registrationNumber": "ABC-1234",
      "status": "AVAILABLE",
      "alerts": [
        {
          "type": "insurance",
          "message": "Insurance expires in 25 days",
          "severity": "medium",
          "expiryDate": "2025-11-03"
        }
      ]
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 3. Get Fleet Statistics
**GET** `/api/cabs/statistics`

**Authorization:** Any authenticated user

**Response:** `200 OK`
```json
{
  "total": 100,
  "available": 65,
  "rented": 30,
  "inMaintenance": 5,
  "expiringDocuments": 12,
  "utilizationRate": "30.00"
}
```

### 4. Get Expiring Documents
**GET** `/api/cabs/expiring-documents?days=30`

**Authorization:** Any authenticated user

**Query Parameters:**
- `days` (optional, default: 30): Number of days to check

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "registrationNumber": "ABC-1234",
    "make": "Toyota",
    "model": "Camry",
    "alerts": [
      {
        "type": "insurance",
        "message": "Insurance expires in 15 days",
        "severity": "high",
        "expiryDate": "2025-10-24"
      }
    ]
  }
]
```

### 5. Get Single Vehicle
**GET** `/api/cabs/:id`

**Authorization:** Any authenticated user

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "companyId": "uuid",
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "registrationNumber": "ABC-1234",
  "status": "AVAILABLE",
  "insuranceExpiry": "2025-12-31",
  "registrationExpiry": "2026-06-30",
  "alerts": [...]
}
```

### 6. Update Vehicle
**PATCH** `/api/cabs/:id`

**Authorization:** Owner, Manager

**Request Body:** (all fields optional)
```json
{
  "currentMileage": 55000,
  "status": "IN_MAINTENANCE",
  "notes": "Scheduled maintenance completed"
}
```

**Response:** `200 OK`

### 7. Update Vehicle Status
**PATCH** `/api/cabs/:id/status`

**Authorization:** Owner, Manager, Staff

**Request Body:**
```json
{
  "status": "RENTED"
}
```

**Response:** `200 OK`

### 8. Delete Vehicle
**DELETE** `/api/cabs/:id`

**Authorization:** Owner, Manager

**Response:** `200 OK`
```json
{
  "message": "Vehicle deleted successfully"
}
```

**Error:** `400 Bad Request` if vehicle is currently rented

## Events Emitted

The Cab module emits the following events for integration with other modules:

### 1. `cab.created`
Emitted when a new vehicle is added to the fleet.

**Payload:**
```javascript
{
  cabId: string,
  companyId: string,
  registrationNumber: string
}
```

### 2. `cab.updated`
Emitted when vehicle details are updated.

**Payload:**
```javascript
{
  cabId: string,
  companyId: string,
  changes: UpdateCabDto
}
```

### 3. `cab.status.changed`
Emitted when vehicle status changes.

**Payload:**
```javascript
{
  cabId: string,
  companyId: string,
  oldStatus: CabStatus,
  newStatus: CabStatus
}
```

### 4. `cab.deleted`
Emitted when a vehicle is deleted.

**Payload:**
```javascript
{
  cabId: string,
  companyId: string,
  registrationNumber: string
}
```

## Business Rules

1. **Registration Number Uniqueness**
   - Registration numbers must be unique within a company
   - Different companies can have the same registration number

2. **Status Management**
   - Vehicles can only be deleted if status is not RENTED
   - Status changes emit events for other modules to react

3. **Document Expiry Alerts**
   - Alerts are automatically calculated on every read
   - Alert severity:
     - **Critical:** Document already expired
     - **High:** Expires within 7 days
     - **Medium:** Expires within 8-30 days

4. **Multi-Tenant Isolation**
   - All queries automatically filter by companyId
   - Users can only access vehicles from their company

## Database Schema

```sql
CREATE TABLE cabs (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  registration_number VARCHAR(50) NOT NULL,
  vin VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  color VARCHAR(50),
  seating_capacity INTEGER,
  fuel_type VARCHAR(50),
  insurance_expiry DATE,
  insurance_provider VARCHAR(100),
  insurance_policy_number VARCHAR(100),
  registration_expiry DATE,
  gps_device_id VARCHAR(100),
  daily_rental_rate DECIMAL(10,2),
  current_mileage INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, registration_number)
);

CREATE INDEX idx_cabs_company ON cabs(company_id);
CREATE INDEX idx_cabs_status ON cabs(status);
CREATE INDEX idx_cabs_company_status ON cabs(company_id, status);
```

## Usage Examples

### Example 1: Add a New Vehicle
```typescript
const newCab = await cabService.create({
  make: 'Honda',
  model: 'Accord',
  year: 2024,
  registrationNumber: 'XYZ-5678',
  status: CabStatus.AVAILABLE,
  dailyRentalRate: 120.00
}, currentUser);
```

### Example 2: Get Available Vehicles
```typescript
const result = await cabService.findAll({
  status: CabStatus.AVAILABLE,
  page: 1,
  limit: 20
}, currentUser);
```

### Example 3: Check Expiring Documents
```typescript
const expiringCabs = await cabService.getExpiringDocuments(currentUser, 30);
```

## Testing

Test the endpoints using Swagger UI at `http://localhost:3000/api/docs`

1. Login to get JWT token
2. Click "Authorize" and enter the token
3. Navigate to "Cabs" section
4. Try creating, reading, updating vehicles

## Future Enhancements

- [ ] Bulk import vehicles from CSV
- [ ] Vehicle maintenance history tracking
- [ ] Automated document renewal reminders
- [ ] Vehicle performance analytics
- [ ] Integration with GPS tracking
- [ ] Vehicle availability calendar
- [ ] Damage report integration

---

**Module Status:** ✅ Complete and Production Ready

