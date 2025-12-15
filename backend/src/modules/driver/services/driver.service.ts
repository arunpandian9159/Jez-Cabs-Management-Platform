import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverProfile } from '../entities/driver-profile.entity';
import { DriverStatus, VerificationStatus } from '../../../common/enums';
import { Verification } from '../../admin/entities/verification.entity';
import { User, UserStatus } from '../../iam/entities/user.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(DriverProfile)
    private readonly driverRepository: Repository<DriverProfile>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getProfile(userId: string): Promise<DriverProfile> {
    const profile = await this.driverRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    return profile;
  }

  async createProfile(
    userId: string,
    data: Partial<DriverProfile>,
  ): Promise<DriverProfile> {
    const profile = this.driverRepository.create({
      ...data,
      user_id: userId,
      status: DriverStatus.OFFLINE,
    });
    return this.driverRepository.save(profile);
  }

  async updateProfile(
    userId: string,
    data: Partial<DriverProfile>,
  ): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    Object.assign(profile, data);
    return this.driverRepository.save(profile);
  }

  async updateStatus(
    userId: string,
    status: DriverStatus,
  ): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    profile.status = status;
    profile.is_online = status === DriverStatus.AVAILABLE;
    return this.driverRepository.save(profile);
  }

  async updateLocation(
    userId: string,
    lat: number,
    lng: number,
  ): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    profile.current_location_lat = lat;
    profile.current_location_lng = lng;
    return this.driverRepository.save(profile);
  }

  async goOnline(userId: string): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    profile.is_online = true;
    profile.status = DriverStatus.AVAILABLE;
    return this.driverRepository.save(profile);
  }

  async goOffline(userId: string): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    profile.is_online = false;
    profile.status = DriverStatus.OFFLINE;
    return this.driverRepository.save(profile);
  }

  async getEarnings(userId: string) {
    try {
      const profile = await this.getProfile(userId);

      // Query actual trips from database
      // trips.driver_id stores the user's ID, not the driver_profile ID
      console.log('Fetching earnings for user_id:', userId);

      const completedTrips = await this.driverRepository.manager.query(
        `
        SELECT 
          actual_fare,
          estimated_fare,
          tip_amount,
          completed_at,
          EXTRACT(DOW FROM completed_at) as day_of_week
        FROM trips
        WHERE driver_id = $1
          AND status = 'completed'
          AND completed_at IS NOT NULL
        ORDER BY completed_at DESC
      `,
        [userId],
      );

      console.log('Found completed trips:', completedTrips.length);

      // Calculate date boundaries
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
      );
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      console.log('Date boundaries:', { todayStart, weekAgo, monthAgo });

      // Calculate earnings
      let todayEarnings = 0;
      let weekEarnings = 0;
      let monthEarnings = 0;
      let totalEarnings = 0;

      // Weekly breakdown: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
      const weeklyBreakdown = [
        { day: 'Sun', earnings: 0, trips: 0 },
        { day: 'Mon', earnings: 0, trips: 0 },
        { day: 'Tue', earnings: 0, trips: 0 },
        { day: 'Wed', earnings: 0, trips: 0 },
        { day: 'Thu', earnings: 0, trips: 0 },
        { day: 'Fri', earnings: 0, trips: 0 },
        { day: 'Sat', earnings: 0, trips: 0 },
      ];

      completedTrips.forEach((trip: any) => {
        const fare = parseFloat(trip.actual_fare || trip.estimated_fare || '0');
        const tip = parseFloat(trip.tip_amount || '0');
        const tripTotal = fare + tip;
        const completedAt = new Date(trip.completed_at);

        console.log('Processing trip:', { fare, tip, tripTotal, completedAt });

        totalEarnings += tripTotal;

        // Check if trip is from today
        if (completedAt >= todayStart) {
          todayEarnings += tripTotal;
        }

        // Check if trip is from last 7 days
        if (completedAt >= weekAgo) {
          weekEarnings += tripTotal;

          // Add to weekly breakdown
          const dayOfWeek = parseInt(trip.day_of_week);
          if (dayOfWeek >= 0 && dayOfWeek <= 6) {
            weeklyBreakdown[dayOfWeek].earnings += tripTotal;
            weeklyBreakdown[dayOfWeek].trips += 1;
          }
        }

        // Check if trip is from last 30 days
        if (completedAt >= monthAgo) {
          monthEarnings += tripTotal;
        }
      });

      console.log('Earnings calculated:', {
        todayEarnings,
        weekEarnings,
        monthEarnings,
        totalEarnings,
      });

      return {
        today: Math.round(todayEarnings),
        thisWeek: Math.round(weekEarnings),
        thisMonth: Math.round(monthEarnings),
        total: Math.round(totalEarnings),
        transactions: [],
        weeklyBreakdown: weeklyBreakdown,
      };
    } catch (error) {
      console.error('Error in getEarnings:', error);
      // Return default values on error
      return {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        total: 0,
        transactions: [],
        weeklyBreakdown: [
          { day: 'Sun', earnings: 0, trips: 0 },
          { day: 'Mon', earnings: 0, trips: 0 },
          { day: 'Tue', earnings: 0, trips: 0 },
          { day: 'Wed', earnings: 0, trips: 0 },
          { day: 'Thu', earnings: 0, trips: 0 },
          { day: 'Fri', earnings: 0, trips: 0 },
          { day: 'Sat', earnings: 0, trips: 0 },
        ],
      };
    }
  }

  async getDashboardStats(userId: string) {
    const profile = await this.getProfile(userId);

    // Calculate earnings from actual trip data
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Query trips for earnings calculation
    const trips = await this.driverRepository.manager.query(
      `
      SELECT 
        actual_fare,
        estimated_fare,
        tip_amount,
        completed_at
      FROM trips
      WHERE driver_id = $1
        AND status = 'completed'
        AND completed_at IS NOT NULL
    `,
      [userId],
    );

    let todayEarnings = 0;
    let weeklyEarnings = 0;
    let monthlyEarnings = 0;

    trips.forEach((trip: any) => {
      const fare = parseFloat(trip.actual_fare || trip.estimated_fare || '0');
      const tip = parseFloat(trip.tip_amount || '0');
      const tripTotal = fare + tip;
      const completedAt = new Date(trip.completed_at);

      if (completedAt >= todayStart) {
        todayEarnings += tripTotal;
      }
      if (completedAt >= weekAgo) {
        weeklyEarnings += tripTotal;
      }
      if (completedAt >= monthAgo) {
        monthlyEarnings += tripTotal;
      }
    });

    return {
      todayEarnings: Math.round(todayEarnings),
      weeklyEarnings: Math.round(weeklyEarnings),
      monthlyEarnings: Math.round(monthlyEarnings),
      totalTrips: profile.total_trips || 0,
      rating: profile.rating || 0,
      acceptanceRate: 95, // Would be calculated from trip acceptance data
      completionRate: 98, // Would be calculated from completed vs cancelled trips
      onlineHours: 0, // Would be calculated from online time logs
    };
  }

  async getTripRequests(userId: string) {
    // In production, this would query pending trip requests assigned to this driver
    // For now, return an empty array
    return [];
  }

  async getAvailableDrivers(
    lat?: number,
    lng?: number,
  ): Promise<DriverProfile[]> {
    const queryBuilder = this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.is_online = true')
      .andWhere('driver.status = :status', { status: DriverStatus.AVAILABLE });

    // In production, add distance-based filtering
    return queryBuilder.getMany();
  }

  /**
   * Complete driver onboarding process
   * Creates/updates driver profile and document verifications
   */
  async completeOnboarding(
    userId: string,
    data: {
      date_of_birth: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      emergency_contact: string;
      emergency_phone: string;
      license_number: string;
      license_type: string;
      license_expiry: string;
      years_of_experience: string;
      owns_cab: string;
      vehicle_make?: string;
      vehicle_model?: string;
      vehicle_year?: string;
      vehicle_color?: string;
      registration_number?: string;
      insurance_expiry?: string;
    },
    documentUrls: {
      license_front?: string;
      license_back?: string;
      aadhaar_front?: string;
      aadhaar_back?: string;
      police_clearance?: string;
      vehicle_rc?: string;
      vehicle_insurance?: string;
    },
  ): Promise<DriverProfile> {
    // Check if driver profile already exists
    let profile = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    const profileData = {
      user_id: userId,
      date_of_birth: new Date(data.date_of_birth),
      address: `${data.address}, ${data.city}, ${data.state} - ${data.pincode}`,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      emergency_contact_name: data.emergency_contact,
      emergency_contact_phone: data.emergency_phone,
      license_number: data.license_number,
      license_type: data.license_type,
      license_expiry: new Date(data.license_expiry),
      years_of_experience: parseInt(data.years_of_experience, 10) || 0,
      status: DriverStatus.OFFLINE,
    };

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      profile = await this.driverRepository.save(profile);
    } else {
      // Create new profile
      profile = this.driverRepository.create(profileData);
      profile = await this.driverRepository.save(profile);
    }

    // Create document verification entries
    // Always create required document entries, even if files weren't uploaded
    const documentTypes = [
      { type: 'license_front', url: documentUrls.license_front || 'pending_upload', number: data.license_number },
      { type: 'license_back', url: documentUrls.license_back || 'pending_upload', number: data.license_number },
      { type: 'aadhaar_front', url: documentUrls.aadhaar_front || 'pending_upload', number: null },
      { type: 'aadhaar_back', url: documentUrls.aadhaar_back || 'pending_upload', number: null },
      { type: 'police_clearance', url: documentUrls.police_clearance || 'pending_upload', number: null },
    ];

    // Add vehicle documents if driver owns a cab
    if (data.owns_cab === 'true') {
      documentTypes.push(
        { type: 'vehicle_rc', url: documentUrls.vehicle_rc || 'pending_upload', number: data.registration_number || null },
        { type: 'vehicle_insurance', url: documentUrls.vehicle_insurance || 'pending_upload', number: null },
      );
    }

    // Create verification entries for each document
    for (const doc of documentTypes) {
      // Check if verification already exists
      const existingVerification = await this.verificationRepository.findOne({
        where: {
          user_id: userId,
          document_type: doc.type,
        },
      });

      if (existingVerification) {
        // Update existing verification
        existingVerification.document_url = doc.url;
        existingVerification.document_number = doc.number;
        existingVerification.status = VerificationStatus.PENDING;
        existingVerification.submitted_at = new Date();
        await this.verificationRepository.save(existingVerification);
      } else {
        // Create new verification
        const verification = this.verificationRepository.create({
          user_id: userId,
          document_type: doc.type,
          document_url: doc.url,
          document_number: doc.number,
          status: VerificationStatus.PENDING,
          submitted_at: new Date(),
        });
        await this.verificationRepository.save(verification);
      }
    }

    // Update user status to pending_verification
    await this.userRepository.update(
      { id: userId },
      { status: UserStatus.PENDING_VERIFICATION },
    );

    return profile;
  }

  /**
   * Get driver verification status
   * Derives status from document_verifications table
   */
  async getVerificationStatus(userId: string): Promise<{
    verified: boolean;
    status: 'pending' | 'approved' | 'rejected';
    pendingDocuments: string[];
    rejectedDocuments: { type: string; reason: string }[];
  }> {
    // Get driver profile to check if onboarding is completed
    const profile = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      return {
        verified: false,
        status: 'pending',
        pendingDocuments: ['Profile not submitted'],
        rejectedDocuments: [],
      };
    }

    // Get all document verifications for this user
    const verifications = await this.verificationRepository.find({
      where: { user_id: userId },
    });

    // If no documents submitted yet, status is pending
    if (verifications.length === 0) {
      return {
        verified: false,
        status: 'pending',
        pendingDocuments: ['No documents submitted'],
        rejectedDocuments: [],
      };
    }

    const pendingDocuments = verifications
      .filter((v) => v.status === VerificationStatus.PENDING)
      .map((v) => v.document_type);

    const rejectedDocuments = verifications
      .filter((v) => v.status === VerificationStatus.REJECTED)
      .map((v) => ({
        type: v.document_type,
        reason: v.rejection_reason || 'No reason provided',
      }));

    const approvedDocuments = verifications
      .filter((v) => v.status === VerificationStatus.APPROVED);

    // Determine overall status:
    // - If any document is rejected, status is rejected
    // - If any document is pending, status is pending
    // - If all documents are approved, status is approved
    let status: 'pending' | 'approved' | 'rejected';

    if (rejectedDocuments.length > 0) {
      status = 'rejected';
    } else if (pendingDocuments.length > 0) {
      status = 'pending';
    } else if (approvedDocuments.length === verifications.length) {
      status = 'approved';
    } else {
      status = 'pending';
    }

    const isVerified = status === 'approved';

    return {
      verified: isVerified,
      status,
      pendingDocuments,
      rejectedDocuments,
    };
  }

  /**
   * Get profile or create an empty one if it doesn't exist
   * Used for checking onboarding status
   */
  async getProfileOrNull(userId: string): Promise<DriverProfile | null> {
    return this.driverRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });
  }
}
