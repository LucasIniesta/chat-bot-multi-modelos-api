import { validate } from 'class-validator';
import 'reflect-metadata';
import { PaginationDto } from './pagination.dto';

describe('PaginationDto', () => {
  it('Should validate when DTO is valid', async () => {
    const dto = new PaginationDto();
    dto.limit = 10;
    dto.offset = 0;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should throw multiple erros when more than a property is invalid', async () => {
    const dto = new PaginationDto();
    dto.limit = 'a' as any;
    dto.offset = 'a' as any;

    const errors = await validate(dto);
    expect(errors.length).toBe(2);
  });

  describe('limit', () => {
    it('Should fail when limit is not an int', async () => {
      const dto = new PaginationDto();
      dto.limit = 'a' as any;
      dto.offset = 0;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('limit');
    });

    it('Should fail when limit is lesser than one', async () => {
      const dto = new PaginationDto();
      dto.limit = 0;
      dto.offset = 0;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('limit');
    });

    it('Should fail when limit is greater than fifty', async () => {
      const dto = new PaginationDto();
      dto.limit = 51;
      dto.offset = 0;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('limit');
    });
  });

  describe('offset', () => {
    it('Should fail when offset is not an int', async () => {
      const dto = new PaginationDto();
      dto.limit = 10;
      dto.offset = 'a' as any;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('offset');
    });

    it('Should fail when limit is lesser than zero', async () => {
      const dto = new PaginationDto();
      dto.limit = 10;
      dto.offset = -1;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('offset');
    });
  });
});
