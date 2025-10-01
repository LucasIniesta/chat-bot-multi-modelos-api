import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { Conversation } from 'src/database/entities/conversation.entity';
import { Message } from 'src/database/entities/message.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { ClaudeModels } from '../model-provider/enums/claude-models.enum';
import { ModelProviders } from '../model-provider/enums/model-providers.enum';
import { OpenAiModels } from '../model-provider/enums/openai-models.enum';
import { ModelProviderService } from '../model-provider/model-provider.service';
import { TProviderModels } from '../model-provider/types/provider-models.type';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let messageService: MessageService;
  let messageRepository: Repository<Message>;
  let conversationRepository: Repository<Conversation>;
  let modelProviderService: ModelProviderService;

  const mockCreateMessageDto: CreateMessageDto = {
    content: 'hello',
    conversationId: 'uuid-conversation',
  };

  const mockTokenPayload: Partial<TokenPayloadDto> = {
    sub: 'user-uuid',
  };

  const mockConversation: Partial<Conversation> = {
    id: mockCreateMessageDto.conversationId,
    model: OpenAiModels.GPT_5 as TProviderModels,
    user: {
      id: mockTokenPayload.sub as string,
    } as User,
  };

  const mockMessage = {
    content: mockCreateMessageDto.content,
    conversation: mockConversation as Conversation,
    role: 'user',
  };

  const mockMessages = [
    { role: 'user', content: mockCreateMessageDto.content },
  ];

  const mockResponse = {
    content: 'Hello',
    conversation: mockConversation as Conversation,
    role: 'assistant',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: ModelProviderService,
          useValue: {
            chat: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Message),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Conversation),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    messageService = module.get<MessageService>(MessageService);
    messageRepository = module.get<Repository<Message>>(
      getRepositoryToken(Message),
    );
    conversationRepository = module.get<Repository<Conversation>>(
      getRepositoryToken(Conversation),
    );
    modelProviderService =
      module.get<ModelProviderService>(ModelProviderService);
  });

  it('Should dependencies be defined', () => {
    expect(messageService).toBeDefined();
    expect(messageRepository).toBeDefined();
    expect(conversationRepository).toBeDefined();
    expect(modelProviderService).toBeDefined();
  });

  describe('Create', () => {
    it('Should create a message', async () => {
      jest
        .spyOn(conversationRepository, 'findOne')
        .mockResolvedValue(mockConversation as Conversation);

      jest
        .spyOn(messageRepository, 'create')
        .mockReturnValue(mockMessage as Message);

      jest
        .spyOn(messageRepository, 'find')
        .mockResolvedValue(mockMessages as Message[]);

      jest.spyOn(modelProviderService, 'chat').mockResolvedValue('Hello');

      jest
        .spyOn(messageRepository, 'create')
        .mockReturnValue(mockResponse as Message);

      jest
        .spyOn(messageRepository, 'save')
        .mockResolvedValue(mockResponse as Message);

      const result = await messageService.createMessage(
        mockCreateMessageDto,
        mockTokenPayload as TokenPayloadDto,
      );

      expect(conversationRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockCreateMessageDto.conversationId,
          user: { id: mockTokenPayload.sub },
        },
      });
      expect(messageRepository.find).toHaveBeenCalledWith({
        where: {
          conversation: { id: mockConversation.id },
        },
        select: ['role', 'content', 'createdAt'],
        order: { createdAt: 'ASC' },
      });
      expect(modelProviderService.chat).toHaveBeenCalledWith(
        ModelProviders.OPENAI,
        {
          model: mockConversation.model,
          messages: mockMessages,
        },
      );
      expect(result).toStrictEqual({
        message: mockResponse.content,
        statusCode: HttpStatus.OK,
      });
      expect(messageRepository.create).toHaveBeenCalledTimes(2);
      expect(messageRepository.save).toHaveBeenCalledTimes(2);
    });

    it('Should use Claude provider when claude model selected', async () => {
      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue({
        ...mockConversation,
        model: ClaudeModels.CLAUDE_SONNET_4,
      } as Conversation);

      jest
        .spyOn(messageRepository, 'create')
        .mockReturnValue(mockMessage as Message);

      jest
        .spyOn(messageRepository, 'find')
        .mockResolvedValue(mockMessages as Message[]);

      jest.spyOn(modelProviderService, 'chat').mockResolvedValue('Hello');

      jest
        .spyOn(messageRepository, 'create')
        .mockReturnValue(mockResponse as Message);

      jest
        .spyOn(messageRepository, 'save')
        .mockResolvedValue(mockResponse as Message);

      await messageService.createMessage(
        mockCreateMessageDto,
        mockTokenPayload as TokenPayloadDto,
      );

      expect(modelProviderService.chat).toHaveBeenCalledWith(
        ModelProviders.CLAUDE,
        {
          model: ClaudeModels.CLAUDE_SONNET_4,
          messages: mockMessages,
        },
      );
    });

    it('Should throw NotFoundExcetion if conversationId does not exists', async () => {
      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue(null);

      expect(
        messageService.createMessage(
          mockCreateMessageDto,
          mockTokenPayload as TokenPayloadDto,
        ),
      ).rejects.toThrow(
        `Conversation ${mockCreateMessageDto.conversationId} doesn't exists`,
      );
      expect(
        messageService.createMessage(
          mockCreateMessageDto,
          mockTokenPayload as TokenPayloadDto,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('Should thrown NotFoundException when model is incorrect', async () => {
      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue({
        ...mockConversation,
        model: 'incorrect-model' as TProviderModels,
      } as Conversation);

      jest
        .spyOn(messageRepository, 'create')
        .mockReturnValue(mockMessage as Message);

      jest
        .spyOn(messageRepository, 'find')
        .mockResolvedValue(mockMessages as Message[]);

      expect(
        messageService.createMessage(
          mockCreateMessageDto,
          mockTokenPayload as TokenPayloadDto,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(
        messageService.createMessage(
          mockCreateMessageDto,
          mockTokenPayload as TokenPayloadDto,
        ),
      ).rejects.toThrow('Model not found');
    });
  });

  describe('ListMessages', () => {
    it('Should list messages', async () => {
      jest
        .spyOn(conversationRepository, 'findOne')
        .mockResolvedValue(mockConversation as Conversation);

      jest
        .spyOn(messageRepository, 'find')
        .mockResolvedValue(mockMessages as Message[]);

      const result = await messageService.listMessages(
        mockCreateMessageDto.conversationId,
        mockTokenPayload as TokenPayloadDto,
      );

      expect(conversationRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockCreateMessageDto.conversationId,
          user: { id: mockTokenPayload.sub },
        },
      });
      expect(messageRepository.find).toHaveBeenCalledWith({
        where: {
          conversation: { id: mockCreateMessageDto.conversationId },
        },
        select: ['role', 'content', 'createdAt'],
        order: { createdAt: 'ASC' },
      });
      expect(result).toBe(mockMessages);
    });

    it('Should throw NotFoundExcetion if conversationId does not exists', async () => {
      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue(null);

      expect(
        messageService.listMessages(
          mockCreateMessageDto.conversationId,
          mockTokenPayload as TokenPayloadDto,
        ),
      ).rejects.toThrow(
        `Conversation ${mockCreateMessageDto.conversationId} doesn't exists`,
      );
      expect(
        messageService.listMessages(
          mockCreateMessageDto.conversationId,
          mockTokenPayload as TokenPayloadDto,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
