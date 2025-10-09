import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TelematicsLogDocument = TelematicsLog & Document;

@Schema({ _id: false })
export class Location {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema({ timestamps: true, collection: 'telematics_logs' })
export class TelematicsLog {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  cabId: string;

  @Prop({ required: true })
  gpsDeviceId: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: LocationSchema, required: true })
  location: Location;

  @Prop({ default: 0 })
  speed: number;

  @Prop({ default: 0 })
  heading: number;

  @Prop({ default: 0 })
  altitude: number;

  @Prop({ 
    enum: ['NORMAL', 'SPEEDING', 'HARSH_BRAKE', 'HARSH_ACCELERATION', 'GEOFENCE_ENTRY', 'GEOFENCE_EXIT', 'IDLE'],
    default: 'NORMAL'
  })
  eventType: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  bookingId: string;
}

export const TelematicsLogSchema = SchemaFactory.createForClass(TelematicsLog);

// Indexes
TelematicsLogSchema.index({ companyId: 1, cabId: 1, timestamp: -1 });
TelematicsLogSchema.index({ gpsDeviceId: 1, timestamp: -1 });
TelematicsLogSchema.index({ eventType: 1, timestamp: -1 });
TelematicsLogSchema.index({ bookingId: 1 });

