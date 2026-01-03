import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ChatMessage,
  ChatMessageDocument,
  MessageType,
  MessageStatus,
  QUICK_REPLIES,
} from '../schemas/chat-message.schema';
import {
  Conversation,
  ConversationDocument,
  ConversationType,
  ConversationStatus,
} from '../schemas/conversation.schema';
import { SendMessageDto, GetMessagesDto } from '../dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  /**
   * Get or create a conversation for a trip
   */
  async getOrCreateConversation(
    tripId: string,
    participants: string[],
  ): Promise<ConversationDocument> {
    let conversation = await this.conversationModel.findOne({ tripId }).exec();

    if (!conversation) {
      conversation = await this.conversationModel.create({
        tripId,
        participants,
        type: ConversationType.TRIP,
        status: ConversationStatus.ACTIVE,
        unreadCount: participants.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}),
      });
    }

    return conversation;
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string): Promise<ConversationDocument> {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .exec();
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  /**
   * Get conversation by trip ID
   */
  async getConversationByTrip(
    tripId: string,
  ): Promise<ConversationDocument | null> {
    return this.conversationModel.findOne({ tripId }).exec();
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.conversationModel
      .find({
        participants: userId,
        status: { $ne: ConversationStatus.ARCHIVED },
      })
      .sort({ updated_at: -1 })
      .limit(50)
      .exec();
  }

  /**
   * Send a message
   */
  async sendMessage(
    senderId: string,
    dto: SendMessageDto,
  ): Promise<ChatMessage> {
    // Get or create conversation
    const conversation = await this.getOrCreateConversation(dto.tripId, [
      senderId,
      dto.receiverId,
    ]);

    // Verify sender is a participant
    if (!conversation.participants.includes(senderId)) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Handle quick reply
    let messageContent = dto.message;
    if (dto.messageType === MessageType.QUICK_REPLY && dto.quickReplyId) {
      const quickReply = QUICK_REPLIES.find((qr) => qr.id === dto.quickReplyId);
      if (quickReply) {
        messageContent = quickReply.text;
      }
    }

    // Create message
    const message = await this.chatMessageModel.create({
      conversationId: String(conversation._id),
      tripId: dto.tripId,
      senderId,
      receiverId: dto.receiverId,
      message: messageContent,
      messageType: dto.messageType || MessageType.TEXT,
      status: MessageStatus.SENT,
      metadata:
        dto.messageType === MessageType.LOCATION && dto.location
          ? { location: dto.location }
          : dto.quickReplyId
            ? { quickReplyId: dto.quickReplyId }
            : null,
    });

    // Update conversation
    await this.conversationModel.findByIdAndUpdate(conversation._id, {
      lastMessage: {
        content: messageContent,
        senderId,
        timestamp: new Date(),
      },
      $inc: {
        messageCount: 1,
        [`unreadCount.${dto.receiverId}`]: 1,
      },
    });

    return message;
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(
    conversationId: string,
    userId: string,
    options: GetMessagesDto,
  ): Promise<ChatMessage[]> {
    const conversation = await this.getConversation(conversationId);

    // Verify user is a participant
    if (!conversation.participants.includes(userId)) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    const query: Record<string, unknown> = { conversationId };

    if (options.before) {
      query._id = { $lt: new Types.ObjectId(options.before) };
    }

    return this.chatMessageModel
      .find(query)
      .sort({ created_at: -1 })
      .limit(options.limit || 50)
      .exec();
  }

  /**
   * Get messages by trip ID
   */
  async getMessagesByTrip(
    tripId: string,
    userId: string,
    options: GetMessagesDto,
  ): Promise<ChatMessage[]> {
    const conversation = await this.getConversationByTrip(tripId);
    if (!conversation) {
      return [];
    }
    return this.getMessages(String(conversation._id), userId, options);
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.getConversation(conversationId);

    if (!conversation.participants.includes(userId)) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Update all unread messages from the other participant
    await this.chatMessageModel.updateMany(
      {
        conversationId,
        receiverId: userId,
        status: { $ne: MessageStatus.READ },
      },
      {
        status: MessageStatus.READ,
        readAt: new Date(),
      },
    );

    // Reset unread count for this user
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      [`unreadCount.${userId}`]: 0,
    });
  }

  /**
   * Mark message as delivered
   */
  async markAsDelivered(messageId: string): Promise<void> {
    await this.chatMessageModel.findByIdAndUpdate(messageId, {
      status: MessageStatus.DELIVERED,
      deliveredAt: new Date(),
    });
  }

  /**
   * Close a conversation
   */
  async closeConversation(
    conversationId: string,
    reason?: string,
  ): Promise<ConversationDocument> {
    const conversation = await this.conversationModel
      .findByIdAndUpdate(
        conversationId,
        {
          status: ConversationStatus.CLOSED,
          closedAt: new Date(),
          closedReason: reason || 'Trip completed',
        },
        { new: true },
      )
      .exec();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  /**
   * Get quick replies
   */
  getQuickReplies() {
    return QUICK_REPLIES;
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const conversations = await this.conversationModel
      .find({
        participants: userId,
        status: ConversationStatus.ACTIVE,
      })
      .exec();

    return conversations.reduce(
      (total, conv) => total + (conv.unreadCount[userId] || 0),
      0,
    );
  }
}
