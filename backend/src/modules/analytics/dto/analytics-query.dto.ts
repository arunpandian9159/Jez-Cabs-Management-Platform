import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum AnalyticsPeriod {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
  CUSTOM = 'CUSTOM',
}

export class AnalyticsQueryDto {
  @ApiPropertyOptional({ 
    enum: AnalyticsPeriod, 
    example: AnalyticsPeriod.MONTH, 
    description: 'Time period for analytics',
    default: AnalyticsPeriod.MONTH
  })
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period?: AnalyticsPeriod = AnalyticsPeriod.MONTH;

  @ApiPropertyOptional({ example: '2025-10-01T00:00:00Z', description: 'Custom start date (required if period is CUSTOM)' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ example: '2025-10-31T23:59:59Z', description: 'Custom end date (required if period is CUSTOM)' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}

