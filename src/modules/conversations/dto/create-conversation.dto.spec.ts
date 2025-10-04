import { validate } from 'class-validator';
import 'reflect-metadata';
import { OpenAiModels } from 'src/modules/model-provider/enums/openai-models.enum';
import { CreateConversationDto } from './create-conversation.dto';

describe('CreateConversationDto', () => {
  it('Should validate when DTO is valid', async () => {
    const dto = new CreateConversationDto();
    dto.model = OpenAiModels.GPT_5;
    dto.title = 'title';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should throw multiple erros when more than a property is invalid', async () => {
    const dto = new CreateConversationDto();
    dto.model = 'iaia' as any;
    dto.title = 'a'.repeat(51);

    const errors = await validate(dto);
    expect(errors.length).toBe(2);
  });

  it('Should validate when DTO is valid and have no title', async () => {
    const dto = new CreateConversationDto();
    dto.model = OpenAiModels.GPT_5;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should validate when DTO is valid an have no model', async () => {
    const dto = new CreateConversationDto();
    dto.title = 'title';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('title', () => {
    it('Should fail when title is not a string', async () => {
      const dto = new CreateConversationDto();
      dto.model = OpenAiModels.GPT_5;
      dto.title = 12 as any;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('title');
    });

    it('Should fail when title is greater than fifty letters', async () => {
      const dto = new CreateConversationDto();
      dto.model = OpenAiModels.GPT_5;
      dto.title = 'a'.repeat(51);

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('title');
    });
  });

  describe('model', () => {
    it('Should fail when model is not part of OpenAiModels or ClaudeModels', async () => {
      const dto = new CreateConversationDto();
      dto.model = 'batata' as any;
      dto.title = 'title';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('model');
      expect(errors[0].constraints).toStrictEqual({
        isEnum: 'Invalid model. Must be a valid OpenAI or Claude model',
      });
    });
  });
});
