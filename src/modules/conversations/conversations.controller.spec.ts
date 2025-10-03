import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { Conversation } from 'src/database/entities/conversation.entity';
import { OpenAiModels } from '../model-provider/enums/openai-models.enum';
import { ConversationsController } from './conversations.controller';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateConversationTitleDto } from './dto/update-conversation-title.dto';

describe('ConversationsController', () => {
  let conversationsController: ConversationsController;
  const conversationsServiceMock = {
    create: jest.fn(),
    findAllUserConversations: jest.fn(),
    updateConversationTitle: jest.fn(),
    remove: jest.fn(),
  };

  const mockTokenPayload = {
    sub: 'user-uuid',
  };

  const mockConversation: Partial<Conversation> = {
    id: 'conversation-uuid',
    model: OpenAiModels.GPT_5,
    title: 'Conversation title',
  };

  const mockConversationId = 'conversation-uuid';

  beforeEach(() => {
    conversationsController = new ConversationsController(
      conversationsServiceMock as any,
    );
  });

  it('Should create the conversation using the right arguments', async () => {
    const mockCreateConversationDto: CreateConversationDto = {
      model: OpenAiModels.GPT_5,
      title: 'Conversation Name',
    };

    jest
      .spyOn(conversationsServiceMock, 'create')
      .mockResolvedValue(mockConversation);

    const result = await conversationsController.create(
      mockCreateConversationDto,
      mockTokenPayload as TokenPayloadDto,
    );

    expect(conversationsServiceMock.create).toHaveBeenCalledWith(
      mockCreateConversationDto,
      mockTokenPayload,
    );
    expect(result).toEqual(mockConversation);
  });

  it('Should find the user conversations using the right arguments', async () => {
    const mockPaginationDto: PaginationDto = {
      limit: 10,
      offset: 0,
    };

    const mockConversations: Partial<Conversation>[] = [mockConversation];

    jest
      .spyOn(conversationsServiceMock, 'findAllUserConversations')
      .mockResolvedValue(mockConversations);

    const result = await conversationsController.findAllUserConversations(
      mockTokenPayload as TokenPayloadDto,
      mockPaginationDto,
    );

    expect(
      conversationsServiceMock.findAllUserConversations,
    ).toHaveBeenCalledWith(mockTokenPayload, mockPaginationDto);
    expect(result).toEqual(mockConversations);
  });

  it('Should update the user conversation using the right arguments', async () => {
    const mockUpdateConversationTitleDto: UpdateConversationTitleDto = {
      title: 'New title',
    };

    const mockUpdatedConversation: Partial<Conversation> = {
      id: 'conversation-uuid',
      title: mockUpdateConversationTitleDto.title,
    };

    jest
      .spyOn(conversationsServiceMock, 'updateConversationTitle')
      .mockResolvedValue(mockUpdatedConversation);

    const result = await conversationsController.updateConversationTitle(
      mockConversationId,
      mockUpdateConversationTitleDto,
      mockTokenPayload as TokenPayloadDto,
    );

    expect(
      conversationsServiceMock.updateConversationTitle,
    ).toHaveBeenCalledWith(
      mockTokenPayload as TokenPayloadDto,
      mockConversationId,
      mockUpdateConversationTitleDto,
    );
    expect(result).toEqual(mockUpdatedConversation);
  });

  it('Should remove the user conversation using the right arguments', async () => {
    jest
      .spyOn(conversationsServiceMock, 'remove')
      .mockResolvedValue(mockConversation);

    const result = await conversationsController.remove(
      mockConversationId,
      mockTokenPayload as TokenPayloadDto,
    );

    expect(conversationsServiceMock.remove).toHaveBeenCalledWith(
      mockConversationId,
      mockTokenPayload,
    );
    expect(result).toEqual(mockConversation);
  });
});
