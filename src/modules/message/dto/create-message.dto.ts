import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsIn(['user', 'assistant'])
  @IsNotEmpty()
  role: 'user' | 'assistant';

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  conversationId: string;
}
