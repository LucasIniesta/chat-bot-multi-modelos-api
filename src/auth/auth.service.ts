import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import jwtConfig from 'src/config/jwt.config';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
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
    const userExists = await this.userRepository.findOneBy({
      email: loginDto.email,
    });

    const passwordIsValid = userExists
      ? await this.hashingService.compare(
          loginDto.password,
          userExists.password,
        )
      : false;

    if (!passwordIsValid || !userExists) {
      throw new ForbiddenException('Wrong credencials');
    }

    return this.createTokens(userExists);
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<TokenPayloadDto>(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );

      const user = await this.userRepository.findOneBy({ id: sub });

      if (!user) {
        throw new NotFoundException(`User ${sub} doesn't exist`);
      }

      return this.createTokens(user);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      }

      throw new UnauthorizedException(error);
    }
  }

  private async createTokens(userExists: User) {
    const [token, refreshToken] = await Promise.all([
      this.singAsyncToken<Partial<User>>(
        this.jwtConfiguration.ttl,
        userExists.id,
        { email: userExists?.email },
      ),
      this.singAsyncToken(this.jwtConfiguration.refreshTtl, userExists?.id),
    ]);

    return { token, refreshToken };
  }

  private async singAsyncToken<T>(expiresIn: number, sub: string, payload?: T) {
    return await this.jwtService.signAsync(
      {
        ...payload,
        sub,
      },
      {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        expiresIn,
        audience: this.jwtConfiguration.audience,
      },
    );
  }
}
