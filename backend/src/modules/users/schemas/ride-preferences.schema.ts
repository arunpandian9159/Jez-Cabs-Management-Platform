import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RidePreferencesDocument = RidePreferences & Document;

export enum MusicPreference {
  CLASSICAL = 'classical',
  POP = 'pop',
  ROCK = 'rock',
  JAZZ = 'jazz',
  NO_MUSIC = 'no_music',
  DRIVERS_CHOICE = 'drivers_choice',
}

export enum TemperaturePreference {
  COLD = 'cold',
  MODERATE = 'moderate',
  WARM = 'warm',
}

export enum CommunicationStyle {
  CHATTY = 'chatty',
  QUIET = 'quiet',
  PROFESSIONAL = 'professional',
}

export interface AccessibilityNeeds {
  wheelchairAccessible: boolean;
  visualAssistance: boolean;
  hearingAssistance: boolean;
  mobilityAssistance: boolean;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class RidePreferences {
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({
    type: String,
    enum: Object.values(MusicPreference),
    default: MusicPreference.DRIVERS_CHOICE,
  })
  musicPreference: MusicPreference;

  @Prop({
    type: String,
    enum: Object.values(TemperaturePreference),
    default: TemperaturePreference.MODERATE,
  })
  temperaturePreference: TemperaturePreference;

  @Prop({
    type: String,
    enum: Object.values(CommunicationStyle),
    default: CommunicationStyle.PROFESSIONAL,
  })
  communicationStyle: CommunicationStyle;

  @Prop({
    type: Object,
    default: {
      wheelchairAccessible: false,
      visualAssistance: false,
      hearingAssistance: false,
      mobilityAssistance: false,
    },
  })
  accessibilityNeeds: AccessibilityNeeds;

  @Prop({ default: false })
  petFriendly: boolean;

  @Prop({ default: false })
  childSeat: boolean;

  @Prop({ default: true })
  preferFemaleDriver: boolean | null; // null = no preference

  @Prop({ default: false })
  preferVerifiedDriver: boolean;

  @Prop({ default: 0 })
  minimumDriverRating: number; // 0 = no minimum

  @Prop({ type: [String], default: [] })
  favoriteDriverIds: string[];

  @Prop({ type: [String], default: [] })
  blockedDriverIds: string[];

  @Prop({ type: Object, default: {} })
  customPreferences: Record<string, unknown>; // For future extensibility
}

export const RidePreferencesSchema =
  SchemaFactory.createForClass(RidePreferences);

// Create index for faster lookups
RidePreferencesSchema.index({ userId: 1 });
