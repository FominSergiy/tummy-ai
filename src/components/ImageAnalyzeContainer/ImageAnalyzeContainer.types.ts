// Types mirroring backend LLM interface for frontend use

export interface Ingredient {
  name: string;
  order: number;
  quantity?: string;
  isHighlighted?: boolean;
  notes?: string;
}

export interface HealthFlag {
  name: string;
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence?: number;
  notes?: string;
}

export interface Allergen {
  name: string;
  severity?: string;
  notes?: string;
}

export interface NutritionFacts {
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
}

export interface AnalysisData {
  isFood: boolean;
  detectedContent?: string; // Description of non-food content when isFood is false
  mealTitle?: string;
  mealDescription?: string;
  ingredients: Ingredient[];
  nutritionFacts?: NutritionFacts;
  // allergens: Allergen[];
  // healthFlags: HealthFlag[];
  confidence: number;
}

// API Response types
export interface AnalyzeResponse {
  success: boolean;
  analysisId: number;
  provider: string;
  processingTimeMs: number;
  compressionStats: {
    originalSize: number;
    compressedSize: number;
    ratio: number;
  };
  analysis: AnalysisData;
  message: string;
}

export interface CommitResponse {
  success: boolean;
  analysisId: number;
  message: string;
}

export interface DeclineResponse {
  success: boolean;
  analysisId: number;
  message: string;
}

export interface ReanalyzeResponse {
  success: boolean;
  analysisId: number;
  provider: string;
  processingTimeMs: number;
  analysis: AnalysisData;
  message: string;
}

// Error response for non-food images
export interface NonFoodErrorResponse {
  error: 'Not a food image';
  message: string;
  detectedContent?: string;
}

// Component State
export type UploadState =
  | 'initial' // No image selected
  | 'image_selected' // Image selected, not yet uploaded
  | 'uploading' // Image being uploaded and analyzed
  | 'analysis_ready' // Analysis received, editable
  | 'resubmitting' // Re-submitting to LLM
  | 'saving' // Committing to backend
  | 'error'; // Error state

export interface ImageData {
  uri: string;
  fileName: string;
  mimeType: string;
}

// User edits for reanalysis
export interface UserEdits {
  mealTitle?: string;
  mealDescription?: string;
  additionalContext?: string;
}
