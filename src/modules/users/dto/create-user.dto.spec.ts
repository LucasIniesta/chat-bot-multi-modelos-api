import { validate } from 'class-validator';
import 'reflect-metadata';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('Should validate a valid dto', async () => {
    const dto = new CreateUserDto();
    dto.email = 'johnDoe@email.com';
    dto.name = 'Joh Doe';
    dto.password = 'Validpassword1!';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should throw multiple errors when more than a property fails', async () => {
    const dto = new CreateUserDto();
    dto.email = 'johnDoe@';
    dto.name = '';
    dto.password = 'invalidpassword';

    const errors = await validate(dto);
    expect(errors.length).toBe(3);
  });

  describe('email', () => {
    it('Should fail when email is invalid', async () => {
      const dto = new CreateUserDto();
      dto.email = 'johnDoe@';
      dto.name = 'Joh Doe';
      dto.password = 'Validpassword1!';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('email');
    });

    it('Should fail when email is empty', async () => {
      const dto = new CreateUserDto();
      dto.email = '';
      dto.name = 'Joh Doe';
      dto.password = 'Validpassword1!';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('name', () => {
    it('Should fail when email is not a string', async () => {
      const dto = new CreateUserDto();
      dto.email = 'johnDoe@email.com';
      dto.name = 123 as any;
      dto.password = 'Validpassword1!';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('name');
    });

    it('Should fail when name is empty', async () => {
      const dto = new CreateUserDto();
      dto.email = 'johnDoe@email.com';
      dto.name = '';
      dto.password = 'Validpassword1!';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('name');
    });

    it('Should fail when name has less than 3 letters', async () => {
      const dto = new CreateUserDto();
      dto.email = 'johnDoe@email.com';
      dto.name = 'aa';
      dto.password = 'Validpassword1!';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('name');
    });

    it('Should fail when name has greater than 100 letters', async () => {
      const dto = new CreateUserDto();
      dto.email = 'johnDoe@email.com';
      dto.name = 'a'.repeat(101);
      dto.password = 'Validpassword1!';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('name');
    });
  });

  describe('password', () => {
    it('Should fail when password is not strong', async () => {
      const dto = new CreateUserDto();
      dto.email = 'johnDoe@email.com';
      dto.name = 'John Doe';
      dto.password = '1234';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toStrictEqual({
        isStrongPassword:
          'A password must have a minimum of 6 characters, including at least 1 capital letter, 1 special character, and 1 number.',
      });
    });

    it('Should fail when password is empty', async () => {
      const dto = new CreateUserDto();
      dto.email = 'johnDoe@email.com';
      dto.name = 'John Doe';
      dto.password = '';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
    });
  });
});
