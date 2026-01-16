import {
  ILLMProvider,
  LLMAnalysisRequest,
  LLMAnalysisResponse,
} from './llm.interface.js';
import { OpenRouterProvider } from './providers/openRouter.provider.js';
// import { AnthropicLLMProvider } from './providers/anthropic.provider.js';

class LLMService {
  private provider: ILLMProvider;

  constructor() {
    // Auto-select provider based on environment
    this.provider = this.selectProvider();
  }

  private selectProvider(): ILLMProvider {
    // Priority: Anthropic > Mock
    // Uncomment when ready to use Anthropic
    // try {
    //   const anthropic = new AnthropicLLMProvider();
    //   if (anthropic.isAvailable()) {
    //     console.log('Using Anthropic LLM provider');
    //     return anthropic;
    //   }
    // } catch (error) {
    //   console.warn('Anthropic provider not available:', error);
    // }

    // console.log('Using Mock LLM provider');
    // return new MockLLMProvider();
    return new OpenRouterProvider();
  }

  async analyzeImage(
    request: LLMAnalysisRequest
  ): Promise<LLMAnalysisResponse> {
    return this.provider.analyzeImage(request);
  }

  getProviderName(): string {
    return this.provider.getName();
  }

  // Allow manual provider override for testing
  setProvider(provider: ILLMProvider): void {
    this.provider = provider;
  }
}

export const llmService = new LLMService();
