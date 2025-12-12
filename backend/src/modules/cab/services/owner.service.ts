import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cab } from '../entities/cab.entity';
import { User } from '../../iam/entities/user.entity';
import { DriverProfile } from '../../driver/entities/driver-profile.entity';

@Injectable()
export class OwnerService {
    constructor(
        @InjectRepository(Cab)
        private readonly cabRepository: Repository<Cab>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(DriverProfile)
        private readonly driverProfileRepository: Repository<DriverProfile>,
    ) { }

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
}
