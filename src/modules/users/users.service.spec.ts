import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

describe('UserService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let hashingService: HashingService;

  const createUserDto: CreateUserDto = {
    email: 'johnDoe@email.com',
    name: 'John Doe',
    password: 'password',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    email: 'johnDoe1@email.com',
    name: 'John Doe Att',
    password: 'newPassword',
  };

  const mockTokenPayload: Partial<TokenPayloadDto> = { sub: 'right-uuid' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    hashingService = module.get<HashingService>(HashingService);
  });

  it('should userService, userRepository and hashingService being definded', () => {
    expect(usersService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(hashingService).toBeDefined();
  });

  describe('Create', () => {
    it('should create an user', async () => {
      const mockHashedPassword = 'HASHEDPASSWORD';
      const mockNewUser = {
        id: 'uuid-id',
        name: createUserDto.name,
        password: mockHashedPassword,
        email: createUserDto.email,
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(hashingService, 'hash').mockResolvedValue(mockHashedPassword);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockNewUser as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockNewUser as User);

      const result = await usersService.create(createUserDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: mockHashedPassword,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockNewUser);
      expect(result).toStrictEqual({
        email: mockNewUser.email,
        name: mockNewUser.name,
      });
    });

    it('Should throw a ConflictException when email already exists', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({} as User);

      expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('FindOne', () => {
    it('Should find an user when ID exists', async () => {
      const mockUser = {
        id: 'user--uuid-id',
        name: createUserDto.name,
        email: createUserDto.email,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await usersService.findOne(mockUser.id);

      expect(result).toStrictEqual(mockUser);
    });

    it('Should throw NotFoundException when ID do not exists', async () => {
      await expect(usersService.findOne('not-existing-id')).rejects.toThrow(
        new NotFoundException('User with ID not-existing-id not found'),
      );
    });
  });

  describe('Update', () => {
    it('Should update user if authorized', async () => {
      const mockNewPasswordHashed = 'NEWPASSWORDHASHED';
      const mockUpdatedUser = {
        ...mockUpdateUserDto,
        id: mockTokenPayload.sub,
        password: mockNewPasswordHashed,
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({ id: mockTokenPayload.sub } as User);
      jest
        .spyOn(hashingService, 'hash')
        .mockResolvedValue(mockNewPasswordHashed);
      jest
        .spyOn(userRepository, 'preload')
        .mockResolvedValue(mockUpdatedUser as User);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(mockUpdatedUser as User);

      const result = await usersService.update(
        mockTokenPayload as TokenPayloadDto,
        mockUpdateUserDto,
      );

      expect(result).toStrictEqual(mockUpdatedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUpdateUserDto.email },
        select: ['id'],
      });
      expect(hashingService.hash).toHaveBeenCalledWith(
        mockUpdateUserDto.password,
      );
      expect(userRepository.preload).toHaveBeenCalledWith(mockUpdatedUser);
      expect(userRepository.save).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('Should throw ConflictException when the new email already registered', async () => {
      const mockOtherId = { id: 'other-uuid' };
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(mockOtherId as User);

      await expect(
        usersService.update(
          mockTokenPayload as TokenPayloadDto,
          mockUpdateUserDto,
        ),
      ).rejects.toThrow(
        new ConflictException(
          `Email ${mockUpdateUserDto.email} already in use`,
        ),
      );
    });

    it('Should throw a NotFoundException if ID not exists', async () => {
      jest.spyOn(userRepository, 'preload').mockResolvedValue(undefined);

      await expect(
        usersService.update(
          mockTokenPayload as TokenPayloadDto,
          mockUpdateUserDto,
        ),
      ).rejects.toThrow(
        new NotFoundException(`User with ID ${mockTokenPayload.sub} not found`),
      );
    });
  });

  describe('Remove', () => {
    it('Should remove user when ID exists', async () => {
      const mockUserRemoved = {
        name: 'John Doe',
        email: 'johnDoe@email.com',
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(mockUserRemoved as User);

      jest
        .spyOn(userRepository, 'remove')
        .mockResolvedValue(mockUserRemoved as User);

      const result = await usersService.remove(
        mockTokenPayload as TokenPayloadDto,
      );

      expect(result).toStrictEqual(mockUserRemoved);
      expect(usersService.findOne).toHaveBeenCalledWith(mockTokenPayload.sub);
      expect(userRepository.remove).toHaveBeenCalledWith(mockUserRemoved);
    });

    it('Should throw NotFoundException if ID not exists', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValue(
          new NotFoundException(
            `User with ID ${mockTokenPayload.sub} not found`,
          ),
        );

      await expect(
        usersService.remove(mockTokenPayload as TokenPayloadDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
