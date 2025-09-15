import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const user = this.userRepository.create(createUserDto);
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    if (updateUserDto.email) {
      const existingEmail = await this.userRepository.findOne({
        where: {
          email: updateUserDto.email,
        },
        select: ['id'],
      });

      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException(
          `Email ${updateUserDto.email} already in use`,
        );
      }
    }

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.save(user);

    return `User ${id} successfully updated`;
  }

  async remove(id: string): Promise<Partial<User>> {
    const user = await this.findOne(id);

    const { name, email } = await this.userRepository.remove(user);

    return { name, email };
  }
}
