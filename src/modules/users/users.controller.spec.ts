import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { User } from 'src/database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;
  const usersServiceMock = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockTokenPayload: Partial<TokenPayloadDto> = {
    sub: 'user-uuid',
  };

  const mockUser: Partial<User> = {
    id: 'user-uuid',
    name: 'John Doe',
    email: 'johnDoe@email.com',
    password: 'HASHEDPASSWORD',
  };

  beforeEach(() => {
    usersController = new UsersController(usersServiceMock as any);
  });

  it('Shoude create a new user using the right arguments', async () => {
    const mockCreateUserDto: CreateUserDto = {
      email: 'johnDoe@email.com',
      name: 'John Doe',
      password: '1234',
    };

    jest.spyOn(usersServiceMock, 'create').mockResolvedValue(mockUser);

    const result = await usersController.create(mockCreateUserDto);

    expect(usersServiceMock.create).toHaveBeenCalledWith(mockCreateUserDto);
    expect(result).toEqual(mockUser);
  });

  it('Should update the user using the right arguments', async () => {
    const mockUpdateUserDto: UpdateUserDto = {
      email: 'johnDoe1@email.com',
      name: 'John Doe Jr',
      password: 'newPassword',
    };

    const mockUser: Partial<User> = {
      id: 'user-uuid',
      email: 'johnDoe1@email.com',
      name: 'John Doe Jr',
      password: 'HASHEDPASSWORD',
    };

    jest.spyOn(usersServiceMock, 'update').mockResolvedValue(mockUser);

    const result = await usersController.update(
      mockTokenPayload as TokenPayloadDto,
      mockUpdateUserDto,
    );

    expect(usersServiceMock.update).toHaveBeenCalledWith(
      mockTokenPayload,
      mockUpdateUserDto,
    );
    expect(result).toEqual(mockUser);
  });

  it('Should remove the user using the right arguments', async () => {
    jest.spyOn(usersServiceMock, 'remove').mockResolvedValue(mockUser);

    const result = await usersController.remove(
      mockTokenPayload as TokenPayloadDto,
    );

    expect(usersServiceMock.remove).toHaveBeenCalledWith(mockTokenPayload);
    expect(result).toEqual(mockUser);
  });
});
