import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationTitleDto } from './dto/update-conversation-title.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}
  //#TODO: Adicionar o modelo de IA usado na conversa
  //#TODO: Atualizar rota para usar o token do usuário ao invés do ID
  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create(createConversationDto);
  }

  //#TODO: Atualizar rota para usar o token do usuário ao invés do ID
  @Get(':id')
  findAllUserConversations(@Param('id', ParseUUIDPipe) id: string) {
    return this.conversationsService.findAllUserConversations(id);
  }

  @Patch(':userId/:id')
  updateConversationTitle(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConversationTitleDto: UpdateConversationTitleDto,
  ) {
    return this.conversationsService.updateConversationTitle(
      userId,
      id,
      updateConversationTitleDto,
    );
  }

  @Delete(':userId/:id')
  remove(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.conversationsService.remove(id, userId);
  }
}
