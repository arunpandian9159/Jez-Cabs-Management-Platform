import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChecklistTemplateDocument = ChecklistTemplate & Document;

@Schema({ timestamps: true })
export class ChecklistTemplate {
  @Prop({ required: true, index: true })
  companyId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  items: string[];

  @Prop()
  description: string;
}

export const ChecklistTemplateSchema = SchemaFactory.createForClass(ChecklistTemplate);

// Create compound index
ChecklistTemplateSchema.index({ companyId: 1, name: 1 });

