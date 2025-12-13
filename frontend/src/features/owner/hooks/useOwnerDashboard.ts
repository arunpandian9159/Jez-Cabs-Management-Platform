import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cabsService, type Cab } from '@/services';

// Types for owner dashboard display
export interface OwnerStatsDisplay {
    totalCabs: number;
    activeCabs: number;
    totalDrivers: number;
    activeDrivers: number;
    monthlyRevenue: number;
    pendingPayments: number;
    avgRating: number;
}

export interface CabDriverDisplay {
    name: string;
    rating: number;
    trips: number;
}

export interface CabDisplay {
    id: string;
    make: string;
    model: string;
    registrationNumber: string;
    status: string;
    driver: CabDriverDisplay | null;
    todayEarnings: number;
    rating: number;
}

export function useOwnerDashboard() {
    const [ownerStats, setOwnerStats] = useState<OwnerStatsDisplay>({
        totalCabs: 0,
        activeCabs: 0,
        totalDrivers: 0,
        activeDrivers: 0,
        monthlyRevenue: 0,
        pendingPayments: 0,
        avgRating: 0,
    });
    const [cabs, setCabs] = useState<CabDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch dashboard data on mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // Fetch cabs statistics
                const stats = await cabsService.getStatistics();
                setOwnerStats({
                    totalCabs: stats.total || 0,
                    activeCabs: (stats.available || 0) + (stats.onTrip || 0),
                    totalDrivers: 0,
                    activeDrivers: 0,
                    monthlyRevenue: 0,
                    pendingPayments: 0,
                    avgRating: 0,
                });

                // Fetch cabs list - backend returns { data: cabs[], meta: {...} }
                const cabsResponse = await cabsService.findAll();
                const cabsArray = Array.isArray(cabsResponse) ? cabsResponse : cabsResponse.data || [];
                const formattedCabs: CabDisplay[] = cabsArray.map((c: Cab) => ({
                    id: c.id,
                    make: c.make,
                    model: c.model,
                    registrationNumber: c.registration_number,
                    status: c.status,
                    driver: c.driver ? {
                        name: `${c.driver.first_name} ${c.driver.last_name}`,
                        rating: c.driver.rating || 4.5,
                        trips: 0,
                    } : null,
                    todayEarnings: 0,
                    rating: c.rating || 4.5,
                }));
                setCabs(formattedCabs);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleAddNewCab = () => {
        navigate('/owner/cabs');
    };

    const todaysEarnings = cabs.reduce((acc, c) => acc + c.todayEarnings, 0);
    const activeCabsCount = cabs.filter((c) => c.status === 'active').length;

    return {
        ownerStats,
        cabs,
        isLoading,
        todaysEarnings,
        activeCabsCount,
        handleAddNewCab,
    };
}
