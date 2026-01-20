import { readFile } from 'fs/promises';
import OpenAI from 'openai';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  ILLMProvider,
  LLMAnalysisRequest,
  LLMAnalysisResponse,
} from '../llm.interface';

type UserContent = (
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }
)[];

// Get the directory of the current file (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROMPT_FILE = '../prompts/food-analysis.prompt.txt';

export class OpenRouterProvider implements ILLMProvider {
  private apiKey: string;
  private client: OpenAI;
  private imageModel: string;

  constructor(baseUrl?: string) {
    this.apiKey = process.env.OPEN_ROUTER_KEY || '';
    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: baseUrl ?? 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/FominSergiy/tummy-ai', // Optional. Site URL for rankings on openrouter.ai.
        'X-Title': 'Tummy AI', // Optional. Site title for rankings on openrouter.ai.
      },
    });
    this.imageModel = process.env.OPEN_ROUTER_IMAGE_MODEL || '';
  }
  getName(): string {
    return 'OpenRouter';
  }

  isAvailable(): boolean {
    return true;
  }

  private async getSystemPrompt(): Promise<string> {
    const promptPath = join(__dirname, PROMPT_FILE);
    try {
      const prompt = await readFile(promptPath, 'utf8');
      return prompt;
    } catch (err) {
      throw new Error(`Failed to read mock responses file: ${err}`);
    }
  }

  private getBase64ImageUrl(
    imageBuffer: Buffer<ArrayBufferLike>,
    imageMimeType: string
  ): string {
    const base64Image = imageBuffer.toString('base64');
    const base64url = `data:${imageMimeType};base64,${base64Image}`;
    return base64url;
  }

  async analyzeImage(
    request: LLMAnalysisRequest
  ): Promise<LLMAnalysisResponse> {
    // 1. decode the request and extract image, prompt, etc
    const { imageBuffer, imageMimeType, prompt } = request;

    // 2. load system prompt from prompts/food-analysis.prompt.txt
    const systemPrompt = await this.getSystemPrompt();

    // 3. Convert image buffer to base64
    const imageDataUrl = this.getBase64ImageUrl(imageBuffer, imageMimeType);

    // 4. Build user content array with image and optional text prompt
    const userContent: UserContent = [
      {
        type: 'image_url',
        image_url: {
          url: imageDataUrl,
        },
      },
    ];

    // Add text prompt if provided (wrapped to identify as user context, not commands)
    if (prompt) {
      const wrappedPrompt = `[User's description of the food: "${prompt}"]`;
      userContent.push({
        type: 'text',
        text: wrappedPrompt,
      });
    }

    // 5. create payload request for analysis
    const results = await this.client.chat.completions.create({
      model: this.imageModel,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
    });

    // 6. Parse response and map to LLMAnalysisResponse
    const responseContent = results.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content from OpenRouter');
    }

    try {
      // Parse JSON response from LLM
      const parsedResponse = JSON.parse(responseContent);

      // Map to LLMAnalysisResponse format
      return {
        isFood: parsedResponse.isFood ?? true,
        detectedContent: parsedResponse.detectedContent,
        mealTitle: parsedResponse.mealTitle,
        mealDescription: parsedResponse.mealDescription,
        ingredients: parsedResponse.ingredients || [],
        nutritionFacts: parsedResponse.nutritionFacts,
        // allergens: parsedResponse.allergens || [],
        // healthFlags: parsedResponse.healthFlags || [],
        confidence: parsedResponse.confidence,
        rawResponse: {
          provider: 'OpenRouter',
          model: this.imageModel,
          usage: results.usage,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (parseError) {
      throw new Error(
        `Failed to parse LLM response: ${parseError}. Response: ${responseContent}`
      );
    }
  }
}
