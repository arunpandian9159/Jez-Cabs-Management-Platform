// Application constants

export const APP_NAME = 'Jez Cabs';
export const APP_DESCRIPTION = 'Your trusted cab partner';

// Local storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER: 'user',
    THEME: 'theme',
    RECENT_LOCATIONS: 'recent_locations',
    SAVED_ADDRESSES: 'saved_addresses',
} as const;

// Route paths by role
export const ROUTES = {
    // Public
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DRIVER_REGISTER: '/driver/register',
    OWNER_REGISTER: '/owner/register',

    // Customer
    CUSTOMER: {
        DASHBOARD: '/customer/dashboard',
        BOOK: '/customer/book',
        BOOK_LOCATION: '/customer/book/location',
        BOOK_SELECT_CAB: '/customer/book/select-cab',
        BOOK_SEARCHING: '/customer/book/searching',
        BOOK_TRACKING: '/customer/book/tracking',
        BOOK_COMPLETE: '/customer/book/complete',
        RENTALS: '/customer/rentals',
        RENTALS_BROWSE: '/customer/rentals/browse',
        RENTALS_ACTIVE: '/customer/rentals/active',
        TRIPS: '/customer/trips',
        PAYMENTS: '/customer/payments',
        DISPUTES: '/customer/disputes',
        SAFETY: '/customer/safety',
        PROFILE: '/customer/profile',
    },

    // Driver
    DRIVER: {
        DASHBOARD: '/driver/dashboard',
        ONBOARDING: '/driver/onboarding',
        AVAILABILITY: '/driver/availability',
        REQUESTS: '/driver/requests',
        ACTIVE_TRIP: '/driver/active-trip',
        HISTORY: '/driver/history',
        EARNINGS: '/driver/earnings',
        COMMUNITY: '/driver/community',
        COMMUNITY_BROWSE: '/driver/community/browse',
        COMMUNITY_POST: '/driver/community/post',
        PROFILE: '/driver/profile',
    },

    // Cab Owner
    OWNER: {
        DASHBOARD: '/owner',
        CABS: '/owner/cabs',
        CABS_REGISTER: '/owner/cabs/register',
        DRIVERS: '/owner/drivers',
        BOOKINGS: '/owner/bookings',
        EARNINGS: '/owner/earnings',
        PROFILE: '/owner/profile',
    },

    // Trip Planner
    PLANNER: {
        DASHBOARD: '/planner/dashboard',
        CREATE: '/planner/create',
        REQUESTS: '/planner/requests',
        BOOKINGS: '/planner/bookings',
        PROFILE: '/planner/profile',
    },

    // Admin
    ADMIN: {
        DASHBOARD: '/admin',
        USERS: '/admin/users',
        DRIVERS: '/admin/drivers',
        DRIVERS_VERIFICATION: '/admin/drivers/verification',
        CABS: '/admin/cabs',
        BOOKINGS: '/admin/bookings',
        PAYMENTS: '/admin/payments',
        DISPUTES: '/admin/disputes',
        SAFETY: '/admin/safety',
        SAFETY_ACTIVE: '/admin/safety/active',
        REPORTS: '/admin/reports',
    },

    // Support
    SUPPORT: {
        DASHBOARD: '/support/dashboard',
        DISPUTES: '/support/disputes',
        SAFETY: '/support/safety',
        USERS: '/support/users',
    },
} as const;

// Cab type configuration
export const CAB_TYPES = {
    economy: {
        name: 'Economy',
        description: 'Affordable rides for everyday travel',
        icon: '🚗',
        seats: 4,
        baseFare: 50,
        perKmRate: 12,
        perMinRate: 1.5,
    },
    comfort: {
        name: 'Comfort',
        description: 'Comfortable sedans with AC',
        icon: '🚙',
        seats: 4,
        baseFare: 70,
        perKmRate: 15,
        perMinRate: 2,
    },
    premium: {
        name: 'Premium',
        description: 'Premium experience with top vehicles',
        icon: '🚕',
        seats: 4,
        baseFare: 100,
        perKmRate: 20,
        perMinRate: 2.5,
    },
    suv: {
        name: 'SUV',
        description: 'Spacious SUVs for groups',
        icon: '🚐',
        seats: 6,
        baseFare: 120,
        perKmRate: 22,
        perMinRate: 3,
    },
    van: {
        name: 'Van',
        description: 'Large vans for big groups',
        icon: '🚌',
        seats: 8,
        baseFare: 150,
        perKmRate: 25,
        perMinRate: 3.5,
    },
    luxury: {
        name: 'Luxury',
        description: 'Luxury vehicles for special occasions',
        icon: '🏎️',
        seats: 4,
        baseFare: 200,
        perKmRate: 35,
        perMinRate: 5,
    },
} as const;

// Status color mapping
export const STATUS_COLORS = {
    // Booking statuses
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    searching_driver: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    driver_assigned: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
    driver_arrived: { bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-500' },
    trip_started: { bg: 'bg-cyan-100', text: 'text-cyan-800', dot: 'bg-cyan-500' },
    trip_completed: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    no_driver_available: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },

    // Driver statuses
    online: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    offline: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
    busy: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
    break: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },

    // Verification statuses
    documents_uploaded: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    under_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    background_check: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    suspended: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },

    // Cab statuses
    available: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    rented: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    in_trip: { bg: 'bg-cyan-100', text: 'text-cyan-800', dot: 'bg-cyan-500' },
    maintenance: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },

    // Payment statuses
    processing: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    refunded: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },

    // Emergency statuses
    triggered: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    confirmed: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    active: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    contacting_services: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
    help_dispatched: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    resolving: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    resolved: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    false_alarm: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
} as const;

// Cancellation reasons
export const CANCELLATION_REASONS = {
    customer: [
        'Changed my plans',
        'Booked by mistake',
        'Driver taking too long',
        'Found alternate transport',
        'Price too high',
        'Other',
    ],
    driver: [
        'Customer not responding',
        'Wrong pickup location',
        'Vehicle breakdown',
        'Personal emergency',
        'Customer cancelled verbally',
        'Other',
    ],
} as const;

// Dispute categories
export const DISPUTE_CATEGORIES = [
    { value: 'fare_issue', label: 'Fare/Billing Issue' },
    { value: 'route_issue', label: 'Wrong Route' },
    { value: 'driver_behavior', label: 'Driver Behavior' },
    { value: 'vehicle_condition', label: 'Vehicle Condition' },
    { value: 'safety_concern', label: 'Safety Concern' },
    { value: 'payment_issue', label: 'Payment Issue' },
    { value: 'cancellation_issue', label: 'Cancellation Issue' },
    { value: 'rental_damage', label: 'Rental Damage' },
    { value: 'other', label: 'Other' },
] as const;

// Map configuration
export const MAP_CONFIG = {
    defaultCenter: { lat: 12.9716, lng: 77.5946 }, // Bangalore
    defaultZoom: 13,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
} as const;

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;
