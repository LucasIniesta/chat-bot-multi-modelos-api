import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { Conversation } from 'src/database/entities/conversation.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateConversationTitleDto } from './dto/update-conversation-title.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject()
    private readonly userService: UsersService,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
    tokenPayload: TokenPayloadDto,
  ): Promise<Conversation> {
    const existingUser = await this.userService.findOne(tokenPayload.sub);

    const newConversation = {
      ...createConversationDto,
      user: existingUser,
    };

    const conversation = this.conversationRepository.create(newConversation);
    return this.conversationRepository.save(conversation);
  }

  async findAllUserConversations(
    tokenPayload: TokenPayloadDto,
    paginationDto: PaginationDto,
  ) {
    const { limit, offset } = paginationDto;
    const userConversations = await this.conversationRepository.find({
      where: {
        user: { id: tokenPayload.sub },
      },
      take: limit,
      skip: offset,
    });

    return userConversations;
  }

  async updateConversationTitle(
    tokenPayload: TokenPayloadDto,
    conversationId: string,
    updateConversationTitle: UpdateConversationTitleDto,
  ) {
    const isMyConversation = await this.conversationRepository.findOne({
      where: {
        user: { id: tokenPayload.sub },
        id: conversationId,
      },
    });

    if (!isMyConversation) {
      throw new ForbiddenException(`This conversation isn't yours`);
    }

    const existingConversation = await this.conversationRepository.preload({
      id: conversationId,
      ...updateConversationTitle,
    });

    if (!existingConversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found`,
      );
    }

    const { id, title } =
      await this.conversationRepository.save(existingConversation);

    return { id, title };
  }

  async remove(conversationId: string, tokenPayload: TokenPayloadDto) {
    const isMyConversation = await this.conversationRepository.findOne({
      where: {
        user: { id: tokenPayload.sub },
        id: conversationId,
      },
    });

    if (!isMyConversation) {
      throw new ForbiddenException(`This conversation isn't yours`);
    }

    const { id, title } =
      await this.conversationRepository.remove(isMyConversation);

    return { id, title };
  }
}
