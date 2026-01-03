import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '../schemas';

class LocationDto {
  @ApiProperty()
  @IsNotEmpty()
  lat: number;

  @ApiProperty()
  @IsNotEmpty()
  lng: number;
}

export class SendMessageDto {
  @ApiProperty({ description: 'Trip ID for the conversation' })
  @IsString()
  @IsNotEmpty()
  tripId: string;

  @ApiProperty({ description: 'Receiver user ID' })
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ enum: MessageType, description: 'Type of message' })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;

  @ApiPropertyOptional({ description: 'Location data for location messages' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiPropertyOptional({ description: 'Quick reply ID' })
  @IsOptional()
  @IsString()
  quickReplyId?: string;
}

export class MarkAsReadDto {
  @ApiProperty({ description: 'Conversation ID' })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiPropertyOptional({ description: 'Last read message ID' })
  @IsOptional()
  @IsString()
  lastReadMessageId?: string;
}

export class GetMessagesDto {
  @ApiPropertyOptional({ description: 'Number of messages to fetch' })
  @IsOptional()
  limit?: number = 50;

  @ApiPropertyOptional({ description: 'Cursor for pagination (message ID)' })
  @IsOptional()
  @IsString()
  before?: string;
}
