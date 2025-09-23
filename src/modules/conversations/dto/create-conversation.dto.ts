import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ClaudeModels } from 'src/modules/model-provider/enums/claude-models.enum';
import { OpenAiModels } from 'src/modules/model-provider/enums/openai-models.enum';
import { TProviderModels } from 'src/modules/model-provider/types/provider-models.type';

export class CreateConversationDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsEnum(
    { ...OpenAiModels, ...ClaudeModels },
    { message: 'Invalid model. Must be a valid OpenAI or Claude model' },
  )
  model?: TProviderModels;
}
