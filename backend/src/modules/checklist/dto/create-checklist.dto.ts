import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ChecklistItemStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  NA = 'NA',
}

export class ChecklistItemDto {
  @ApiProperty({ example: 'Tire Pressure', description: 'Checklist item name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  itemName: string;

  @ApiProperty({
    enum: ChecklistItemStatus,
    example: ChecklistItemStatus.PASS,
    description: 'Item status',
  })
  @IsNotEmpty()
  @IsEnum(ChecklistItemStatus)
  status: ChecklistItemStatus;

  @ApiPropertyOptional({ example: 'All tires at correct pressure', description: 'Item notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://example.com/image1.jpg'],
    description: 'Image URLs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class CreateChecklistDto {
  @ApiProperty({ example: 'uuid', description: 'Booking ID' })
  @IsNotEmpty()
  @IsUUID()
  bookingId: string;

  @ApiProperty({ example: 'uuid', description: 'Cab ID' })
  @IsNotEmpty()
  @IsUUID()
  cabId: string;

  @ApiProperty({ example: 'Pre-Rental Inspection', description: 'Template name or checklist type' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  templateName: string;

  @ApiProperty({
    type: [ChecklistItemDto],
    description: 'Checklist items',
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];

  @ApiPropertyOptional({ example: 'Vehicle in excellent condition', description: 'General notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

