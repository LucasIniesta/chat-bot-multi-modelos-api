import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject()
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const existingEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingEmail) {
      throw new ConflictException(
        `Email ${createUserDto.email} already in use`,
      );
    }

    const newUser = {
      ...createUserDto,
      password: await this.hashingService.hash(createUserDto.password),
    };

    const user = this.userRepository.create(newUser);
    const { name, email } = await this.userRepository.save(user);

    return { name, email };
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(
    tokenPayload: TokenPayloadDto,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (updateUserDto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: {
          email: updateUserDto.email,
        },
        select: ['id'],
      });

      if (existingEmail && existingEmail.id !== tokenPayload.sub) {
        throw new ConflictException(
          `Email ${updateUserDto.email} already in use`,
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashingService.hash(
        updateUserDto.password,
      );
    }

    const user = await this.userRepository.preload({
      id: tokenPayload.sub,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${tokenPayload.sub} not found`);
    }

    return this.userRepository.save(user);
  }

  async remove(tokenPayload: TokenPayloadDto): Promise<Partial<User>> {
    const user = await this.findOne(tokenPayload.sub);

    const { name, email } = await this.userRepository.remove(user);

    return { name, email };
  }
}
