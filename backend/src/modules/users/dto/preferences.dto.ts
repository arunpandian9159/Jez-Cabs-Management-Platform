import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsObject,
  ValidateNested,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  MusicPreference,
  TemperaturePreference,
  CommunicationStyle,
} from '../schemas/ride-preferences.schema';

class AccessibilityNeedsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  wheelchairAccessible?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visualAssistance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hearingAssistance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  mobilityAssistance?: boolean;
}

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ enum: MusicPreference })
  @IsOptional()
  @IsEnum(MusicPreference)
  musicPreference?: MusicPreference;

  @ApiPropertyOptional({ enum: TemperaturePreference })
  @IsOptional()
  @IsEnum(TemperaturePreference)
  temperaturePreference?: TemperaturePreference;

  @ApiPropertyOptional({ enum: CommunicationStyle })
  @IsOptional()
  @IsEnum(CommunicationStyle)
  communicationStyle?: CommunicationStyle;

  @ApiPropertyOptional({ type: AccessibilityNeedsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AccessibilityNeedsDto)
  accessibilityNeeds?: AccessibilityNeedsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  petFriendly?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  childSeat?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  preferFemaleDriver?: boolean | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  preferVerifiedDriver?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  minimumDriverRating?: number;
}

export class DriverActionDto {
  @ApiPropertyOptional()
  @IsString()
  driverId: string;
}
