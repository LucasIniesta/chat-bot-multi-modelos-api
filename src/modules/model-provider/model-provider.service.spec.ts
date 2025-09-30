import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersChatDto } from './dto/providers-chat.dto';
import { ModelProviders } from './enums/model-providers.enum';
import { OpenAiModels } from './enums/openai-models.enum';
import { ModelProviderFactory } from './factories/model-provider.factory';
import { ModelProviderService } from './model-provider.service';
import { ModelProviderProtocol } from './providers/model-provider.protocol';

describe('ModelProviderService', () => {
  let modelProviderService: ModelProviderService;
  let modelProvider: ModelProviderFactory;

  const mockModelProvider: ModelProviders = ModelProviders.OPENAI;
  const mockProviderChatDto: ProvidersChatDto = {
    model: OpenAiModels.GPT_5,
    messages: [{ role: 'user', content: 'hello' }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelProviderService,
        {
          provide: ModelProviderFactory,
          useValue: {
            getProvider: jest.fn(),
          },
        },
      ],
    }).compile();

    modelProviderService =
      module.get<ModelProviderService>(ModelProviderService);
    modelProvider = module.get<ModelProviderFactory>(ModelProviderFactory);
  });

  it('should modelProviderService and modelPrvider defined', () => {
    expect(modelProviderService).toBeDefined();
    expect(modelProvider).toBeDefined();
  });

  describe('Chat', () => {
    it('Should chat return a string', async () => {
      const mockProviderInstance: jest.Mocked<ModelProviderProtocol> = {
        chat: jest.fn().mockResolvedValue('Hello'),
      } as any;

      jest
        .spyOn(modelProvider, 'getProvider')
        .mockReturnValue(mockProviderInstance as ModelProviderProtocol);

      const result = await modelProviderService.chat(
        mockModelProvider,
        mockProviderChatDto,
      );

      expect(modelProvider.getProvider).toHaveBeenCalledWith(mockModelProvider);
      expect(mockProviderInstance.chat).toHaveBeenCalledWith(
        mockProviderChatDto,
      );
      expect(result).toBe('Hello');
    });

    it('Should handle provider erros', async () => {
      const mockProviderInstance: jest.Mocked<ModelProviderProtocol> = {
        chat: jest.fn().mockRejectedValue(new Error('Provider error')),
      } as any;

      jest
        .spyOn(modelProvider, 'getProvider')
        .mockReturnValue(mockProviderInstance as ModelProviderProtocol);

      await expect(
        modelProviderService.chat(mockModelProvider, mockProviderChatDto),
      ).rejects.toThrow('Provider error');
    });
  });
});
