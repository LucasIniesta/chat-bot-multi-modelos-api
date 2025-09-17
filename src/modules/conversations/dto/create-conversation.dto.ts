import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

//#TODO: Adicionar o modelo de IA usado na conversa
export class CreateConversationDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  title?: string;

  //#TODO: Atualizar rota para usar o token do usuário ao invés do ID
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
