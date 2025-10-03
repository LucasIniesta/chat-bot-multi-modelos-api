import { validate } from 'class-validator';
import 'reflect-metadata';
import { OpenAiModels } from '../enums/openai-models.enum';
import { ProviderMessageDto, ProvidersChatDto } from './providers-chat.dto';

describe('ProvidersChatDto and ProviderMessageDto', () => {
  it('Should validate when DTO is valid', async () => {
    const dto = new ProvidersChatDto();
    const message = new ProviderMessageDto();
    message.content = 'hello';
    message.role = 'user';
    dto.messages = [message];
    dto.model = OpenAiModels.GPT_5;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should throw multiple erros when DTO has more than a invalid property', async () => {
    const dto = new ProvidersChatDto();
    const message = new ProviderMessageDto();
    message.content = '';
    message.role = '' as any;
    dto.messages = [message];
    dto.model = '' as any;

    const errors = await validate(dto);
    expect(errors.length).toBe(2);
  });

  describe('model', () => {
    it('Should fail when model is empty', async () => {
      const dto = new ProvidersChatDto();
      const message = new ProviderMessageDto();
      message.content = 'hello';
      message.role = 'user';
      dto.messages = [message];
      dto.model = '' as any;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('model');
      expect(errors[0].constraints).toStrictEqual({
        isNotEmpty: 'Model is required',
      });
    });

    it('Should fail when model is not a string', async () => {
      const dto = new ProvidersChatDto();
      const message = new ProviderMessageDto();
      message.content = 'hello';
      message.role = 'user';
      dto.messages = [message];
      dto.model = 123 as any;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('model');
    });
  });

  describe('messages', () => {
    it('Should fail when messages lenght is less than one message', async () => {
      const dto = new ProvidersChatDto();
      const message = new ProviderMessageDto();
      message.content = 'hello';
      message.role = 'user';
      dto.messages = [];
      dto.model = OpenAiModels.GPT_5;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('messages');
      expect(errors[0].constraints).toStrictEqual({
        arrayMinSize: 'At least one message is required',
      });
    });

    it('Should fail when messages lenght is greater than one hundred messages', async () => {
      const dto = new ProvidersChatDto();
      const message = new ProviderMessageDto();
      message.content = 'hello';
      message.role = 'user';
      dto.messages = [message];
      for (let i = 0; i < 100; i++) {
        dto.messages.push(message);
      }
      dto.model = OpenAiModels.GPT_5;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('messages');
      expect(errors[0].constraints).toStrictEqual({
        arrayMaxSize: 'Too many messages (max 100)',
      });
    });

    it('Should fail when messages is not an array', async () => {
      const dto = new ProvidersChatDto();
      const message = new ProviderMessageDto();
      message.content = 'hello';
      message.role = 'user';
      dto.messages = {} as any;
      dto.model = OpenAiModels.GPT_5;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('messages');
      expect(errors[0].constraints).toStrictEqual({
        isArray: 'Messages must be an array',
        arrayMinSize: 'At least one message is required',
        arrayMaxSize: 'Too many messages (max 100)',
      });
    });
  });

  describe('role', () => {
    it('Should fail when role is empty', async () => {
      const dto = new ProvidersChatDto();
      const message = new ProviderMessageDto();
      message.content = 'hello';
      message.role = '' as any;
      dto.messages = [message];
      dto.model = OpenAiModels.GPT_5;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('messages');
    });

    it('Should fail when role is not user or assitant', async () => {
      const dto = new ProvidersChatDto();
      const message = new ProviderMessageDto();
      message.content = 'hello';
      message.role = 'system' as any;
      dto.messages = [message];
      dto.model = OpenAiModels.GPT_5;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('messages');
    });
  });

  describe('content', () => {
    it('Should fail when content is empty', async () => {
      const dto = new ProvidersChatDto();
      const message = new ProviderMessageDto();
      message.content = '';
      message.role = 'user';
      dto.messages = [message];
      dto.model = OpenAiModels.GPT_5;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('messages');
    });

    it('Should fail when content is not a string', async () => {
      const dto = new ProvidersChatDto();
      const message = new ProviderMessageDto();
      message.content = 12 as any;
      message.role = 'user';
      dto.messages = [message];
      dto.model = OpenAiModels.GPT_5;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('messages');
    });
  });
});
