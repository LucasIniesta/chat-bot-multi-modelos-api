import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateConversationTitleDto } from './dto/update-conversation-title.dto';

@UseGuards(AuthTokenGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}
  //#TODO: Adicionar o modelo de IA usado na conversa
  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.conversationsService.create(
      createConversationDto,
      tokenPayload,
    );
  }

  @Get()
  findAllUserConversations(
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.conversationsService.findAllUserConversations(
      tokenPayload,
      paginationDto,
    );
  }

  @Patch(':id')
  updateConversationTitle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConversationTitleDto: UpdateConversationTitleDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.conversationsService.updateConversationTitle(
      tokenPayload,
      id,
      updateConversationTitleDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.conversationsService.remove(id, tokenPayload);
  }
}
