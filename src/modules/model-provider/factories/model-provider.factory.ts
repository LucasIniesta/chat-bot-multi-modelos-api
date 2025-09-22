import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ModelProviders } from '../enums/model-providers.enum';
import { ClaudeProvider } from '../providers/claude.provider';
import { ModelProviderProtocol } from '../providers/model-provider.protocol';
import { OpenaiProvider } from '../providers/openai.provider';

@Injectable()
export class ModelProviderFactory {
  constructor(
    @Inject()
    private readonly opeanaiProvider: OpenaiProvider,
    private readonly claudeProvider: ClaudeProvider,
  ) {}

  getProvider(modelProvider: ModelProviders): ModelProviderProtocol {
    switch (modelProvider) {
      case ModelProviders.CLAUDE:
        return this.claudeProvider;
      case ModelProviders.OPENAI:
        return this.opeanaiProvider;
      default:
        throw new NotFoundException('Provider not found');
    }
  }
}
