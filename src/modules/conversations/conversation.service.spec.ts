import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { Conversation } from 'src/database/entities/conversation.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { OpenAiModels } from '../model-provider/enums/openai-models.enum';
import { UsersService } from '../users/users.service';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateConversationTitleDto } from './dto/update-conversation-title.dto';

describe('ConversationService', () => {
  let conversationService: ConversationsService;
  let conversationRepository: Repository<Conversation>;
  let userService: UsersService;

  const mockCreateConvesationDto: CreateConversationDto = {
    model: OpenAiModels.GPT_5,
    title: 'Conversation Title',
  };

  const mockTokenPayload: Partial<TokenPayloadDto> = {
    sub: 'user-uuid',
  };

  const mockNewConversation: Partial<Conversation> = {
    id: 'conversation-uuid',
    title: 'Conversation Title',
    model: OpenAiModels.GPT_5,
  };

  const mockConversations: Partial<Conversation>[] = [mockNewConversation];

  const mockPaginationDto: PaginationDto = {
    limit: 10,
    offset: 0,
  };

  const mockConversationId = 'conversation-uuid';

  const mockUpdateConversationDto: UpdateConversationTitleDto = {
    title: 'New conversation title',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    conversationService =
      module.get<ConversationsService>(ConversationsService);
    conversationRepository = module.get<Repository<Conversation>>(
      getRepositoryToken(Conversation),
    );
    userService = module.get<UsersService>(UsersService);
  });

  it('Should dependencies be defined', () => {
    expect(conversationService).toBeDefined();
    expect(conversationRepository).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Create', () => {
    it('Should create a conversation', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue({} as User);
      jest
        .spyOn(conversationRepository, 'create')
        .mockReturnValue(mockNewConversation as Conversation);
      jest
        .spyOn(conversationRepository, 'save')
        .mockResolvedValue(mockNewConversation as Conversation);

      const result = await conversationService.create(
        mockCreateConvesationDto,
        mockTokenPayload as TokenPayloadDto,
      );

      expect(userService.findOne).toHaveBeenCalledWith(mockTokenPayload.sub);
      expect(conversationRepository.create).toHaveBeenCalledWith({
        ...mockCreateConvesationDto,
        user: {} as User,
      });
      expect(conversationRepository.save).toHaveBeenCalledWith(
        mockNewConversation as Conversation,
      );
      expect(result).toEqual(mockNewConversation);
    });

    it('Should throw NotFoundException when ID does not exists', async () => {
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValue(
          new NotFoundException(
            `User with ID ${mockTokenPayload.sub} not found`,
          ),
        );

      expect(
        conversationService.create(
          mockCreateConvesationDto,
          mockTokenPayload as TokenPayloadDto,
        ),
      ).rejects.toThrow(`User with ID ${mockTokenPayload.sub} not found`);
      expect(
        conversationService.create(
          mockCreateConvesationDto,
          mockTokenPayload as TokenPayloadDto,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('FindAllUserConversations', () => {
    it('Should return an array of conversations', async () => {
      jest
        .spyOn(conversationRepository, 'find')
        .mockResolvedValue(mockConversations as Conversation[]);

      const result = await conversationService.findAllUserConversations(
        mockTokenPayload as TokenPayloadDto,
        mockPaginationDto,
      );

      expect(conversationRepository.find).toHaveBeenCalledWith({
        where: {
          user: { id: mockTokenPayload.sub },
        },
        take: mockPaginationDto.limit,
        skip: mockPaginationDto.offset,
      });
      expect(result).toBe(mockConversations);
    });
  });

  describe('UpdateConversationTitle', () => {
    it('Should update the conversationTitle', async () => {
      jest
        .spyOn(conversationRepository, 'findOne')
        .mockResolvedValue(mockNewConversation as Conversation);

      jest.spyOn(conversationRepository, 'preload').mockResolvedValue({
        ...mockNewConversation,
        title: mockUpdateConversationDto.title,
      } as Conversation);

      jest.spyOn(conversationRepository, 'save').mockResolvedValue({
        ...mockNewConversation,
        title: mockUpdateConversationDto.title,
      } as Conversation);

      const result = await conversationService.updateConversationTitle(
        mockTokenPayload as TokenPayloadDto,
        mockConversationId,
        mockUpdateConversationDto,
      );

      expect(conversationRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: mockTokenPayload.sub },
          id: mockConversationId,
        },
      });
      expect(conversationRepository.save).toHaveBeenCalledWith({
        id: mockConversationId,
        ...mockNewConversation,
        ...mockUpdateConversationDto,
      });
      expect(conversationRepository.save).toHaveBeenCalledWith({
        ...mockNewConversation,
        title: mockUpdateConversationDto.title,
      });
      expect(result).toStrictEqual({
        id: mockConversationId,
        title: mockUpdateConversationDto.title,
      });
    });

    it('Should throw ForbiddenException if conversation is from another user', async () => {
      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue(null);

      expect(
        conversationService.updateConversationTitle(
          mockTokenPayload as TokenPayloadDto,
          mockConversationId,
          mockUpdateConversationDto,
        ),
      ).rejects.toThrow(
        new ForbiddenException(`This conversation isn't yours`),
      );
    });

    it('Should throw NotFoundException if conversation does not exists', async () => {
      jest
        .spyOn(conversationRepository, 'findOne')
        .mockResolvedValue(mockNewConversation as Conversation);

      jest
        .spyOn(conversationRepository, 'preload')
        .mockResolvedValue(undefined);

      expect(
        conversationService.updateConversationTitle(
          mockTokenPayload as TokenPayloadDto,
          mockConversationId,
          mockUpdateConversationDto,
        ),
      ).rejects.toThrow(
        new NotFoundException(
          `Conversation with ID ${mockConversationId} not found`,
        ),
      );
    });
  });

  describe('Remove', () => {
    it('Should remove a conversation', async () => {
      jest
        .spyOn(conversationRepository, 'findOne')
        .mockResolvedValue(mockNewConversation as Conversation);

      jest
        .spyOn(conversationRepository, 'remove')
        .mockResolvedValue(mockNewConversation as Conversation);

      const result = await conversationService.remove(
        mockConversationId,
        mockTokenPayload as TokenPayloadDto,
      );

      expect(conversationRepository.findOne).toHaveBeenLastCalledWith({
        where: {
          user: { id: mockTokenPayload.sub },
          id: mockConversationId,
        },
      });
      expect(conversationRepository.remove).toHaveBeenLastCalledWith(
        mockNewConversation as Conversation,
      );
      expect(result).toStrictEqual({
        id: mockConversationId,
        title: mockNewConversation.title,
      });
    });

    it('Should throw ForbiddenException if conversation is from another user', async () => {
      jest.spyOn(conversationRepository, 'findOne').mockResolvedValue(null);

      expect(
        conversationService.remove(
          mockConversationId,
          mockTokenPayload as TokenPayloadDto,
        ),
      ).rejects.toThrow(
        new ForbiddenException(`This conversation isn't yours`),
      );
    });
  });
});
