import { validate } from 'class-validator';
import { UpdateConversationTitleDto } from './update-conversation-title.dto';

describe('UpdateConversationTitleDto', () => {
  it('Should validate when DTO is valid', async () => {
    const dto = new UpdateConversationTitleDto();
    dto.title = 'title';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should fail when title is empty', async () => {
    const dto = new UpdateConversationTitleDto();
    dto.title = '';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });

  it('Should fail when title is not a string', async () => {
    const dto = new UpdateConversationTitleDto();
    dto.title = 12 as any;

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });

  it('Should fail when title is greater than fifty letters', async () => {
    const dto = new UpdateConversationTitleDto();
    dto.title = 'a'.repeat(51);

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });
});
