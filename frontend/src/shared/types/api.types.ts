// User roles in the system
export type UserRole =
    | 'customer'
    | 'driver'
    | 'cab_owner'
    | 'trip_planner'
    | 'admin'
    | 'support';

// Authentication state
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role: UserRole;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Generic API response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}

// Common filter/pagination params
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
    search?: string;
}
