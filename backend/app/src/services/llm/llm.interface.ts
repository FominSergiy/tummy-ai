export interface UserHints {
  mealTitle?: string;
  mealDescription?: string;
  ingredients?: { name: string; order: number }[];
  additionalContext?: string;
}

export interface LLMAnalysisRequest {
  imageBuffer: Buffer;
  imageMimeType: string;
  prompt?: string; // Optional custom prompt
  hints?: UserHints; // User-provided corrections to guide analysis
}

type Ingerient = {
  name: string;
  order: number;
  quantity?: string;
  isHighlighted?: boolean;
  notes?: string;
};

type HealthFlag = {
  name: string;
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence?: number;
  notes?: string;
};

type Alergen = {
  name: string;
  severity?: string;
  notes?: string;
};

export class NonFoodImageError extends Error {
  public detectedContent?: string;

  constructor(detectedContent?: string) {
    super('Image does not contain food');
    this.name = 'NonFoodImageError';
    this.detectedContent = detectedContent;
  }
}

export interface LLMAnalysisResponse {
  isFood: boolean;
  detectedContent?: string; // Description of non-food content when isFood is false
  mealTitle?: string;
  mealDescription?: string;
  ingredients: Ingerient[];
  nutritionFacts?: {
    servingSize?: string;
    servingsPerContainer?: string;
    calories?: number;
    totalFat?: number;
    saturatedFat?: number;
    transFat?: number;
    cholesterol?: number;
    sodium?: number;
    totalCarbs?: number;
    dietaryFiber?: number;
    totalSugars?: number;
    addedSugars?: number;
    protein?: number;
    vitaminD?: number;
    calcium?: number;
    iron?: number;
    potassium?: number;
    additionalNotes?: string;
  };
  allergens: Alergen[];
  healthFlags: HealthFlag[];
  confidence?: number; // Overall analysis confidence
  rawResponse?: any; // Provider-specific raw response
}

export interface ILLMProvider {
  analyze(request: LLMAnalysisRequest): Promise<LLMAnalysisResponse>;
  getName(): string;
  isAvailable(): boolean;
}
