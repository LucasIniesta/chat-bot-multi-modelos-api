import Anthropic from '@anthropic-ai/sdk';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import modelConfig from 'src/config/model.config';
import { ProvidersChatDto } from '../dto/providers-chat.dto';
import { ModelProviderProtocol } from './model-provider.protocol';

@Injectable()
export class ClaudeProvider extends ModelProviderProtocol {
  private client: Anthropic;

  constructor(modelConfiguration: ConfigType<typeof modelConfig>) {
    super(modelConfiguration);

    this.client = new Anthropic({
      apiKey: modelConfiguration.claude,
    });
  }

  async chat(providerChatDto: ProvidersChatDto): Promise<string> {
    try {
      const message = await this.client.messages.create({
        max_tokens: 2048,
        messages: providerChatDto.messages,
        model: providerChatDto.model,
      });

      const textContent = message.content.find(
        (block) => block.type === 'text',
      );
      const content = textContent?.text;

      if (!content || content.trim() === '') {
        throw new InternalServerErrorException(
          'Claude provider returned empty or invalid response',
        );
      }

      return content;
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw new BadRequestException(`Claude API Error: ${error.message}`);
      }

      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to process AI request');
    }
  }
}
