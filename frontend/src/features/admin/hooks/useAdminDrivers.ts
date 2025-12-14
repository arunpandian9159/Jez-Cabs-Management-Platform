import { useState, useMemo } from 'react';

export interface DriverDisplay {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    vehicleNumber: string;
    vehicleType: string;
    rating: number;
    status: 'active' | 'pending' | 'inactive' | 'suspended';
    totalTrips: number;
    totalEarnings: number;
    joinedAt: string;
    licenseNumber: string;
    licenseExpiry: string;
}

// Mock data for drivers
const mockDrivers: DriverDisplay[] = [
    {
        id: 'd1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        vehicleNumber: 'TN 01 AB 1234',
        vehicleType: 'Sedan',
        rating: 4.8,
        status: 'active',
        totalTrips: 1245,
        totalEarnings: 325000,
        joinedAt: '2023-06-15',
        licenseNumber: 'TN1234567890',
        licenseExpiry: '2025-12-31',
    },
    {
        id: 'd2',
        name: 'Mohammed Farhan',
        email: 'farhan.m@email.com',
        phone: '+91 87654 32109',
        vehicleNumber: 'TN 02 CD 5678',
        vehicleType: 'SUV',
        rating: 4.6,
        status: 'active',
        totalTrips: 892,
        totalEarnings: 245000,
        joinedAt: '2023-08-20',
        licenseNumber: 'TN0987654321',
        licenseExpiry: '2024-08-15',
    },
    {
        id: 'd3',
        name: 'Suresh Babu',
        email: 'suresh.b@email.com',
        phone: '+91 76543 21098',
        vehicleNumber: 'TN 03 EF 9012',
        vehicleType: 'Hatchback',
        rating: 4.2,
        status: 'pending',
        totalTrips: 0,
        totalEarnings: 0,
        joinedAt: '2024-01-10',
        licenseNumber: 'TN1122334455',
        licenseExpiry: '2026-03-20',
    },
    {
        id: 'd4',
        name: 'Arun Prakash',
        email: 'arun.p@email.com',
        phone: '+91 65432 10987',
        vehicleNumber: 'TN 04 GH 3456',
        vehicleType: 'Sedan',
        rating: 4.9,
        status: 'active',
        totalTrips: 2150,
        totalEarnings: 520000,
        joinedAt: '2022-11-05',
        licenseNumber: 'TN5566778899',
        licenseExpiry: '2025-06-30',
    },
    {
        id: 'd5',
        name: 'Venkat Raman',
        email: 'venkat.r@email.com',
        phone: '+91 54321 09876',
        vehicleNumber: 'TN 05 IJ 7890',
        vehicleType: 'Luxury',
        rating: 4.7,
        status: 'inactive',
        totalTrips: 456,
        totalEarnings: 180000,
        joinedAt: '2023-04-12',
        licenseNumber: 'TN6677889900',
        licenseExpiry: '2024-01-15',
    },
    {
        id: 'd6',
        name: 'Karthik Selvam',
        email: 'karthik.s@email.com',
        phone: '+91 43210 98765',
        vehicleNumber: 'TN 06 KL 1234',
        vehicleType: 'SUV',
        rating: 3.9,
        status: 'suspended',
        totalTrips: 234,
        totalEarnings: 78000,
        joinedAt: '2023-09-28',
        licenseNumber: 'TN7788990011',
        licenseExpiry: '2025-09-10',
    },
];

export function useAdminDrivers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDriver, setSelectedDriver] = useState<DriverDisplay | null>(null);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

    const filteredDrivers = useMemo(() => {
        return mockDrivers.filter((driver) => {
            const matchesSearch =
                driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                driver.phone.includes(searchQuery) ||
                driver.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === 'all' || driver.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    const toggleActionMenu = (driverId: string) => {
        setShowActionMenu(showActionMenu === driverId ? null : driverId);
    };

    const closeModal = () => {
        setSelectedDriver(null);
    };

    // Computed stats
    const totalCount = mockDrivers.length;
    const activeCount = mockDrivers.filter((d) => d.status === 'active').length;
    const pendingCount = mockDrivers.filter((d) => d.status === 'pending').length;
    const inactiveCount = mockDrivers.filter((d) => d.status === 'inactive').length;

    return {
        // State
        searchQuery,
        statusFilter,
        selectedDriver,
        showActionMenu,
        filteredDrivers,
        // Computed
        totalCount,
        activeCount,
        pendingCount,
        inactiveCount,
        // Actions
        setSearchQuery,
        setStatusFilter,
        setSelectedDriver,
        toggleActionMenu,
        closeModal,
    };
}
