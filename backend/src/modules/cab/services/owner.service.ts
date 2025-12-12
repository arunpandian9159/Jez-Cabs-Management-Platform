import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Cab } from '../entities/cab.entity';
import { User } from '../../iam/entities/user.entity';
import { DriverProfile } from '../../driver/entities/driver-profile.entity';
import { CabOwnerProfile } from '../../iam/entities/cab-owner-profile.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { TripStatus } from '../../../common/enums';

@Injectable()
export class OwnerService {
    constructor(
        @InjectRepository(Cab)
        private readonly cabRepository: Repository<Cab>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(DriverProfile)
        private readonly driverProfileRepository: Repository<DriverProfile>,
        @InjectRepository(CabOwnerProfile)
        private readonly cabOwnerProfileRepository: Repository<CabOwnerProfile>,
        @InjectRepository(Trip)
        private readonly tripRepository: Repository<Trip>,
    ) { }

    // ============= DRIVERS =============

    /**
     * Get all drivers assigned to the owner's cabs
     */
    async getDrivers(ownerId: string) {
        // Find all cabs owned by this owner that have assigned drivers
        const cabs = await this.cabRepository.find({
            where: { owner_id: ownerId },
            relations: ['assigned_driver'],
        });

        // Extract unique drivers from the cabs
        const driverMap = new Map();

        for (const cab of cabs) {
            if (cab.assigned_driver) {
                const driverId = cab.assigned_driver.id;

                if (!driverMap.has(driverId)) {
                    // Fetch driver profile
                    const driverProfile = await this.driverProfileRepository.findOne({
                        where: { user_id: driverId },
                    });

                    if (driverProfile) {
                        const driver = cab.assigned_driver;
                        driverMap.set(driverId, {
                            id: driver.id,
                            name: `${driver.first_name} ${driver.last_name}`,
                            phone: driver.phone,
                            email: driver.email,
                            avatar: driver.avatar_url,
                            status: driverProfile.is_online ? 'active' : 'inactive',
                            cab: {
                                make: cab.make,
                                model: cab.model,
                                registrationNumber: cab.registration_number,
                            },
                            metrics: {
                                totalTrips: driverProfile.total_trips || 0,
                                rating: Number(driverProfile.rating) || 0,
                                acceptanceRate: 0, // TODO: Calculate from trips
                                completionRate: 0, // TODO: Calculate from trips
                                thisMonthEarnings: 0, // TODO: Calculate from trips
                                totalEarnings: 0, // TODO: Calculate from trips
                            },
                            joinedDate: driver.created_at,
                            lastActive: driverProfile.updated_at,
                        });
                    }
                }
            }
        }

        return Array.from(driverMap.values());
    }

    /**
     * Get a specific driver by ID (must be assigned to owner's cab)
     */
    async getDriver(driverId: string, ownerId: string) {
        // Check if this driver is assigned to any of the owner's cabs
        const cab = await this.cabRepository.findOne({
            where: {
                owner_id: ownerId,
                assigned_driver_id: driverId,
            },
            relations: ['assigned_driver'],
        });

        if (!cab || !cab.assigned_driver) {
            throw new NotFoundException('Driver not found or not assigned to your cabs');
        }

        const driverProfile = await this.driverProfileRepository.findOne({
            where: { user_id: driverId },
        });

        if (!driverProfile) {
            throw new NotFoundException('Driver profile not found');
        }

        const driver = cab.assigned_driver;

        return {
            id: driver.id,
            name: `${driver.first_name} ${driver.last_name}`,
            phone: driver.phone,
            email: driver.email,
            avatar: driver.avatar_url,
            status: driverProfile.is_online ? 'active' : 'inactive',
            cab: {
                make: cab.make,
                model: cab.model,
                registrationNumber: cab.registration_number,
            },
            metrics: {
                totalTrips: driverProfile.total_trips || 0,
                rating: Number(driverProfile.rating) || 0,
                acceptanceRate: 0, // TODO: Calculate from trips
                completionRate: 0, // TODO: Calculate from trips
                thisMonthEarnings: 0, // TODO: Calculate from trips
                totalEarnings: 0, // TODO: Calculate from trips
            },
            joinedDate: driver.created_at,
            lastActive: driverProfile.updated_at,
        };
    }

    /**
     * Assign a vehicle to a driver
     */
    async assignVehicle(driverId: string, vehicleId: string, ownerId: string) {
        const cab = await this.cabRepository.findOne({
            where: { id: vehicleId, owner_id: ownerId },
        });

        if (!cab) {
            throw new NotFoundException('Vehicle not found or not owned by you');
        }

        const driver = await this.userRepository.findOne({
            where: { id: driverId },
        });

        if (!driver) {
            throw new NotFoundException('Driver not found');
        }

        cab.assigned_driver_id = driverId;
        await this.cabRepository.save(cab);

        return this.getDriver(driverId, ownerId);
    }

    /**
     * Remove a driver from owner's fleet (unassign from cab)
     */
    async removeDriver(driverId: string, ownerId: string) {
        const cab = await this.cabRepository.findOne({
            where: {
                owner_id: ownerId,
                assigned_driver_id: driverId,
            },
        });

        if (!cab) {
            throw new NotFoundException('Driver not found or not assigned to your cabs');
        }

        cab.assigned_driver_id = null;
        await this.cabRepository.save(cab);

        return { message: 'Driver removed successfully' };
    }

    // ============= EARNINGS =============

    /**
     * Get earnings summary for owner
     */
    async getEarningsSummary(ownerId: string, period?: 'week' | 'month' | 'quarter' | 'year') {
        const cabs = await this.cabRepository.find({
            where: { owner_id: ownerId },
        });

        const cabIds = cabs.map(cab => cab.id);

        if (cabIds.length === 0) {
            return {
                today: 0,
                week: 0,
                month: 0,
                totalRevenue: 0,
                pendingSettlements: 0,
                platformFee: 0,
                netEarnings: 0,
            };
        }

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get trips for today
        const todayTrips = await this.tripRepository.find({
            where: {
                cab_id: In(cabIds),
                status: TripStatus.COMPLETED,
                completed_at: Between(todayStart, now),
            },
        });

        // Get trips for week
        const weekTrips = await this.tripRepository.find({
            where: {
                cab_id: In(cabIds),
                status: TripStatus.COMPLETED,
                completed_at: Between(weekStart, now),
            },
        });

        // Get trips for month
        const monthTrips = await this.tripRepository.find({
            where: {
                cab_id: In(cabIds),
                status: TripStatus.COMPLETED,
                completed_at: Between(monthStart, now),
            },
        });

        // Get all completed trips
        const allTrips = await this.tripRepository.find({
            where: {
                cab_id: In(cabIds),
                status: TripStatus.COMPLETED,
            },
        });

        const calculateTotal = (trips: Trip[]) => {
            return trips.reduce((sum, trip) => {
                const fare = Number(trip.actual_fare) || 0;
                const tip = Number(trip.tip_amount) || 0;
                return sum + fare + tip;
            }, 0);
        };

        const todayEarnings = calculateTotal(todayTrips);
        const weekEarnings = calculateTotal(weekTrips);
        const monthEarnings = calculateTotal(monthTrips);
        const totalRevenue = calculateTotal(allTrips);

        // Platform fee is typically 20%
        const platformFeeRate = 0.20;
        const platformFee = totalRevenue * platformFeeRate;
        const netEarnings = totalRevenue - platformFee;

        return {
            today: parseFloat(todayEarnings.toFixed(2)),
            week: parseFloat(weekEarnings.toFixed(2)),
            month: parseFloat(monthEarnings.toFixed(2)),
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            pendingSettlements: 0, // TODO: Implement settlements
            platformFee: parseFloat(platformFee.toFixed(2)),
            netEarnings: parseFloat(netEarnings.toFixed(2)),
        };
    }

    /**
     * Get earnings breakdown by cab
     */
    async getEarningsByCab(ownerId: string) {
        const cabs = await this.cabRepository.find({
            where: { owner_id: ownerId },
            relations: ['assigned_driver'],
        });

        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const result: Array<{
            id: string;
            vehicle: string;
            registration: string;
            driver: string;
            thisMonth: number;
            lastMonth: number;
            trips: number;
            growth: number;
        }> = [];

        for (const cab of cabs) {
            // Get this month's trips
            const thisMonthTrips = await this.tripRepository.find({
                where: {
                    cab_id: cab.id,
                    status: TripStatus.COMPLETED,
                    completed_at: Between(thisMonthStart, now),
                },
            });

            // Get last month's trips
            const lastMonthTrips = await this.tripRepository.find({
                where: {
                    cab_id: cab.id,
                    status: TripStatus.COMPLETED,
                    completed_at: Between(lastMonthStart, lastMonthEnd),
                },
            });

            const calculateTotal = (trips: Trip[]) => {
                return trips.reduce((sum, trip) => {
                    const fare = Number(trip.actual_fare) || 0;
                    const tip = Number(trip.tip_amount) || 0;
                    return sum + fare + tip;
                }, 0);
            };

            const thisMonthEarnings = calculateTotal(thisMonthTrips);
            const lastMonthEarnings = calculateTotal(lastMonthTrips);
            const growth = lastMonthEarnings > 0
                ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
                : thisMonthEarnings > 0 ? 100 : 0;

            result.push({
                id: cab.id,
                vehicle: `${cab.make} ${cab.model}`,
                registration: cab.registration_number,
                driver: cab.assigned_driver
                    ? `${cab.assigned_driver.first_name} ${cab.assigned_driver.last_name}`
                    : 'Unassigned',
                thisMonth: parseFloat(thisMonthEarnings.toFixed(2)),
                lastMonth: parseFloat(lastMonthEarnings.toFixed(2)),
                trips: thisMonthTrips.length,
                growth: parseFloat(growth.toFixed(1)),
            });
        }

        return result;
    }

    /**
     * Get monthly earnings data
     */
    async getMonthlyEarnings(ownerId: string, months: number = 6) {
        const cabs = await this.cabRepository.find({
            where: { owner_id: ownerId },
        });

        const cabIds = cabs.map(cab => cab.id);
        const result: Array<{ month: string; earnings: number }> = [];
        const now = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

            let earnings = 0;

            if (cabIds.length > 0) {
                const trips = await this.tripRepository.find({
                    where: {
                        cab_id: In(cabIds),
                        status: TripStatus.COMPLETED,
                        completed_at: Between(monthStart, monthEnd),
                    },
                });

                earnings = trips.reduce((sum, trip) => {
                    const fare = Number(trip.actual_fare) || 0;
                    const tip = Number(trip.tip_amount) || 0;
                    return sum + fare + tip;
                }, 0);
            }

            const monthName = monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            result.push({
                month: monthName,
                earnings: parseFloat(earnings.toFixed(2)),
            });
        }

        return result;
    }

    /**
     * Get owner transactions
     */
    async getTransactions(ownerId: string, limit: number = 20) {
        const cabs = await this.cabRepository.find({
            where: { owner_id: ownerId },
        });

        const cabIds = cabs.map(cab => cab.id);

        if (cabIds.length === 0) {
            return [];
        }

        const trips = await this.tripRepository.find({
            where: {
                cab_id: In(cabIds),
                status: TripStatus.COMPLETED,
            },
            order: { completed_at: 'DESC' },
            take: limit,
        });

        return trips.map((trip, index) => {
            const fare = Number(trip.actual_fare) || 0;
            const tip = Number(trip.tip_amount) || 0;
            return {
                id: trip.id,
                type: 'earning' as const,
                description: `Trip from ${trip.pickup_address.substring(0, 30)}...`,
                amount: parseFloat((fare + tip).toFixed(2)),
                date: trip.completed_at?.toISOString() || trip.created_at.toISOString(),
                status: 'completed' as const,
            };
        });
    }

    // ============= CONTRACTS =============
    // Note: Contracts are simulated as we don't have a contracts table yet

    /**
     * Get all contracts (simulated with cab/driver assignments)
     */
    async getContracts(ownerId: string, filters: {
        type?: string;
        status?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }) {
        const cabs = await this.cabRepository.find({
            where: { owner_id: ownerId },
            relations: ['assigned_driver'],
        });

        const contracts: Array<{
            id: string;
            type: string;
            title: string;
            partyName: string;
            vehicleAssigned: string;
            startDate: string;
            endDate: string;
            status: string;
            commission?: number;
            premium?: number;
            documents: string[];
        }> = [];
        const now = new Date();

        for (const cab of cabs) {
            // Driver contract
            if (cab.assigned_driver) {
                contracts.push({
                    id: `driver-${cab.id}`,
                    type: 'driver',
                    title: 'Driver Assignment',
                    partyName: `${cab.assigned_driver.first_name} ${cab.assigned_driver.last_name}`,
                    vehicleAssigned: `${cab.make} ${cab.model} (${cab.registration_number})`,
                    startDate: cab.created_at.toISOString(),
                    endDate: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString(),
                    status: 'active',
                    commission: 15,
                    documents: [] as string[],
                });
            }

            // Insurance contract
            if (cab.insurance_expiry) {
                const daysToExpiry = Math.floor((new Date(cab.insurance_expiry).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                let status = 'active';
                if (daysToExpiry < 0) status = 'expired';
                else if (daysToExpiry < 30) status = 'expiring';

                contracts.push({
                    id: `insurance-${cab.id}`,
                    type: 'insurance',
                    title: 'Vehicle Insurance',
                    partyName: 'Insurance Provider',
                    vehicleAssigned: `${cab.make} ${cab.model} (${cab.registration_number})`,
                    startDate: cab.created_at.toISOString(),
                    endDate: cab.insurance_expiry.toISOString ? cab.insurance_expiry.toISOString() : new Date(cab.insurance_expiry).toISOString(),
                    status,
                    premium: 15000,
                    documents: [] as string[],
                });
            }
        }

        // Apply filters
        let filtered = contracts;
        if (filters.type) {
            filtered = filtered.filter(c => c.type === filters.type);
        }
        if (filters.status) {
            filtered = filtered.filter(c => c.status === filters.status);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(search) ||
                c.partyName.toLowerCase().includes(search) ||
                c.vehicleAssigned.toLowerCase().includes(search)
            );
        }

        const offset = filters.offset || 0;
        const limit = filters.limit || 20;
        return filtered.slice(offset, offset + limit);
    }

    /**
     * Get a specific contract
     */
    async getContract(contractId: string, ownerId: string) {
        const contracts = await this.getContracts(ownerId, {});
        const contract = contracts.find(c => c.id === contractId);
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }
        return contract;
    }

    /**
     * Create a new contract (stub - would need contracts table)
     */
    async createContract(ownerId: string, data: any) {
        // This would require a contracts table to properly implement
        return {
            id: `new-${Date.now()}`,
            ...data,
            status: 'pending',
            documents: [],
        };
    }

    /**
     * Update a contract (stub - would need contracts table)
     */
    async updateContract(contractId: string, ownerId: string, data: any) {
        const contract = await this.getContract(contractId, ownerId);
        return {
            ...contract,
            ...data,
        };
    }

    /**
     * Renew a contract
     */
    async renewContract(contractId: string, ownerId: string, newEndDate: string) {
        const contract = await this.getContract(contractId, ownerId);
        return {
            ...contract,
            endDate: newEndDate,
            status: 'active',
        };
    }

    /**
     * Terminate a contract
     */
    async terminateContract(contractId: string, ownerId: string, reason: string) {
        const contract = await this.getContract(contractId, ownerId);
        return {
            ...contract,
            status: 'expired',
            terminationReason: reason,
        };
    }

    // ============= SETTINGS =============

    /**
     * Get business info
     */
    async getBusinessInfo(ownerId: string) {
        const owner = await this.userRepository.findOne({
            where: { id: ownerId },
        });

        const profile = await this.cabOwnerProfileRepository.findOne({
            where: { user_id: ownerId },
        });

        if (!owner) {
            throw new NotFoundException('Owner not found');
        }

        return {
            name: profile?.business_name || `${owner.first_name} ${owner.last_name}`,
            registrationNumber: profile?.gst_number || '',
            address: '', // TODO: Add address field to profile
            phone: owner.phone || '',
            email: owner.email,
        };
    }

    /**
     * Update business info
     */
    async updateBusinessInfo(ownerId: string, data: any) {
        let profile = await this.cabOwnerProfileRepository.findOne({
            where: { user_id: ownerId },
        });

        if (!profile) {
            profile = this.cabOwnerProfileRepository.create({
                user_id: ownerId,
            });
        }

        if (data.name) profile.business_name = data.name;
        if (data.registrationNumber) profile.gst_number = data.registrationNumber;

        await this.cabOwnerProfileRepository.save(profile);

        return this.getBusinessInfo(ownerId);
    }

    /**
     * Get owner settings
     */
    async getSettings(ownerId: string) {
        // Settings would typically be stored in a settings table
        // For now, return default settings
        return {
            emailNotifications: true,
            smsNotifications: true,
            driverAlerts: true,
            maintenanceReminders: true,
            paymentAlerts: true,
            autoSettlement: false,
            language: 'en',
        };
    }

    /**
     * Update owner settings
     */
    async updateSettings(ownerId: string, data: any) {
        // Would save to a settings table
        return {
            emailNotifications: data.emailNotifications ?? true,
            smsNotifications: data.smsNotifications ?? true,
            driverAlerts: data.driverAlerts ?? true,
            maintenanceReminders: data.maintenanceReminders ?? true,
            paymentAlerts: data.paymentAlerts ?? true,
            autoSettlement: data.autoSettlement ?? false,
            language: data.language ?? 'en',
        };
    }
}
