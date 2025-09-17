import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/database/entities/conversation.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationTitleDto } from './dto/update-conversation-title.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject()
    private readonly userService: UsersService,
  ) {}

  //#TODO: Adicionar o modelo de IA usado na conversa
  //#TODO: Atualizar rota para usar o token do usuário ao invés do ID
  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const existingUser = await this.userService.findOne(
      createConversationDto.userId,
    );

    const newConversation = {
      ...createConversationDto,
      user: existingUser,
    };

    const conversation = this.conversationRepository.create(newConversation);
    return this.conversationRepository.save(conversation);
  }

  //#TODO: Atualizar rota para usar o token do usuário ao invés do ID
  async findAllUserConversations(id: string) {
    const userConversations = await this.conversationRepository.find({
      where: {
        user: { id: id },
      },
    });

    return userConversations;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  //#TODO: Atualizar rota para usar o token do usuário ao invés do ID
  async updateConversationTitle(
    userId: string,
    conversationId: string,
    updateConversationTitle: UpdateConversationTitleDto,
  ) {
    const isMyConversation = await this.conversationRepository.findOne({
      where: {
        user: { id: userId },
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

  //#TODO: Atualizar rota para usar o token do usuário ao invés do ID
  async remove(conversationId: string, userId: string) {
    const isMyConversation = await this.conversationRepository.findOne({
      where: {
        user: { id: userId },
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
