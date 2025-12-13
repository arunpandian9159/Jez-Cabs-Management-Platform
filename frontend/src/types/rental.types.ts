import type { Location, Cab } from '@/types/booking.types';

// Rental types
export type RentalType = 'with_driver' | 'self_drive';

export type RentalStatus =
  | 'pending'
  | 'awaiting_offers'
  | 'offer_received'
  | 'document_verification'
  | 'payment_pending'
  | 'confirmed'
  | 'active'
  | 'returning'
  | 'completed'
  | 'cancelled';

export type RentalPeriod = 'hourly' | 'daily' | 'weekly' | 'monthly';

// Rental request
export interface RentalRequest {
  id: string;
  customerId: string;
  rentalType: RentalType;
  cabType?: string;
  preferredCabIds?: string[];
  pickupLocation: Location;
  returnLocation?: Location;
  startDate: string;
  endDate: string;
  rentalPeriod: RentalPeriod;
  estimatedKm?: number;
  requirements?: string;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
}

// Rental offer from cab owner
export interface RentalOffer {
  id: string;
  rentalRequestId: string;
  ownerId: string;
  ownerName: string;
  ownerRating: number;
  cabId: string;
  cab: Cab;
  pricePerDay: number;
  pricePerKm?: number;
  securityDeposit: number;
  fuelPolicy: 'full_to_full' | 'same_to_same' | 'included';
  kmLimit?: number;
  excessKmCharge?: number;
  driverIncluded: boolean;
  driverDailyRate?: number;
  terms?: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'negotiating';
  createdAt: string;
}

// Active rental
export interface Rental {
  id: string;
  request: RentalRequest;
  offer: RentalOffer;
  customerId: string;
  ownerId: string;
  driverId?: string;
  cab: Cab;
  status: RentalStatus;
  advancePayment: number;
  advancePaidAt?: string;
  totalAmount?: number;
  finalPayment?: number;
  finalPaidAt?: string;
  startOdometer?: number;
  endOdometer?: number;
  actualKm?: number;
  pickupChecklist?: RentalChecklist;
  returnChecklist?: RentalChecklist;
  pickupAt?: string;
  returnAt?: string;
  customerRating?: number;
  ownerRating?: number;
  createdAt: string;
  updatedAt: string;
}

// Rental checklist
export interface RentalChecklist {
  id: string;
  rentalId: string;
  type: 'pickup' | 'return';
  fuelLevel: number; // percentage
  odometerReading: number;
  exteriorPhotos: string[];
  interiorPhotos: string[];
  damageNotes?: string;
  items: ChecklistItem[];
  completedBy: string;
  completedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ChecklistItem {
  name: string;
  status: 'ok' | 'damaged' | 'missing' | 'na';
  notes?: string;
  photos?: string[];
}
