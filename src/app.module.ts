import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { ModelProviderModule } from './modules/model-provider/model-provider.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    ConversationsModule,
    AuthModule,
    ModelProviderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
