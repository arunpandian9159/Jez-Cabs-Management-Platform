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

// Backend response types (snake_case) - matching document_verifications table
interface BackendUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
}

interface BackendVerification {
  id: string;
  user_id: string;
  user?: BackendUser;
  document_type: string;
  document_number?: string;
  document_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at?: string;
  verified_at?: string;
  verified_by?: string;
  verifiedBy?: BackendUser;
  rejection_reason?: string;
  created_at: string;
  type?: 'driver' | 'cab_owner'; // Virtual property from getter
}

// Derive type from document_type
function deriveType(documentType: string): 'driver' | 'cab_owner' {
  const driverDocs = ['license', 'aadhaar', 'pan'];
  return driverDocs.some((d) => documentType?.toLowerCase().includes(d))
    ? 'driver'
    : 'cab_owner';
}

// Transform backend response to frontend format
function transformVerification(backend: BackendVerification): Verification {
  const isApproved = backend.status === 'approved';
  const isRejected = backend.status === 'rejected';

  return {
    id: backend.id,
    applicant: {
      id: backend.user?.id || backend.user_id,
      name: backend.user
        ? `${backend.user.first_name} ${backend.user.last_name}`
        : 'Unknown',
      email: backend.user?.email || '',
      phone: backend.user?.phone || '',
      avatar: backend.user?.avatar_url,
    },
    type: backend.type || deriveType(backend.document_type),
    documentType: backend.document_type,
    documentNumber: backend.document_number || '',
    submittedAt: backend.submitted_at || backend.created_at,
    status: backend.status,
    documentUrl: backend.document_url || '',
    notes: backend.rejection_reason || '',
    approvedAt: isApproved ? backend.verified_at : undefined,
    approvedBy: isApproved ? backend.verified_by : undefined,
    rejectedAt: isRejected ? backend.verified_at : undefined,
    rejectedBy: isRejected ? backend.verified_by : undefined,
  };
}

export const adminService = {
  // Get all verification requests
  async getVerifications(
    filters?: VerificationFilters
  ): Promise<Verification[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    const backendData = await apiClient.get<BackendVerification[]>(
      `/admin/verifications${query ? `?${query}` : ''}`
    );
    return backendData.map(transformVerification);
  },

  // Get verification stats
  async getVerificationStats(): Promise<VerificationStats> {
    return apiClient.get<VerificationStats>('/admin/verifications/stats');
  },

  // Get a specific verification
  async getVerification(id: string): Promise<Verification> {
    const backendData = await apiClient.get<BackendVerification>(
      `/admin/verifications/${id}`
    );
    return transformVerification(backendData);
  },

  // Approve a verification
  async approveVerification(id: string, notes?: string): Promise<Verification> {
    const backendData = await apiClient.patch<BackendVerification>(
      `/admin/verifications/${id}/approve`,
      { notes }
    );
    return transformVerification(backendData);
  },

  // Reject a verification
  async rejectVerification(id: string, reason: string): Promise<Verification> {
    const backendData = await apiClient.patch<BackendVerification>(
      `/admin/verifications/${id}/reject`,
      { reason }
    );
    return transformVerification(backendData);
  },

  // Download verification document
  async downloadDocument(id: string): Promise<Blob> {
    return apiClient.get<Blob>(`/admin/verifications/${id}/document`, {
      responseType: 'blob',
    });
  },
};

export default adminService;
