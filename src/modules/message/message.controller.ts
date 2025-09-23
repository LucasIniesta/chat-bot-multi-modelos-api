import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@UseGuards(AuthTokenGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.createMessage(createMessageDto, tokenPayload);
  }

  @Get(':conversationId')
  listMessages(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.listMessages(conversationId, tokenPayload);
  }
}
