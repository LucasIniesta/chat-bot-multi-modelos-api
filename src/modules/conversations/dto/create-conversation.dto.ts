import { IsOptional, IsString, MaxLength } from 'class-validator';

//#TODO: Adicionar o modelo de IA usado na conversa
export class CreateConversationDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  title?: string;
}
