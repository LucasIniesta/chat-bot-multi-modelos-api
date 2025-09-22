import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import modelConfig from 'src/config/model.config';
import { ProvidersChatDto } from '../dto/providers-chat.dto';

export abstract class ModelProviderProtocol {
  constructor(
    @Inject(modelConfig.KEY)
    protected readonly modelConfiguration: ConfigType<typeof modelConfig>,
  ) {}
  abstract chat(providerChatDto: ProvidersChatDto): Promise<string>;
}
