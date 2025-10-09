# Jez Cabs API Testing Guide

## 🚀 Quick Start

### 1. Start the Backend

```bash
# Start infrastructure
docker-compose up -d postgres mongodb redis rabbitmq

# Start backend
cd backend
npm run start:dev
```

### 2. Access Swagger UI

Open your browser and navigate to:
```
http://localhost:3000/api/docs
```

---

## 📝 Complete Testing Flow

### Step 1: Register a Company

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "companyName": "ABC Cabs Ltd",
  "email": "owner@abccabs.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "company": {
    "id": "uuid",
    "name": "ABC Cabs Ltd",
    "email": "owner@abccabs.com"
  },
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "owner@abccabs.com",
    "role": "OWNER"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Copy the `access_token` for next steps!**

---

### Step 2: Authenticate in Swagger

1. Click the **"Authorize"** button at the top right of Swagger UI
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click **"Authorize"**
4. Click **"Close"**

Now all requests will include your authentication token!

---

### Step 3: Add a Vehicle

**Endpoint:** `POST /api/cabs`

**Request Body:**
```json
{
  "registrationNumber": "ABC-1234",
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "color": "Silver",
  "seatingCapacity": 5,
  "fuelType": "PETROL",
  "transmissionType": "AUTOMATIC",
  "insuranceNumber": "INS-2024-001",
  "insuranceExpiryDate": "2025-12-31",
  "registrationExpiryDate": "2025-06-30",
  "purchaseDate": "2023-01-15",
  "purchasePrice": 25000,
  "currentMileage": 15000,
  "status": "AVAILABLE"
}
```

**Response:**
```json
{
  "id": "cab-uuid",
  "registrationNumber": "ABC-1234",
  "make": "Toyota",
  "model": "Camry",
  "status": "AVAILABLE",
  ...
}
```

---

### Step 4: Add a Driver

**Endpoint:** `POST /api/drivers`

**Request Body:**
```json
{
  "fullName": "Mike Johnson",
  "email": "mike@abccabs.com",
  "phone": "+1234567891",
  "licenseNumber": "DL-123456",
  "licenseExpiryDate": "2026-03-15",
  "dateOfBirth": "1990-05-20",
  "address": "123 Main St, City",
  "emergencyContactName": "Jane Johnson",
  "emergencyContactPhone": "+1234567892",
  "isActive": true
}
```

**Response:**
```json
{
  "id": "driver-uuid",
  "fullName": "Mike Johnson",
  "licenseNumber": "DL-123456",
  "isActive": true,
  ...
}
```

---

### Step 5: Create a Booking

**Endpoint:** `POST /api/bookings`

**Request Body:**
```json
{
  "cabId": "cab-uuid",
  "clientName": "XYZ Corporation",
  "clientContactPerson": "Sarah Smith",
  "clientEmail": "sarah@xyzcorp.com",
  "clientPhone": "+1234567893",
  "startDate": "2025-10-15T09:00:00Z",
  "endDate": "2025-10-20T18:00:00Z",
  "pickupLocation": "Airport Terminal 1",
  "dropoffLocation": "Downtown Office",
  "totalAmount": 500,
  "advanceAmount": 100,
  "status": "PENDING"
}
```

**Response:**
```json
{
  "id": "booking-uuid",
  "cabId": "cab-uuid",
  "clientName": "XYZ Corporation",
  "status": "PENDING",
  ...
}
```

---

### Step 6: Assign Driver to Booking

**Endpoint:** `PATCH /api/bookings/{booking-uuid}/assign-driver`

**Request Body:**
```json
{
  "driverId": "driver-uuid"
}
```

**Response:**
```json
{
  "id": "booking-uuid",
  "driverId": "driver-uuid",
  "status": "PENDING",
  ...
}
```

---

### Step 7: Activate Booking

**Endpoint:** `PATCH /api/bookings/{booking-uuid}/status`

**Request Body:**
```json
{
  "status": "ACTIVE"
}
```

**Response:**
```json
{
  "id": "booking-uuid",
  "status": "ACTIVE",
  ...
}
```

**Note:** The cab status will automatically change to "RENTED"!

---

### Step 8: Create a Checklist

**Endpoint:** `POST /api/checklists`

**Request Body:**
```json
{
  "bookingId": "booking-uuid",
  "cabId": "cab-uuid",
  "templateName": "Post-Rental Inspection",
  "items": [
    {
      "itemName": "Exterior Condition",
      "status": "PASS",
      "notes": "No scratches or dents"
    },
    {
      "itemName": "Interior Cleanliness",
      "status": "PASS",
      "notes": "Clean and tidy"
    },
    {
      "itemName": "Fuel Level",
      "status": "PASS",
      "notes": "Full tank"
    },
    {
      "itemName": "Tire Condition",
      "status": "PASS",
      "notes": "Good condition"
    }
  ],
  "notes": "Vehicle returned in excellent condition"
}
```

**Response:**
```json
{
  "_id": "checklist-id",
  "bookingId": "booking-uuid",
  "cabId": "cab-uuid",
  "isComplete": true,
  "isApproved": false,
  ...
}
```

---

### Step 9: Approve Checklist

**Endpoint:** `PATCH /api/checklists/{checklist-id}/approve`

**Response:**
```json
{
  "_id": "checklist-id",
  "isApproved": true,
  "approvedBy": "user-uuid",
  "approvedAt": "2025-10-09T12:00:00Z",
  ...
}
```

---

### Step 10: Complete Booking

**Endpoint:** `PATCH /api/bookings/{booking-uuid}/status`

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Response:**
```json
{
  "id": "booking-uuid",
  "status": "COMPLETED",
  ...
}
```

**Note:** After checklist approval + booking completion, the cab status will automatically return to "AVAILABLE"!

---

### Step 11: Create Invoice

**Endpoint:** `POST /api/invoices`

**Request Body:**
```json
{
  "bookingId": "booking-uuid",
  "amount": 500,
  "taxAmount": 50,
  "discountAmount": 0,
  "status": "DRAFT",
  "notes": "Payment terms: Net 30 days"
}
```

**Response:**
```json
{
  "id": "invoice-uuid",
  "invoiceNumber": "INV-2025-00001",
  "bookingId": "booking-uuid",
  "amount": 500,
  "status": "DRAFT",
  ...
}
```

---

### Step 12: Mark Invoice as Paid

**Endpoint:** `PATCH /api/invoices/{invoice-uuid}/status`

**Request Body:**
```json
{
  "status": "PAID"
}
```

**Response:**
```json
{
  "id": "invoice-uuid",
  "status": "PAID",
  "paidDate": "2025-10-09T12:00:00Z",
  ...
}
```

---

## 📊 View Statistics

### Fleet Statistics
**GET** `/api/cabs/statistics`

```json
{
  "total": 10,
  "available": 7,
  "rented": 2,
  "inMaintenance": 1
}
```

### Driver Statistics
**GET** `/api/drivers/statistics`

```json
{
  "total": 15,
  "active": 12,
  "inactive": 3
}
```

### Booking Statistics
**GET** `/api/bookings/statistics`

```json
{
  "total": 50,
  "pending": 5,
  "active": 10,
  "completed": 30,
  "cancelled": 5,
  "totalRevenue": 25000
}
```

### Invoice Statistics
**GET** `/api/invoices/statistics`

```json
{
  "total": 45,
  "draft": 5,
  "sent": 10,
  "paid": 25,
  "overdue": 5,
  "totalRevenue": 22500
}
```

### Checklist Statistics
**GET** `/api/checklists/statistics`

```json
{
  "total": 40,
  "completed": 35,
  "approved": 30,
  "pending": 5
}
```

---

## 🔍 Advanced Filtering Examples

### Filter Cabs by Status
**GET** `/api/cabs?status=AVAILABLE&page=1&limit=10`

### Filter Drivers by Active Status
**GET** `/api/drivers?isActive=true&page=1&limit=10`

### Filter Bookings by Date Range
**GET** `/api/bookings?startDate=2025-10-01&endDate=2025-10-31&status=ACTIVE`

### Filter Invoices by Status
**GET** `/api/invoices?status=PAID&page=1&limit=10`

### Filter Checklists by Booking
**GET** `/api/checklists?bookingId=booking-uuid`

---

## 🎯 Business Rules to Test

### 1. Conflict Detection
Try creating two bookings for the same cab with overlapping dates:
- **Expected:** Second booking should fail with conflict error

### 2. Driver Conflict Detection
Try assigning the same driver to two overlapping bookings:
- **Expected:** Second assignment should fail

### 3. Checklist Approval Gate
Try completing a booking without approving the checklist:
- **Expected:** Cab should remain "RENTED" until checklist is approved

### 4. Document Expiry Alerts
**GET** `/api/cabs/expiring-documents`
- **Expected:** List of vehicles with documents expiring in 30 days

### 5. License Expiry Alerts
**GET** `/api/drivers/expiring-licenses`
- **Expected:** List of drivers with licenses expiring in 30 days

---

## 🛠️ Troubleshooting

### Issue: "Unauthorized" Error
**Solution:** Make sure you clicked "Authorize" and entered the Bearer token

### Issue: "Not Found" Error
**Solution:** Check that you're using the correct UUID from previous responses

### Issue: "Validation Failed" Error
**Solution:** Check the request body matches the expected format in Swagger

### Issue: "Conflict" Error
**Solution:** This is expected! The system is preventing double-booking

---

## 🎉 Success!

You've now tested the complete booking lifecycle:
1. ✅ Company registration
2. ✅ Vehicle management
3. ✅ Driver management
4. ✅ Booking creation
5. ✅ Driver assignment
6. ✅ Booking activation
7. ✅ Checklist completion
8. ✅ Checklist approval
9. ✅ Booking completion
10. ✅ Invoice generation
11. ✅ Payment tracking

The Jez Cabs platform is fully functional! 🚀

