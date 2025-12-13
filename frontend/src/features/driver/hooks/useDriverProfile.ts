import { useState, useEffect, useCallback } from 'react';
import { driverService } from '@/services';

export interface DocumentDisplay {
    type: string;
    status: string;
    expiry: string | null;
}

export interface VehicleDisplay {
    make: string;
    model: string;
    year: number;
    color: string;
    registrationNumber: string;
    fuelType: string;
}

export interface DriverProfileDisplay {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    dateOfBirth: string;
    licenseNumber: string;
    licenseExpiry: string;
    bankAccount: string;
    bankName: string;
    ifscCode: string;
    rating: number;
    totalTrips: number;
    joinedDate: string;
    verificationStatus: string;
    documents: DocumentDisplay[];
    vehicle: VehicleDisplay;
}

export interface EditFormData {
    name: string;
    phone: string;
    email: string;
    address: string;
}

const initialProfile: DriverProfileDisplay = {
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    licenseNumber: '',
    licenseExpiry: '',
    bankAccount: '',
    bankName: '',
    ifscCode: '',
    rating: 0,
    totalTrips: 0,
    joinedDate: '',
    verificationStatus: '',
    documents: [],
    vehicle: {
        make: '',
        model: '',
        year: 0,
        color: '',
        registrationNumber: '',
        fuelType: '',
    },
};

export function useDriverProfile() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [driverProfile, setDriverProfile] = useState<DriverProfileDisplay>(initialProfile);
    const [editForm, setEditForm] = useState<EditFormData>({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            const profile = await driverService.getProfile();

            const formatted: DriverProfileDisplay = {
                id: profile.id,
                name: profile.user ? `${profile.user.first_name} ${profile.user.last_name}` : '',
                phone: profile.user?.phone || '',
                email: profile.user?.email || '',
                address: profile.address || '',
                dateOfBirth: profile.date_of_birth || '',
                licenseNumber: profile.license_number || '',
                licenseExpiry: profile.license_expiry || '',
                bankAccount: '',
                bankName: '',
                ifscCode: '',
                rating: profile.rating || 0,
                totalTrips: profile.total_trips || 0,
                joinedDate: profile.created_at,
                verificationStatus: profile.status,
                documents: [],
                vehicle: {
                    make: '',
                    model: '',
                    year: 0,
                    color: '',
                    registrationNumber: '',
                    fuelType: '',
                },
            };

            setDriverProfile(formatted);
            setEditForm({
                name: formatted.name,
                phone: formatted.phone,
                email: formatted.email,
                address: formatted.address,
            });
        } catch (error) {
            console.error('Error fetching driver profile:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateEditForm = (field: keyof EditFormData, value: string) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        // In a real app, would call an API to save
        setShowEditModal(false);
    };

    return {
        // State
        activeTab,
        showEditModal,
        isLoading,
        driverProfile,
        editForm,
        // Actions
        setActiveTab,
        setShowEditModal,
        updateEditForm,
        handleSaveProfile,
    };
}
