import type { LatLng } from './booking.types';

// Emergency status
export type EmergencyStatus =
    | 'triggered'
    | 'confirmed'
    | 'active'
    | 'contacting_services'
    | 'help_dispatched'
    | 'resolving'
    | 'resolved'
    | 'false_alarm'
    | 'cancelled';

// Emergency type
export type EmergencyType =
    | 'sos'
    | 'accident'
    | 'medical'
    | 'harassment'
    | 'theft'
    | 'vehicle_breakdown'
    | 'other';

// Emergency contact
export interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relationship: string;
    isPrimary: boolean;
}

// Emergency incident
export interface Emergency {
    id: string;
    tripId?: string;
    userId: string;
    userRole: 'customer' | 'driver';
    userName: string;
    userPhone: string;
    type: EmergencyType;
    status: EmergencyStatus;
    location: LatLng;
    address?: string;
    description?: string;

    // Related parties
    otherPartyId?: string;
    otherPartyName?: string;
    otherPartyPhone?: string;

    // Cab details if in trip
    cabRegistration?: string;
    cabMake?: string;
    cabModel?: string;
    cabColor?: string;

    // Response
    respondedAt?: string;
    respondedBy?: string;
    externalServicesContacted?: boolean;
    externalServiceDetails?: string;
    helpDispatchedAt?: string;
    helpArrivedAt?: string;

    // Resolution
    resolvedAt?: string;
    resolvedBy?: string;
    resolutionNotes?: string;
    incidentReport?: string;

    // Tracking
    locationHistory?: EmergencyLocationPoint[];

    createdAt: string;
    updatedAt: string;
}

export interface EmergencyLocationPoint {
    timestamp: string;
    location: LatLng;
    sharedBy: 'customer' | 'driver' | 'system';
}

// Emergency alert for admin/support
export interface EmergencyAlert {
    emergencyId: string;
    type: EmergencyType;
    status: EmergencyStatus;
    location: LatLng;
    address?: string;
    userName: string;
    userPhone: string;
    tripId?: string;
    createdAt: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
}
