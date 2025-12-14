import { useState, useMemo } from 'react';

export interface VehicleDisplay {
    id: string;
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    type: 'sedan' | 'suv' | 'hatchback' | 'luxury';
    color: string;
    driverName: string | null;
    driverId: string | null;
    status: 'active' | 'maintenance' | 'inactive';
    totalTrips: number;
    lastService: string;
    insuranceExpiry: string;
    fuelType: string;
    seatingCapacity: number;
}

// Mock data for vehicles
const mockVehicles: VehicleDisplay[] = [
    {
        id: 'v1',
        make: 'Maruti Suzuki',
        model: 'Dzire',
        year: 2023,
        plateNumber: 'TN 01 AB 1234',
        type: 'sedan',
        color: 'White',
        driverName: 'Rajesh Kumar',
        driverId: 'd1',
        status: 'active',
        totalTrips: 1245,
        lastService: '2024-01-15',
        insuranceExpiry: '2025-06-30',
        fuelType: 'Petrol',
        seatingCapacity: 4,
    },
    {
        id: 'v2',
        make: 'Toyota',
        model: 'Innova Crysta',
        year: 2022,
        plateNumber: 'TN 02 CD 5678',
        type: 'suv',
        color: 'Silver',
        driverName: 'Mohammed Farhan',
        driverId: 'd2',
        status: 'active',
        totalTrips: 892,
        lastService: '2024-02-10',
        insuranceExpiry: '2025-03-15',
        fuelType: 'Diesel',
        seatingCapacity: 7,
    },
    {
        id: 'v3',
        make: 'Hyundai',
        model: 'i20',
        year: 2024,
        plateNumber: 'TN 03 EF 9012',
        type: 'hatchback',
        color: 'Red',
        driverName: null,
        driverId: null,
        status: 'inactive',
        totalTrips: 0,
        lastService: '2024-01-01',
        insuranceExpiry: '2025-12-31',
        fuelType: 'Petrol',
        seatingCapacity: 4,
    },
    {
        id: 'v4',
        make: 'Honda',
        model: 'City',
        year: 2023,
        plateNumber: 'TN 04 GH 3456',
        type: 'sedan',
        color: 'Black',
        driverName: 'Arun Prakash',
        driverId: 'd4',
        status: 'active',
        totalTrips: 2150,
        lastService: '2024-02-20',
        insuranceExpiry: '2025-05-10',
        fuelType: 'Petrol',
        seatingCapacity: 4,
    },
    {
        id: 'v5',
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2022,
        plateNumber: 'TN 05 IJ 7890',
        type: 'luxury',
        color: 'Blue',
        driverName: 'Venkat Raman',
        driverId: 'd5',
        status: 'maintenance',
        totalTrips: 456,
        lastService: '2024-03-01',
        insuranceExpiry: '2025-08-20',
        fuelType: 'Petrol',
        seatingCapacity: 4,
    },
    {
        id: 'v6',
        make: 'Mahindra',
        model: 'XUV700',
        year: 2023,
        plateNumber: 'TN 06 KL 1234',
        type: 'suv',
        color: 'Grey',
        driverName: 'Karthik Selvam',
        driverId: 'd6',
        status: 'active',
        totalTrips: 534,
        lastService: '2024-01-25',
        insuranceExpiry: '2025-04-15',
        fuelType: 'Diesel',
        seatingCapacity: 7,
    },
    {
        id: 'v7',
        make: 'Tata',
        model: 'Nexon',
        year: 2024,
        plateNumber: 'TN 07 MN 5678',
        type: 'hatchback',
        color: 'Green',
        driverName: null,
        driverId: null,
        status: 'inactive',
        totalTrips: 0,
        lastService: '2024-02-01',
        insuranceExpiry: '2026-01-31',
        fuelType: 'EV',
        seatingCapacity: 5,
    },
];

export function useAdminVehicles() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleDisplay | null>(null);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

    const filteredVehicles = useMemo(() => {
        return mockVehicles.filter((vehicle) => {
            const matchesSearch =
                vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (vehicle.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            const matchesType =
                typeFilter === 'all' || vehicle.type === typeFilter;
            const matchesStatus =
                statusFilter === 'all' || vehicle.status === statusFilter;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [searchQuery, typeFilter, statusFilter]);

    const toggleActionMenu = (vehicleId: string) => {
        setShowActionMenu(showActionMenu === vehicleId ? null : vehicleId);
    };

    const closeModal = () => {
        setSelectedVehicle(null);
    };

    // Computed stats by type
    const sedanCount = mockVehicles.filter((v) => v.type === 'sedan').length;
    const suvCount = mockVehicles.filter((v) => v.type === 'suv').length;
    const hatchbackCount = mockVehicles.filter((v) => v.type === 'hatchback').length;
    const luxuryCount = mockVehicles.filter((v) => v.type === 'luxury').length;

    // Computed stats by status
    const totalCount = mockVehicles.length;
    const activeCount = mockVehicles.filter((v) => v.status === 'active').length;
    const maintenanceCount = mockVehicles.filter((v) => v.status === 'maintenance').length;
    const inactiveCount = mockVehicles.filter((v) => v.status === 'inactive').length;

    return {
        // State
        searchQuery,
        typeFilter,
        statusFilter,
        selectedVehicle,
        showActionMenu,
        filteredVehicles,
        // Computed by type
        sedanCount,
        suvCount,
        hatchbackCount,
        luxuryCount,
        // Computed by status
        totalCount,
        activeCount,
        maintenanceCount,
        inactiveCount,
        // Actions
        setSearchQuery,
        setTypeFilter,
        setStatusFilter,
        setSelectedVehicle,
        toggleActionMenu,
        closeModal,
    };
}
