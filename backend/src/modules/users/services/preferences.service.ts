import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RidePreferences,
  RidePreferencesDocument,
  MusicPreference,
  TemperaturePreference,
  CommunicationStyle,
} from '../schemas/ride-preferences.schema';
import { UpdatePreferencesDto } from '../dto/preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectModel(RidePreferences.name)
    private preferencesModel: Model<RidePreferencesDocument>,
  ) {}

  /**
   * Get user preferences (create if not exists)
   */
  async getPreferences(userId: string): Promise<RidePreferencesDocument> {
    let preferences = await this.preferencesModel.findOne({ userId }).exec();

    if (!preferences) {
      preferences = await this.preferencesModel.create({
        userId,
        musicPreference: MusicPreference.DRIVERS_CHOICE,
        temperaturePreference: TemperaturePreference.MODERATE,
        communicationStyle: CommunicationStyle.PROFESSIONAL,
        accessibilityNeeds: {
          wheelchairAccessible: false,
          visualAssistance: false,
          hearingAssistance: false,
          mobilityAssistance: false,
        },
        petFriendly: false,
        childSeat: false,
        preferFemaleDriver: null,
        preferVerifiedDriver: false,
        minimumDriverRating: 0,
        favoriteDriverIds: [],
        blockedDriverIds: [],
      });
    }

    return preferences;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<RidePreferencesDocument> {
    const preferences = await this.preferencesModel
      .findOneAndUpdate({ userId }, { $set: dto }, { new: true, upsert: true })
      .exec();

    if (!preferences) {
      throw new NotFoundException('Preferences not found');
    }

    return preferences;
  }

  /**
   * Add a driver to favorites
   */
  async addFavoriteDriver(
    userId: string,
    driverId: string,
  ): Promise<RidePreferencesDocument> {
    const preferences = await this.getPreferences(userId);

    if (!preferences.favoriteDriverIds.includes(driverId)) {
      preferences.favoriteDriverIds.push(driverId);
      await preferences.save();
    }

    return preferences;
  }

  /**
   * Remove a driver from favorites
   */
  async removeFavoriteDriver(
    userId: string,
    driverId: string,
  ): Promise<RidePreferencesDocument> {
    const preferences = await this.getPreferences(userId);

    preferences.favoriteDriverIds = preferences.favoriteDriverIds.filter(
      (id) => id !== driverId,
    );
    await preferences.save();

    return preferences;
  }

  /**
   * Block a driver
   */
  async blockDriver(
    userId: string,
    driverId: string,
  ): Promise<RidePreferencesDocument> {
    const preferences = await this.getPreferences(userId);

    if (!preferences.blockedDriverIds.includes(driverId)) {
      preferences.blockedDriverIds.push(driverId);
      // Remove from favorites if present
      preferences.favoriteDriverIds = preferences.favoriteDriverIds.filter(
        (id) => id !== driverId,
      );
      await preferences.save();
    }

    return preferences;
  }

  /**
   * Unblock a driver
   */
  async unblockDriver(
    userId: string,
    driverId: string,
  ): Promise<RidePreferencesDocument> {
    const preferences = await this.getPreferences(userId);

    preferences.blockedDriverIds = preferences.blockedDriverIds.filter(
      (id) => id !== driverId,
    );
    await preferences.save();

    return preferences;
  }

  /**
   * Check if a driver is blocked
   */
  async isDriverBlocked(userId: string, driverId: string): Promise<boolean> {
    const preferences = await this.preferencesModel.findOne({ userId }).exec();
    return preferences?.blockedDriverIds?.includes(driverId) ?? false;
  }

  /**
   * Get preferences for driver matching
   */
  async getMatchingPreferences(userId: string): Promise<{
    preferFemaleDriver: boolean | null;
    preferVerifiedDriver: boolean;
    minimumDriverRating: number;
    favoriteDriverIds: string[];
    blockedDriverIds: string[];
  }> {
    const preferences = await this.getPreferences(userId);
    return {
      preferFemaleDriver: preferences.preferFemaleDriver,
      preferVerifiedDriver: preferences.preferVerifiedDriver,
      minimumDriverRating: preferences.minimumDriverRating,
      favoriteDriverIds: preferences.favoriteDriverIds,
      blockedDriverIds: preferences.blockedDriverIds,
    };
  }
}
