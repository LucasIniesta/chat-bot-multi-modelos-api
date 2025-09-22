import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import modelConfig from 'src/config/model.config';
import { ProvidersChatDto } from '../dto/providers-chat.dto';
import { ModelProviderProtocol } from './model-provider.protocol';

@Injectable()
export class OpenaiProvider extends ModelProviderProtocol {
  private client: OpenAI;

  constructor(modelConfiguration: ConfigType<typeof modelConfig>) {
    super(modelConfiguration);

    this.client = new OpenAI({
      apiKey: this.modelConfiguration.openAi,
    });
  }

  async chat(providerChatDto: ProvidersChatDto): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: providerChatDto.model,
        messages: providerChatDto.messages,
      });

      const content = completion.choices[0]?.message?.content;

      if (!content || content.trim() === '') {
        throw new InternalServerErrorException(
          'OpenAi provider returned empty or invalid response',
        );
      }

      return content;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new BadRequestException(`OpenAi API Error: ${error.message}`);
      }

      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to process AI request');
    }
  }
}
