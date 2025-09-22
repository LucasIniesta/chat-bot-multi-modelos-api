import { Inject, Injectable } from '@nestjs/common';
import { ProvidersChatDto } from './dto/providers-chat.dto';
import { ModelProviders } from './enums/model-providers.enum';
import { ModelProviderFactory } from './factories/model-provider.factory';

@Injectable()
export class ModelProviderService {
  constructor(
    @Inject()
    private readonly modelProvider: ModelProviderFactory,
  ) {}

  async chat(
    modelProvider: ModelProviders,
    providerChatDto: ProvidersChatDto,
  ): Promise<string> {
    const provider = this.modelProvider.getProvider(modelProvider);
    return provider.chat(providerChatDto);
  }
}
