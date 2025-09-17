import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from '../users/users.module';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
