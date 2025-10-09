import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChecklistDocument = Checklist & Document;

@Schema({ _id: false })
export class ChecklistItem {
  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true, enum: ['PASS', 'FAIL', 'NA'], default: 'NA' })
  status: string;

  @Prop()
  notes: string;

  @Prop({ type: [String], default: [] })
  images: string[];
}

const ChecklistItemSchema = SchemaFactory.createForClass(ChecklistItem);

@Schema({ timestamps: true, collection: 'checklists' })
export class Checklist {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  bookingId: string;

  @Prop({ required: true })
  cabId: string;

  @Prop({ required: true })
  templateName: string;

  @Prop({ type: [ChecklistItemSchema], default: [] })
  items: ChecklistItem[];

  @Prop()
  completedBy: string;

  @Prop()
  completedAt: Date;

  @Prop()
  approvedBy: string;

  @Prop()
  approvedAt: Date;

  @Prop({ default: false })
  isComplete: boolean;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop()
  notes: string;
}

export const ChecklistSchema = SchemaFactory.createForClass(Checklist);

// Indexes
ChecklistSchema.index({ companyId: 1, bookingId: 1 });
ChecklistSchema.index({ cabId: 1 });
ChecklistSchema.index({ isComplete: 1, isApproved: 1 });

