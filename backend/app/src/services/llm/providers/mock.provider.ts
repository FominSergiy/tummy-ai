import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  ILLMProvider,
  LLMAnalysisRequest,
  LLMAnalysisResponse,
} from '../llm.interface.js';

// Get the directory of the current file (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MOCK_FILE_PATH = join(__dirname, '../mocks/mockResponses.json');

export class MockLLMProvider implements ILLMProvider {
  getName(): string {
    return 'MockProvider';
  }

  isAvailable(): boolean {
    return true;
  }

  private async getMockLLMResps(): Promise<string> {
    try {
      const data = await readFile(MOCK_FILE_PATH, 'utf8');
      return data;
    } catch (err) {
      throw new Error(`Failed to read mock responses file: ${err}`);
    }
  }

  async analyze(request: LLMAnalysisRequest): Promise<LLMAnalysisResponse> {
    // Simulate processing delay (500ms-2s)
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1500)
    );

    // Generate realistic mock data based on daily meals
    const mockResponses = await this.getMockLLMResps();
    const mockMeals: LLMAnalysisResponse[] = JSON.parse(mockResponses);

    // Return random mock meal or first one
    const selected = mockMeals[Math.floor(Math.random() * mockMeals.length)];

    // If hints provided, use them to override mock data
    const result: LLMAnalysisResponse = {
      ...selected,
      isFood: true, // Mock provider always returns food responses
      mealTitle: request.hints?.mealTitle || selected.mealTitle,
      mealDescription:
        request.hints?.mealDescription || selected.mealDescription,
      confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
      rawResponse: {
        provider: 'mock',
        timestamp: new Date().toISOString(),
        imageSize: request.imageBuffer.length,
        hintsProvided: !!request.hints,
      },
    };

    return result;
  }
}
