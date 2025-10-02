import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { Message } from 'src/database/entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageController } from './message.controller';

describe('MessageController', () => {
  let messageController: MessageController;
  const messageServiceMock = {
    createMessage: jest.fn(),
    listMessages: jest.fn(),
  };

  const mockTokenPayload = {
    sub: 'user-uuid',
  };

  const mockMessage: Partial<Message> = {
    content: 'hello',
    id: 'message-uuid',
    role: 'user',
  };

  beforeEach(() => {
    messageController = new MessageController(messageServiceMock as any);
  });

  it('Should create the message using the right arguments', async () => {
    const mockCreateMessageDto: CreateMessageDto = {
      content: 'hello',
      conversationId: 'conversation-uuid',
    };

    jest
      .spyOn(messageServiceMock, 'createMessage')
      .mockResolvedValue(mockMessage);

    const result = await messageController.createMessage(
      mockCreateMessageDto,
      mockTokenPayload as TokenPayloadDto,
    );

    expect(messageServiceMock.createMessage).toHaveBeenLastCalledWith(
      mockCreateMessageDto,
      mockTokenPayload,
    );
    expect(result).toEqual(mockMessage);
  });

  it('Should list the messages using the right arguments', async () => {
    const mockConversationId = 'conversation-uuid';

    const mockMessages: Partial<Message>[] = [mockMessage];

    jest
      .spyOn(messageServiceMock, 'listMessages')
      .mockResolvedValue(mockMessages);

    const result = await messageController.listMessages(
      mockConversationId,
      mockTokenPayload as TokenPayloadDto,
    );

    expect(messageServiceMock.listMessages).toHaveBeenLastCalledWith(
      mockConversationId,
      mockTokenPayload,
    );
    expect(result).toEqual(mockMessages);
  });
});
