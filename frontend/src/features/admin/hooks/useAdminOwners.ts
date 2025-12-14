import { useState, useMemo } from 'react';

export interface CabOwnerDisplay {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyName: string | null;
    status: 'active' | 'pending' | 'inactive' | 'suspended';
    totalCabs: number;
    totalDrivers: number;
    totalEarnings: number;
    joinedAt: string;
    gstNumber: string | null;
    panNumber: string;
    bankAccount: string;
}

// Mock data for cab owners
const mockOwners: CabOwnerDisplay[] = [
    {
        id: 'o1',
        name: 'Suresh Travels',
        email: 'suresh.travels@email.com',
        phone: '+91 98765 11111',
        companyName: 'Suresh Travels Pvt Ltd',
        status: 'active',
        totalCabs: 12,
        totalDrivers: 10,
        totalEarnings: 1250000,
        joinedAt: '2022-03-15',
        gstNumber: '33AABCS1234D1Z5',
        panNumber: 'AABCS1234D',
        bankAccount: 'HDFC ****4521',
    },
    {
        id: 'o2',
        name: 'Rajan Kumar',
        email: 'rajan.k@email.com',
        phone: '+91 87654 22222',
        companyName: null,
        status: 'active',
        totalCabs: 3,
        totalDrivers: 3,
        totalEarnings: 320000,
        joinedAt: '2023-06-20',
        gstNumber: null,
        panNumber: 'ABCPR1234K',
        bankAccount: 'ICICI ****7892',
    },
    {
        id: 'o3',
        name: 'City Cab Services',
        email: 'info@citycabs.com',
        phone: '+91 76543 33333',
        companyName: 'City Cab Services',
        status: 'pending',
        totalCabs: 8,
        totalDrivers: 0,
        totalEarnings: 0,
        joinedAt: '2024-01-05',
        gstNumber: '33AABCC5678E1Z8',
        panNumber: 'AABCC5678E',
        bankAccount: 'SBI ****3456',
    },
    {
        id: 'o4',
        name: 'Premium Rides',
        email: 'contact@premiumrides.in',
        phone: '+91 65432 44444',
        companyName: 'Premium Rides India Pvt Ltd',
        status: 'active',
        totalCabs: 25,
        totalDrivers: 22,
        totalEarnings: 3450000,
        joinedAt: '2021-11-10',
        gstNumber: '33AABCP9012F1Z2',
        panNumber: 'AABCP9012F',
        bankAccount: 'Axis ****8901',
    },
    {
        id: 'o5',
        name: 'Venkat Naidu',
        email: 'venkat.naidu@email.com',
        phone: '+91 54321 55555',
        companyName: null,
        status: 'inactive',
        totalCabs: 2,
        totalDrivers: 1,
        totalEarnings: 85000,
        joinedAt: '2023-08-15',
        gstNumber: null,
        panNumber: 'ABCPV5678L',
        bankAccount: 'Kotak ****2345',
    },
    {
        id: 'o6',
        name: 'Metro Fleet Services',
        email: 'admin@metrofleet.com',
        phone: '+91 43210 66666',
        companyName: 'Metro Fleet Services LLP',
        status: 'suspended',
        totalCabs: 15,
        totalDrivers: 12,
        totalEarnings: 890000,
        joinedAt: '2022-07-22',
        gstNumber: '33AABCM3456G1Z9',
        panNumber: 'AABCM3456G',
        bankAccount: 'HDFC ****6789',
    },
];

export function useAdminOwners() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOwner, setSelectedOwner] = useState<CabOwnerDisplay | null>(null);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

    const filteredOwners = useMemo(() => {
        return mockOwners.filter((owner) => {
            const matchesSearch =
                owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                owner.phone.includes(searchQuery) ||
                (owner.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            const matchesStatus =
                statusFilter === 'all' || owner.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    const toggleActionMenu = (ownerId: string) => {
        setShowActionMenu(showActionMenu === ownerId ? null : ownerId);
    };

    const closeModal = () => {
        setSelectedOwner(null);
    };

    // Computed stats
    const totalCount = mockOwners.length;
    const activeCount = mockOwners.filter((o) => o.status === 'active').length;
    const pendingCount = mockOwners.filter((o) => o.status === 'pending').length;
    const totalCabs = mockOwners.reduce((sum, o) => sum + o.totalCabs, 0);
    const totalRevenue = mockOwners.reduce((sum, o) => sum + o.totalEarnings, 0);

    return {
        // State
        searchQuery,
        statusFilter,
        selectedOwner,
        showActionMenu,
        filteredOwners,
        // Computed
        totalCount,
        activeCount,
        pendingCount,
        totalCabs,
        totalRevenue,
        // Actions
        setSearchQuery,
        setStatusFilter,
        setSelectedOwner,
        toggleActionMenu,
        closeModal,
    };
}
