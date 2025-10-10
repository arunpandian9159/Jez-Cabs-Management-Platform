export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Cab {
  id: string;
  make: string;
  model: string;
  year: number;
  registration_number: string;
  vin?: string;
  status: 'AVAILABLE' | 'RENTED' | 'IN_MAINTENANCE';
  color?: string;
  seating_capacity?: number;
  fuel_type?: string;
  insurance_expiry?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  registration_expiry?: string;
  gps_device_id?: string;
  daily_rental_rate?: number;
  current_mileage?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  cabId: string;
  driverId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  totalAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  cab?: Cab;
  driver?: Driver;
}

export interface Invoice {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  booking?: Booking;
}

export interface Checklist {
  _id: string;
  cabId: string;
  bookingId?: string;
  templateName: string;
  items: ChecklistItem[];
  isComplete: boolean;
  isApproved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  name: string;
  status: 'PASS' | 'FAIL' | 'NA';
  notes?: string;
  imageUrl?: string;
}

export interface DashboardStats {
  fleet: {
    totalCabs: number;
    availableCabs: number;
    rentedCabs: number;
    maintenanceCabs: number;
    utilizationRate: number;
  };
  drivers: {
    totalDrivers: number;
    activeDrivers: number;
    inactiveDrivers: number;
  };
  bookings: {
    totalBookings: number;
    activeBookings: number;
    completedBookings: number;
    pendingBookings: number;
  };
  revenue: {
    totalRevenue: number;
    paidRevenue: number;
    pendingRevenue: number;
    overdueInvoices: number;
    collectionRate: number;
  };
}
