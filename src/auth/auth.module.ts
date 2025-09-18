import { Global, Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcryp.service';
import { HashingService } from './hashing/hashing.service';

@Global()
@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [HashingService],
})
export class AuthModule {}
