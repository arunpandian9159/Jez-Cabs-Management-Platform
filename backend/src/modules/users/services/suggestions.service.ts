import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { TripStatus } from '../../../common/enums';
import { SavedAddress, RecentDestination } from '../entities';

export interface LocationSuggestion {
  type: 'home' | 'work' | 'frequent' | 'recent' | 'predicted';
  label: string;
  address: string;
  lat: number;
  lng: number;
  confidence: number;
  reason: string;
}

export interface TimeSuggestion {
  type: 'optimal' | 'pattern' | 'reminder';
  message: string;
  data?: Record<string, unknown>;
}

export interface SmartSuggestions {
  locations: LocationSuggestion[];
  timings: TimeSuggestion[];
  fareInsight?: {
    type: 'lower' | 'higher' | 'normal';
    message: string;
    suggestedTime?: string;
  };
}

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(SavedAddress)
    private addressRepository: Repository<SavedAddress>,
    @InjectRepository(RecentDestination)
    private recentDestRepository: Repository<RecentDestination>,
  ) {}

  /**
   * Get personalized suggestions for a user
   */
  async getSuggestions(userId: string): Promise<SmartSuggestions> {
    const [savedAddresses, recentDestinations, tripHistory] = await Promise.all(
      [
        this.getSavedAddresses(userId),
        this.getRecentDestinations(userId),
        this.getTripPatterns(userId),
      ],
    );

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const locations = this.generateLocationSuggestions(
      savedAddresses,
      recentDestinations,
      tripHistory,
      currentHour,
      currentDay,
    );

    const timings = this.generateTimingSuggestions(
      tripHistory,
      currentHour,
      currentDay,
    );

    const fareInsight = this.generateFareInsight(currentHour);

    return { locations, timings, fareInsight };
  }

  private async getSavedAddresses(userId: string): Promise<SavedAddress[]> {
    return this.addressRepository.find({
      where: { user_id: userId },
      order: { is_default: 'DESC' },
    });
  }

  private async getRecentDestinations(
    userId: string,
  ): Promise<RecentDestination[]> {
    return this.recentDestRepository.find({
      where: { user_id: userId },
      order: { used_at: 'DESC' },
      take: 10,
    });
  }

  private async getTripPatterns(userId: string): Promise<{
    trips: Trip[];
    frequentDestinations: Map<string, number>;
    timePatterns: Map<number, string[]>;
    dayPatterns: Map<number, string[]>;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trips = await this.tripRepository.find({
      where: {
        customer_id: userId,
        status: TripStatus.COMPLETED,
        created_at: MoreThan(thirtyDaysAgo),
      },
      order: { created_at: 'DESC' },
      take: 100,
    });

    // Analyze frequent destinations
    const frequentDestinations = new Map<string, number>();
    const timePatterns = new Map<number, string[]>();
    const dayPatterns = new Map<number, string[]>();

    trips.forEach((trip) => {
      // Count destination frequency
      const dest = trip.dropoff_address;
      frequentDestinations.set(dest, (frequentDestinations.get(dest) || 0) + 1);

      // Track time patterns
      const hour = trip.created_at.getHours();
      const hourBucket = Math.floor(hour / 3) * 3; // 3-hour buckets
      if (!timePatterns.has(hourBucket)) {
        timePatterns.set(hourBucket, []);
      }
      timePatterns.get(hourBucket)!.push(dest);

      // Track day patterns
      const day = trip.created_at.getDay();
      if (!dayPatterns.has(day)) {
        dayPatterns.set(day, []);
      }
      dayPatterns.get(day)!.push(dest);
    });

    return { trips, frequentDestinations, timePatterns, dayPatterns };
  }

  private generateLocationSuggestions(
    savedAddresses: SavedAddress[],
    recentDestinations: RecentDestination[],
    tripPatterns: {
      frequentDestinations: Map<string, number>;
      timePatterns: Map<number, string[]>;
      dayPatterns: Map<number, string[]>;
    },
    currentHour: number,
    currentDay: number,
  ): LocationSuggestion[] {
    const suggestions: LocationSuggestion[] = [];

    // Add home/work from saved addresses (highest priority)
    savedAddresses.forEach((addr, index) => {
      const isHome = addr.label.toLowerCase().includes('home');
      const isWork =
        addr.label.toLowerCase().includes('work') ||
        addr.label.toLowerCase().includes('office');

      if (isHome || isWork) {
        suggestions.push({
          type: isHome ? 'home' : 'work',
          label: addr.label,
          address: addr.address,
          lat: addr.lat,
          lng: addr.lng,
          confidence: 0.95 - index * 0.05,
          reason: isHome ? 'Your home address' : 'Your work address',
        });
      }
    });

    // Time-based predictions (Morning = work, Evening = home)
    const hourBucket = Math.floor(currentHour / 3) * 3;
    const commonAtThisTime = tripPatterns.timePatterns.get(hourBucket) || [];

    if (commonAtThisTime.length > 0) {
      const destinationCounts = new Map<string, number>();
      commonAtThisTime.forEach((dest) => {
        destinationCounts.set(dest, (destinationCounts.get(dest) || 0) + 1);
      });

      const [topDest, count] = [...destinationCounts.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0] || [null, 0];

      if (topDest && count >= 3) {
        const matchingRecent = recentDestinations.find(
          (r) => r.address === topDest,
        );
        if (matchingRecent) {
          suggestions.push({
            type: 'predicted',
            label: 'Usual destination',
            address: matchingRecent.address,
            lat: matchingRecent.lat,
            lng: matchingRecent.lng,
            confidence: Math.min(count / 10, 0.9),
            reason: `You often go here around ${this.formatTimeRange(hourBucket)}`,
          });
        }
      }
    }

    // Day-based predictions
    const commonOnThisDay = tripPatterns.dayPatterns.get(currentDay) || [];
    if (commonOnThisDay.length > 0) {
      const dayName = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ][currentDay];

      const destinationCounts = new Map<string, number>();
      commonOnThisDay.forEach((dest) => {
        destinationCounts.set(dest, (destinationCounts.get(dest) || 0) + 1);
      });

      const [topDest, count] = [...destinationCounts.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0] || [null, 0];

      if (
        topDest &&
        count >= 2 &&
        !suggestions.find((s) => s.address === topDest)
      ) {
        const matchingRecent = recentDestinations.find(
          (r) => r.address === topDest,
        );
        if (matchingRecent) {
          suggestions.push({
            type: 'predicted',
            label: `${dayName} routine`,
            address: matchingRecent.address,
            lat: matchingRecent.lat,
            lng: matchingRecent.lng,
            confidence: Math.min(count / 8, 0.85),
            reason: `You often go here on ${dayName}s`,
          });
        }
      }
    }

    // Add recent destinations
    recentDestinations.slice(0, 3).forEach((dest, index) => {
      if (!suggestions.find((s) => s.address === dest.address)) {
        suggestions.push({
          type: 'recent',
          label: 'Recent',
          address: dest.address,
          lat: dest.lat,
          lng: dest.lng,
          confidence: 0.6 - index * 0.1,
          reason: 'Recently visited',
        });
      }
    });

    // Sort by confidence and limit
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  private generateTimingSuggestions(
    tripPatterns: { trips: Trip[] },
    currentHour: number,
    currentDay: number,
  ): TimeSuggestion[] {
    const suggestions: TimeSuggestion[] = [];

    // Rush hour warning
    if (
      (currentHour >= 8 && currentHour <= 10) ||
      (currentHour >= 17 && currentHour <= 19)
    ) {
      suggestions.push({
        type: 'reminder',
        message: 'Peak hours - fares may be higher than usual',
      });
    }

    // Pattern-based reminder
    if (tripPatterns.trips.length > 0) {
      const tripsAtThisTime = tripPatterns.trips.filter((t) => {
        const tripHour = t.created_at.getHours();
        return Math.abs(tripHour - currentHour) <= 1;
      });

      if (tripsAtThisTime.length >= 5) {
        suggestions.push({
          type: 'pattern',
          message: `You usually book rides around this time`,
        });
      }
    }

    return suggestions;
  }

  private generateFareInsight(
    currentHour: number,
  ): SmartSuggestions['fareInsight'] {
    // Peak hours have higher fares
    const isPeakHour =
      (currentHour >= 8 && currentHour <= 10) ||
      (currentHour >= 17 && currentHour <= 19);

    const isLowDemand = currentHour >= 11 && currentHour <= 15;

    if (isPeakHour) {
      return {
        type: 'higher',
        message: 'Prices are currently higher due to peak demand',
        suggestedTime: currentHour < 12 ? '11:00 AM' : '8:00 PM',
      };
    }

    if (isLowDemand) {
      return {
        type: 'lower',
        message: 'Great time to book! Prices are lower now',
      };
    }

    return {
      type: 'normal',
      message: 'Standard pricing in effect',
    };
  }

  private formatTimeRange(hourBucket: number): string {
    const startHour = hourBucket;
    const endHour = hourBucket + 3;
    const formatHour = (h: number) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${hour12} ${period}`;
    };
    return `${formatHour(startHour)} - ${formatHour(endHour)}`;
  }
}
