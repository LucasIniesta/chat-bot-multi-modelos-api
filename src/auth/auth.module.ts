import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { BcryptService } from './hashing/bcryp.service';
import { HashingService } from './hashing/hashing.service';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
    AuthTokenGuard,
  ],
  exports: [HashingService, JwtModule, ConfigModule, AuthTokenGuard],
})
export class AuthModule {}
