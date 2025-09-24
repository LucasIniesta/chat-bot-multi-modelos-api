import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { Conversation } from 'src/database/entities/conversation.entity';
import { Message } from 'src/database/entities/message.entity';
import { Repository } from 'typeorm';
import { ClaudeModels } from '../model-provider/enums/claude-models.enum';
import { ModelProviders } from '../model-provider/enums/model-providers.enum';
import { OpenAiModels } from '../model-provider/enums/openai-models.enum';
import { ModelProviderService } from '../model-provider/model-provider.service';
import { TProviderMessages } from '../model-provider/types/provider-messages.type';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject()
    private readonly modelProviderService: ModelProviderService,
  ) {}

  async createMessage(
    createMessageDto: CreateMessageDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: createMessageDto.conversationId,
        user: { id: tokenPayload.sub },
      },
    });

    if (!conversation) {
      throw new NotFoundException(
        `Conversation ${createMessageDto.conversationId} doesn't exists`,
      );
    }

    const newUserMessage = this.messageRepository.create({
      ...createMessageDto,
      role: 'user',
      conversation,
    });

    await this.messageRepository.save(newUserMessage);
    const messages = await this.constructMessages(conversation.id);

    const newProviderChatDto = {
      model: conversation.model,
      messages,
    };

    const responseContent = await this.modelProviderService.chat(
      this.getModel(conversation.model),
      newProviderChatDto,
    );

    const response = this.messageRepository.create({
      content: responseContent,
      conversation,
      role: 'assistant',
    });

    const { content } = await this.messageRepository.save(response);

    return {
      message: content,
      statusCode: HttpStatus.OK,
    };
  }

  async listMessages(conversationId: string, tokenPayload: TokenPayloadDto) {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: conversationId,
        user: { id: tokenPayload.sub },
      },
    });

    if (!conversation) {
      throw new NotFoundException(
        `Conversation ${conversationId} doesn't exists`,
      );
    }

    return this.messageRepository.find({
      where: {
        conversation: { id: conversationId },
      },
      select: ['role', 'content', 'createdAt'],
      order: { createdAt: 'ASC' },
    });
  }

  private getModel(modelProviderValue: string): ModelProviders {
    if (
      Object.values(ClaudeModels).includes(modelProviderValue as ClaudeModels)
    ) {
      return ModelProviders.CLAUDE;
    }

    if (
      Object.values(OpenAiModels).includes(modelProviderValue as OpenAiModels)
    ) {
      return ModelProviders.OPENAI;
    }

    throw new NotFoundException('Model not found');
  }

  private async constructMessages(
    conversationId: string,
  ): Promise<TProviderMessages[]> {
    const messages: TProviderMessages[] = [];

    const dbMessages = await this.messageRepository.find({
      where: {
        conversation: { id: conversationId },
      },
      select: ['role', 'content', 'createdAt'],
      order: { createdAt: 'ASC' },
    });

    if (dbMessages) {
      dbMessages.forEach((dbMessage) => {
        messages.push({ role: dbMessage.role, content: dbMessage.content });
      });
    }

    return messages;
  }
}
