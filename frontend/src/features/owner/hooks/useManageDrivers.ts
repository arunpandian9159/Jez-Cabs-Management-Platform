import { useState, useEffect, useCallback } from 'react';
import { ownerService, type OwnerDriver } from '@/services/owner.service';

export interface NewDriverForm {
    name: string;
    phone: string;
    email: string;
}

export const initialNewDriver: NewDriverForm = {
    name: '',
    phone: '',
    email: '',
};

export function useManageDrivers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDriver, setSelectedDriver] = useState<OwnerDriver | null>(null);
    const [drivers, setDrivers] = useState<OwnerDriver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add driver modal state
    const [showAddDriverModal, setShowAddDriverModal] = useState(false);
    const [newDriver, setNewDriver] = useState<NewDriverForm>(initialNewDriver);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [inviteSuccess, setInviteSuccess] = useState(false);

    const fetchDrivers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const driversData = await ownerService.getDrivers();
            setDrivers(driversData);
        } catch (err) {
            console.error('Error fetching drivers:', err);
            setError('Failed to load drivers. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const filteredDrivers = drivers.filter((driver) => {
        const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.phone.includes(searchQuery);
        const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: drivers.length,
        active: drivers.filter((d) => d.status === 'active').length,
        inactive: drivers.filter((d) => d.status === 'inactive').length,
        pending: drivers.filter((d) => d.status === 'pending').length,
    };

    const handleInviteDriver = async () => {
        if (!newDriver.name || !newDriver.phone || !newDriver.email) {
            setInviteError('Please fill in all required fields');
            return;
        }
        if (!newDriver.email.includes('@')) {
            setInviteError('Please enter a valid email address');
            return;
        }
        if (newDriver.phone.length < 10) {
            setInviteError('Please enter a valid phone number');
            return;
        }
        try {
            setIsInviting(true);
            setInviteError(null);
            await ownerService.inviteDriver(newDriver);
            setInviteSuccess(true);
            setNewDriver(initialNewDriver);
        } catch (err) {
            console.error('Error inviting driver:', err);
            setInviteError('Failed to send invitation. Please try again.');
        } finally {
            setIsInviting(false);
        }
    };

    const handleCloseAddDriverModal = (open: boolean) => {
        setShowAddDriverModal(open);
        if (!open) {
            setNewDriver(initialNewDriver);
            setInviteError(null);
            setInviteSuccess(false);
        }
    };

    const updateNewDriver = (field: keyof NewDriverForm, value: string) => {
        setNewDriver(prev => ({ ...prev, [field]: value }));
    };

    return {
        // State
        searchQuery,
        statusFilter,
        selectedDriver,
        drivers: filteredDrivers,
        isLoading,
        error,
        showAddDriverModal,
        newDriver,
        isInviting,
        inviteError,
        inviteSuccess,
        stats,
        // Actions
        setSearchQuery,
        setStatusFilter,
        setSelectedDriver,
        setShowAddDriverModal,
        handleInviteDriver,
        handleCloseAddDriverModal,
        updateNewDriver,
    };
}
