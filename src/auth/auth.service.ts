import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import jwtConfig from 'src/config/jwt.config';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject()
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    let passwordIsValid = false;

    const userExists = await this.userRepository.findOneBy({
      email: loginDto.email,
    });

    if (userExists) {
      passwordIsValid = await this.hashingService.compare(
        loginDto.password,
        userExists.password,
      );
    }

    if (!passwordIsValid) {
      throw new ForbiddenException('Wrong credencials');
    }

    const token = await this.jwtService.signAsync(
      {
        sub: userExists?.id,
        email: userExists?.email,
      },
      {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.ttl,
        audience: this.jwtConfiguration.audience,
      },
    );

    return {
      token,
    };
  }
}
