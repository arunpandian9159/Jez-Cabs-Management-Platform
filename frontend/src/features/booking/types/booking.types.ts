// Geographic types
export interface LatLng {
    lat: number;
    lng: number;
}

export interface Location {
    coordinates: LatLng;
    address: string;
    placeId?: string;
    name?: string;
}

// Cab types
export type CabType =
    | 'economy'
    | 'comfort'
    | 'premium'
    | 'suv'
    | 'van'
    | 'luxury';

export type CabStatus =
    | 'available'
    | 'rented'
    | 'in_trip'
    | 'maintenance'
    | 'inactive';

export interface Cab {
    id: string;
    ownerId: string;
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
    color: string;
    cabType: CabType;
    status: CabStatus;
    seats: number;
    fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';
    transmission: 'automatic' | 'manual';
    images: string[];
    dailyRate: number;
    perKmRate: number;
    insuranceExpiry: string;
    registrationExpiry: string;
    lastServiceDate?: string;
    features: string[];
    rating: number;
    totalTrips: number;
    createdAt: string;
    updatedAt: string;
}

// Booking states
export type BookingStatus =
    | 'pending'
    | 'searching_driver'
    | 'driver_assigned'
    | 'driver_arrived'
    | 'trip_started'
    | 'trip_completed'
    | 'cancelled'
    | 'no_driver_available';

// Fare breakdown
export interface FareBreakdown {
    baseFare: number;
    distanceCharge: number;
    timeCharge: number;
    surgeFactor?: number;
    surgeAmount?: number;
    discount?: number;
    discountCode?: string;
    taxes: number;
    toll?: number;
    tip?: number;
    total: number;
    currency: string;
}

// Booking entity
export interface Booking {
    id: string;
    customerId: string;
    driverId?: string;
    cabId?: string;
    pickup: Location;
    destination: Location;
    waypoints?: Location[];
    cabType: CabType;
    status: BookingStatus;
    estimatedDistance: number; // in km
    estimatedDuration: number; // in minutes
    actualDistance?: number;
    actualDuration?: number;
    fare: FareBreakdown;
    scheduledAt?: string;
    driverAssignedAt?: string;
    driverArrivedAt?: string;
    tripStartedAt?: string;
    tripCompletedAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    customerRating?: number;
    driverRating?: number;
    customerFeedback?: string;
    driverFeedback?: string;
    paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    paymentMethod?: string;
    createdAt: string;
    updatedAt: string;
}

// Price estimate for booking
export interface PriceEstimate {
    cabType: CabType;
    cabTypeName: string;
    cabTypeIcon: string;
    fareBreakdown: FareBreakdown;
    estimatedPickupTime: number; // minutes
    surgeFactor?: number;
    available: boolean;
}

// Driver search result
export interface DriverSearchResult {
    driverId: string;
    driverName: string;
    driverPhoto?: string;
    driverRating: number;
    cabDetails: {
        make: string;
        model: string;
        color: string;
        registrationNumber: string;
    };
    eta: number; // minutes to pickup
    distance: number; // km from pickup
}

// Trip tracking state
export interface TripTrackingState {
    bookingId: string;
    driverLocation: LatLng;
    customerLocation?: LatLng;
    route: LatLng[];
    eta: number;
    distance: number;
    status: BookingStatus;
    lastUpdated: string;
}
