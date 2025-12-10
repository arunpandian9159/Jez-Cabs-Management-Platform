// Re-export all types from a single entry point
export * from './api.types';
export * from './booking.types';
export * from './rental.types';
export * from './driver.types';
export * from './emergency.types';
export * from './payment.types';

// Dispute types
export type DisputeCategory =
    | 'fare_issue'
    | 'route_issue'
    | 'driver_behavior'
    | 'vehicle_condition'
    | 'safety_concern'
    | 'payment_issue'
    | 'cancellation_issue'
    | 'rental_damage'
    | 'other';

export type DisputeStatus =
    | 'submitted'
    | 'under_review'
    | 'awaiting_response'
    | 'investigating'
    | 'resolved'
    | 'escalated'
    | 'closed';

export type DisputePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Dispute {
    id: string;
    ticketNumber: string;
    complainantId: string;
    complainantType: 'customer' | 'driver' | 'owner';
    complainantName: string;

    // Related entity
    relatedTo: 'booking' | 'rental' | 'payment' | 'cancellation' | 'safety' | 'other';
    bookingId?: string;
    rentalId?: string;
    transactionId?: string;
    emergencyId?: string;

    // Dispute details
    category: DisputeCategory;
    subject: string;
    description: string;

    // Evidence
    evidence: DisputeEvidence[];

    // Status
    status: DisputeStatus;
    priority: DisputePriority;

    // Assignment
    assignedTo?: string;
    assignedAt?: string;

    // Resolution
    resolution?: string;
    refundAmount?: number;
    compensationAmount?: number;
    actionTaken?: string;
    resolvedAt?: string;
    resolvedBy?: string;

    // Messages
    messages: DisputeMessage[];

    createdAt: string;
    updatedAt: string;
}

export interface DisputeEvidence {
    id: string;
    type: 'image' | 'video' | 'document' | 'audio';
    url: string;
    description?: string;
    uploadedBy: string;
    uploadedAt: string;
}

export interface DisputeMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'complainant' | 'respondent' | 'support';
    message: string;
    attachments?: string[];
    createdAt: string;
}

// Community Trip Exchange types
export type ExchangeStatus =
    | 'posted'
    | 'offers_received'
    | 'negotiating'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'expired';

export interface TripExchangePost {
    id: string;
    posterId: string;
    posterName: string;
    posterRating: number;

    // Trip details
    pickup: {
        address: string;
        city: string;
        coordinates: { lat: number; lng: number };
    };
    destination: {
        address: string;
        city: string;
        coordinates: { lat: number; lng: number };
    };
    tripDate: string;
    tripTime: string;
    estimatedDistance: number;
    estimatedDuration: number;

    // Customer info
    customerName?: string;
    customerPhone?: string;
    passengerCount: number;
    cabTypeRequired: string;

    // Exchange terms
    originalFare: number;
    offeredSplit: number; // percentage for offering driver
    minimumRating?: number;
    requiresOwnCab: boolean;
    additionalNotes?: string;

    // Status
    status: ExchangeStatus;
    interestedCount: number;
    expiresAt: string;

    createdAt: string;
    updatedAt: string;
}

export interface TripExchangeInterest {
    id: string;
    postId: string;
    driverId: string;
    driverName: string;
    driverRating: number;
    driverPhoto?: string;
    cabDetails?: {
        make: string;
        model: string;
        registrationNumber: string;
    };
    proposedSplit: number;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'negotiating' | 'withdrawn';
    createdAt: string;
}

export interface TripExchangeAgreement {
    id: string;
    postId: string;
    originalDriverId: string;
    takingDriverId: string;
    agreedSplit: number;
    customerTransferred: boolean;
    tripStarted: boolean;
    tripCompleted: boolean;
    paymentSettled: boolean;
    createdAt: string;
}

// Trip Planner types
export interface TripPlanRequest {
    id: string;
    plannerId: string;
    title: string;
    description?: string;

    // Route
    origin: {
        address: string;
        city: string;
        coordinates: { lat: number; lng: number };
    };
    destination: {
        address: string;
        city: string;
        coordinates: { lat: number; lng: number };
    };
    waypoints?: Array<{
        address: string;
        stopDuration?: number; // minutes
    }>;

    // Schedule
    departureDate: string;
    departureTime: string;
    returnDate?: string;
    isRoundTrip: boolean;

    // Requirements
    passengerCount: number;
    luggageCount: number;
    cabTypePreference?: string[];
    specialRequirements?: string[];

    // Budget
    budgetMin?: number;
    budgetMax?: number;

    // Status
    status: 'draft' | 'submitted' | 'offers_received' | 'negotiating' | 'confirmed' | 'cancelled';
    offersCount: number;

    createdAt: string;
    updatedAt: string;
    expiresAt: string;
}

export interface TripPlanOffer {
    id: string;
    requestId: string;
    providerId: string;
    providerType: 'driver' | 'cab_owner' | 'agency';
    providerName: string;
    providerRating: number;

    // Vehicle
    cabDetails: {
        make: string;
        model: string;
        type: string;
        seats: number;
        features: string[];
        images: string[];
    };

    // Driver (if included)
    driverIncluded: boolean;
    driverDetails?: {
        name: string;
        experience: number;
        rating: number;
        languages: string[];
    };

    // Pricing
    basePrice: number;
    perKmRate: number;
    driverAllowance?: number;
    tollsIncluded: boolean;
    estimatedTolls?: number;
    totalPrice: number;

    // Terms
    cancellationPolicy: string;
    paymentTerms: string;
    validUntil: string;

    status: 'pending' | 'negotiating' | 'accepted' | 'rejected' | 'expired';
    createdAt: string;
}
