import { apiClient } from '@/shared/api';

// Types for admin verification
export interface VerificationApplicant {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}

export interface Verification {
    id: string;
    applicant: VerificationApplicant;
    type: 'driver' | 'cab_owner';
    documentType: string;
    documentNumber: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    documentUrl: string;
    notes: string;
    approvedAt?: string;
    approvedBy?: string;
    rejectedAt?: string;
    rejectedBy?: string;
}

export interface VerificationFilters {
    status?: 'pending' | 'approved' | 'rejected';
    type?: 'driver' | 'cab_owner';
    search?: string;
    limit?: number;
    offset?: number;
}

export interface VerificationStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export const adminService = {
    // Get all verification requests
    async getVerifications(filters?: VerificationFilters): Promise<Verification[]> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.type) params.append('type', filters.type);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const query = params.toString();
        return apiClient.get<Verification[]>(`/admin/verifications${query ? `?${query}` : ''}`);
    },

    // Get verification stats
    async getVerificationStats(): Promise<VerificationStats> {
        return apiClient.get<VerificationStats>('/admin/verifications/stats');
    },

    // Get a specific verification
    async getVerification(id: string): Promise<Verification> {
        return apiClient.get<Verification>(`/admin/verifications/${id}`);
    },

    // Approve a verification
    async approveVerification(id: string, notes?: string): Promise<Verification> {
        return apiClient.patch<Verification>(`/admin/verifications/${id}/approve`, { notes });
    },

    // Reject a verification
    async rejectVerification(id: string, reason: string): Promise<Verification> {
        return apiClient.patch<Verification>(`/admin/verifications/${id}/reject`, { reason });
    },

    // Download verification document
    async downloadDocument(id: string): Promise<Blob> {
        return apiClient.get<Blob>(`/admin/verifications/${id}/document`, {
            responseType: 'blob',
        });
    },
};

export default adminService;
