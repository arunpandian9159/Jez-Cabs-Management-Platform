import { apiClient } from '@/shared/api';

export interface EmergencyContactApiResponse {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    relationship: string;
    is_primary: boolean;
    notify_on_sos: boolean;
    notify_on_trip_start: boolean;
    created_at: string;
    updated_at: string;
}

export interface SafetySettings {
    share_trip_enabled: boolean;
    auto_share_with_primary: boolean;
    sos_enabled: boolean;
    night_safety_enabled: boolean;
    trusted_contacts_only: boolean;
}

export interface CreateEmergencyContactDto {
    name: string;
    phone: string;
    relationship: string;
    is_primary?: boolean;
    notify_on_sos?: boolean;
    notify_on_trip_start?: boolean;
}

export interface UpdateEmergencyContactDto {
    name?: string;
    phone?: string;
    relationship?: string;
    is_primary?: boolean;
    notify_on_sos?: boolean;
    notify_on_trip_start?: boolean;
}

export interface SharedTrip {
    id: string;
    trip_id: string;
    shared_with_contact_id?: string;
    shared_via: 'sms' | 'whatsapp' | 'email' | 'link';
    share_link?: string;
    expires_at?: string;
    created_at: string;
}

export const safetyService = {
    // Get all emergency contacts
    async getEmergencyContacts(): Promise<EmergencyContactApiResponse[]> {
        return apiClient.get<EmergencyContactApiResponse[]>('/safety/contacts');
    },

    // Create a new emergency contact
    async createEmergencyContact(data: CreateEmergencyContactDto): Promise<EmergencyContactApiResponse> {
        return apiClient.post<EmergencyContactApiResponse>('/safety/contacts', data);
    },

    // Update an emergency contact
    async updateEmergencyContact(id: string, data: UpdateEmergencyContactDto): Promise<EmergencyContactApiResponse> {
        return apiClient.patch<EmergencyContactApiResponse>(`/safety/contacts/${id}`, data);
    },

    // Delete an emergency contact
    async deleteEmergencyContact(id: string): Promise<void> {
        return apiClient.delete(`/safety/contacts/${id}`);
    },

    // Set a contact as primary
    async setPrimaryContact(id: string): Promise<EmergencyContactApiResponse> {
        return apiClient.patch<EmergencyContactApiResponse>(`/safety/contacts/${id}/primary`, {});
    },

    // Trigger SOS alert
    async triggerSOS(location?: { lat: number; lng: number }): Promise<{ message: string; timestamp: string }> {
        return apiClient.post('/safety/sos', { location });
    },

    // Get safety settings
    async getSettings(): Promise<SafetySettings> {
        return apiClient.get<SafetySettings>('/safety/settings');
    },

    // Update safety settings
    async updateSettings(settings: Partial<SafetySettings>): Promise<SafetySettings> {
        return apiClient.patch<SafetySettings>('/safety/settings', settings);
    },

    // Share trip with contacts
    async shareTrip(tripId: string, method: 'sms' | 'whatsapp' | 'email' | 'link', contactIds?: string[]): Promise<SharedTrip> {
        return apiClient.post<SharedTrip>(`/trips/${tripId}/share`, {
            method,
            contact_ids: contactIds,
        });
    },

    // Get shared contacts for a trip
    async getTripSharedContacts(tripId: string): Promise<SharedTrip[]> {
        return apiClient.get<SharedTrip[]>(`/trips/${tripId}/shared`);
    },
};

export default safetyService;
