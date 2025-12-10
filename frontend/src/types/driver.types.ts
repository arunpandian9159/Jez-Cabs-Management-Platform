import type { LatLng, Cab, CabType } from './booking.types';

// Driver verification status
export type VerificationStatus =
    | 'pending'
    | 'documents_uploaded'
    | 'under_review'
    | 'background_check'
    | 'approved'
    | 'rejected'
    | 'suspended';

// Driver availability
export type DriverAvailability = 'online' | 'offline' | 'busy' | 'break';

// Service types a driver can offer
export type ServiceType =
    | 'instant_booking'
    | 'rental_with_driver'
    | 'outstation'
    | 'airport_transfer'
    | 'hourly_rental';

// Driver entity
export interface Driver {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    photo?: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    city: string;
    state: string;
    pincode: string;

    // License details
    licenseNumber: string;
    licenseExpiry: string;
    licenseType: string;
    licenseFrontPhoto?: string;
    licenseBackPhoto?: string;

    // Identity documents
    idType: 'aadhaar' | 'pan' | 'passport' | 'voter_id';
    idNumber: string;
    idFrontPhoto?: string;
    idBackPhoto?: string;
    addressProofPhoto?: string;

    // Bank details
    bankName?: string;
    bankAccountNumber?: string;
    bankIfsc?: string;
    upiId?: string;

    // Verification
    verificationStatus: VerificationStatus;
    verificationNotes?: string;
    verifiedAt?: string;
    verifiedBy?: string;
    backgroundCheckStatus?: 'pending' | 'passed' | 'failed';
    backgroundCheckDate?: string;

    // Service settings
    serviceTypes: ServiceType[];
    cabTypes: CabType[];
    availability: DriverAvailability;
    currentLocation?: LatLng;
    lastLocationUpdate?: string;

    // Associated cab (for independent drivers)
    ownsCab: boolean;
    cabId?: string;
    cab?: Cab;

    // Stats
    rating: number;
    totalTrips: number;
    completionRate: number;
    acceptanceRate: number;
    cancelRate: number;
    totalEarnings: number;

    // Preferences
    maxDistanceKm?: number;
    preferredAreas?: string[];
    languagesSpoken?: string[];

    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Driver onboarding step
export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
    fields: string[];
}

// Driver earnings
export interface DriverEarnings {
    period: 'today' | 'week' | 'month' | 'custom';
    totalTrips: number;
    totalEarnings: number;
    totalDistance: number;
    averageTripValue: number;
    tips: number;
    bonuses: number;
    deductions: number;
    netEarnings: number;
    pendingSettlement: number;
    lastSettlementDate?: string;
    breakdown: EarningsBreakdown[];
}

export interface EarningsBreakdown {
    date: string;
    trips: number;
    earnings: number;
    distance: number;
    tips: number;
}

// Service request for drivers
export interface ServiceRequest {
    id: string;
    type: 'instant_booking' | 'rental' | 'trip_exchange';
    bookingId?: string;
    rentalId?: string;
    exchangeId?: string;
    customer: {
        id: string;
        name: string;
        phone: string;
        rating: number;
    };
    pickup: {
        address: string;
        coordinates: LatLng;
        distance: number; // km from driver
        eta: number; // minutes
    };
    destination?: {
        address: string;
        coordinates: LatLng;
        distance: number; // total trip distance
        duration: number; // estimated minutes
    };
    fare: number;
    cabType: CabType;
    expiresAt: string;
    createdAt: string;
}
