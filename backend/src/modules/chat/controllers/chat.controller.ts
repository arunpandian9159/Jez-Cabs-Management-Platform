import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../iam/guards/jwt-auth.guard';
import { ChatService } from '../services';
import { SendMessageDto, MarkAsReadDto, GetMessagesDto } from '../dto';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for the current user' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  async getConversations(@Request() req: { user: { sub: string } }) {
    return this.chatService.getUserConversations(req.user.sub);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get a specific conversation' })
  @ApiResponse({ status: 200, description: 'Conversation details' })
  async getConversation(@Param('id') id: string) {
    return this.chatService.getConversation(id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  async getMessages(
    @Param('id') conversationId: string,
    @Query() query: GetMessagesDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.chatService.getMessages(conversationId, req.user.sub, query);
  }

  @Get('trips/:tripId/messages')
  @ApiOperation({ summary: 'Get messages for a trip' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  async getMessagesByTrip(
    @Param('tripId') tripId: string,
    @Query() query: GetMessagesDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.chatService.getMessagesByTrip(tripId, req.user.sub, query);
  }

  @Get('trips/:tripId/conversation')
  @ApiOperation({ summary: 'Get or create conversation for a trip' })
  @ApiResponse({ status: 200, description: 'Conversation details' })
  async getOrCreateConversation(
    @Param('tripId') tripId: string,
    @Query('participantId') participantId: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.chatService.getOrCreateConversation(tripId, [
      req.user.sub,
      participantId,
    ]);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async sendMessage(
    @Body() dto: SendMessageDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.chatService.sendMessage(req.user.sub, dto);
  }

  @Post('messages/read')
  @ApiOperation({ summary: 'Mark messages as read' })
  @ApiResponse({ status: 200, description: 'Messages marked as read' })
  async markAsRead(
    @Body() dto: MarkAsReadDto,
    @Request() req: { user: { sub: string } },
  ) {
    await this.chatService.markAsRead(dto.conversationId, req.user.sub);
    return { success: true };
  }

  @Get('quick-replies')
  @ApiOperation({ summary: 'Get list of quick replies' })
  @ApiResponse({ status: 200, description: 'List of quick replies' })
  getQuickReplies() {
    return this.chatService.getQuickReplies();
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get total unread message count' })
  @ApiResponse({ status: 200, description: 'Unread count' })
  async getUnreadCount(@Request() req: { user: { sub: string } }) {
    const count = await this.chatService.getUnreadCount(req.user.sub);
    return { unreadCount: count };
  }
}
