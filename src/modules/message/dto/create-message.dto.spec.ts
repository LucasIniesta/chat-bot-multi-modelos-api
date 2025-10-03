import { validate } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';

describe('CreateMessageDto', () => {
  it('Should validate when DTO is valid', async () => {
    const dto = new CreateMessageDto();
    dto.content = 'hello';
    dto.conversationId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should throw multiples erros when more than a property is invalida', async () => {
    const dto = new CreateMessageDto();
    dto.content = '';
    dto.conversationId = 'a0eebc-9c0b-4ef8-bb6d-6bb9bd380a11';

    const errors = await validate(dto);
    expect(errors.length).toBe(2);
  });

  describe('content', () => {
    it('Should fail when content is empty', async () => {
      const dto = new CreateMessageDto();
      dto.content = '';
      dto.conversationId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      const errors = await validate(dto);
      expect(errors[0].property).toBe('content');
      expect(errors.length).toBe(1);
    });

    it('Should fail when content is not a string ', async () => {
      const dto = new CreateMessageDto();
      dto.content = 12 as any;
      dto.conversationId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      const errors = await validate(dto);
      expect(errors[0].property).toBe('content');
      expect(errors.length).toBe(1);
    });
  });

  describe('conversationId', () => {
    it('Should fail when conversationId is not a UUID', async () => {
      const dto = new CreateMessageDto();
      dto.content = 'hello';
      dto.conversationId = 'a0eebc99-9c-4ef8-bb6d-6bb9bd380a11';

      const errors = await validate(dto);
      expect(errors[0].property).toBe('conversationId');
      expect(errors.length).toBe(1);
    });
  });
});
