import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import modelConfig from 'src/config/model.config';
import { ModelProviderFactory } from './factories/model-provider.factory';
import { ModelProviderService } from './model-provider.service';
import { ClaudeProvider } from './providers/claude.provider';
import { OpenaiProvider } from './providers/openai.provider';

@Module({
  imports: [ConfigModule.forFeature(modelConfig)],
  providers: [
    ModelProviderService,
    OpenaiProvider,
    ClaudeProvider,
    ModelProviderFactory,
  ],
  exports: [ModelProviderService],
})
export class ModelProviderModule {}
