import {
  ILLMProvider,
  LLMAnalysisRequest,
  LLMAnalysisResponse,
} from './llm.interface.js';
import { MockLLMProvider } from './providers/mock.provider.js';
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

    console.log('Using Mock LLM provider');
    return new MockLLMProvider();
  }

  async analyze(request: LLMAnalysisRequest): Promise<LLMAnalysisResponse> {
    return this.provider.analyze(request);
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
