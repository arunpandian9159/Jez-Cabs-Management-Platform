import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ example: 'Pre-Rental Inspection', description: 'Template name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    type: [String],
    example: ['Tire Pressure', 'Brake Condition', 'Lights Working', 'Fuel Level'],
    description: 'List of checklist item names',
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  items: string[];

  @ApiPropertyOptional({ example: 'Standard pre-rental inspection checklist', description: 'Template description' })
  @IsOptional()
  @IsString()
  description?: string;
}

