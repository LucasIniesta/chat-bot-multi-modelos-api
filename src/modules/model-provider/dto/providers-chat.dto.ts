import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TProviderMessages } from '../types/provider-messages.type';
import { TProviderModels } from '../types/provider-models.type';

export class ProviderMessageDto implements TProviderMessages {
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;
}

export class ProvidersChatDto {
  @IsNotEmpty({ message: 'Model is required' })
  @IsString()
  model: TProviderModels;

  @IsNotEmpty({ message: 'Messages are required' })
  @IsArray({ message: 'Messages must be an array' })
  @ArrayMinSize(1, { message: 'At least one message is required' })
  @ArrayMaxSize(100, { message: 'Too many messages (max 100)' })
  @ValidateNested({ each: true })
  @Type(() => ProviderMessageDto)
  messages: TProviderMessages[];
}
