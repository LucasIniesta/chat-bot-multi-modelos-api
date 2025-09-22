import { TProviderMessages } from '../types/provider-messages.type';
import { TProviderModels } from '../types/provider-models.type';

export class ProvidersChatDto {
  model: TProviderModels;
  messages: TProviderMessages[];
}
