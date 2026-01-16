import {
  ILLMProvider,
  LLMAnalysisRequest,
  LLMAnalysisResponse,
} from '../llm.interface.js';

export class MockLLMProvider implements ILLMProvider {
  getName(): string {
    return 'MockProvider';
  }

  isAvailable(): boolean {
    return true;
  }

  async analyze(request: LLMAnalysisRequest): Promise<LLMAnalysisResponse> {
    // Simulate processing delay (500ms-2s)
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1500)
    );

    // Generate realistic mock data based on common food products
    const mockProducts: LLMAnalysisResponse[] = [
      {
        productName: 'Organic Whole Milk',
        brandName: 'Happy Farms',
        ingredients: [
          { name: 'Organic Grade A Milk', order: 1, quantity: '100%' },
          { name: 'Vitamin D3', order: 2, isHighlighted: true },
        ],
        nutritionFacts: {
          servingSize: '1 cup (240ml)',
          servingsPerContainer: '8',
          calories: 150,
          totalFat: 8,
          saturatedFat: 5,
          transFat: 0,
          cholesterol: 35,
          sodium: 125,
          totalCarbs: 12,
          dietaryFiber: 0,
          totalSugars: 12,
          addedSugars: 0,
          protein: 8,
          vitaminD: 2.5,
          calcium: 300,
          iron: 0,
          potassium: 380,
        },
        allergens: [{ name: 'Milk', severity: 'Contains' }],
        healthFlags: [
          { name: 'Organic', type: 'POSITIVE', confidence: 1.0 },
          { name: 'High Calcium', type: 'POSITIVE', confidence: 0.95 },
          { name: 'High Saturated Fat', type: 'NEGATIVE', confidence: 0.9 },
        ],
      },
      {
        productName: 'Crunchy Peanut Butter',
        brandName: "Nature's Best",
        ingredients: [
          { name: 'Roasted Peanuts', order: 1, quantity: '90%' },
          { name: 'Sea Salt', order: 2, quantity: '1%' },
          { name: 'Palm Oil', order: 3, quantity: '9%' },
        ],
        nutritionFacts: {
          servingSize: '2 Tbsp (32g)',
          servingsPerContainer: '15',
          calories: 190,
          totalFat: 16,
          saturatedFat: 3,
          transFat: 0,
          cholesterol: 0,
          sodium: 140,
          totalCarbs: 8,
          dietaryFiber: 2,
          totalSugars: 3,
          addedSugars: 0,
          protein: 7,
          vitaminD: 0,
          calcium: 10,
          iron: 0.6,
          potassium: 200,
        },
        allergens: [
          { name: 'Peanuts', severity: 'Contains' },
          { name: 'Tree Nuts', severity: 'May Contain' },
        ],
        healthFlags: [
          { name: 'High Protein', type: 'POSITIVE', confidence: 0.92 },
          { name: 'High Fat', type: 'NEUTRAL', confidence: 0.88 },
          { name: 'No Added Sugar', type: 'POSITIVE', confidence: 0.95 },
        ],
      },
      {
        productName: 'Greek Yogurt Plain',
        brandName: 'Chobani',
        ingredients: [
          { name: 'Cultured Pasteurized Nonfat Milk', order: 1 },
          { name: 'Live and Active Cultures', order: 2, isHighlighted: true },
        ],
        nutritionFacts: {
          servingSize: '5.3 oz (150g)',
          servingsPerContainer: '1',
          calories: 100,
          totalFat: 0,
          saturatedFat: 0,
          transFat: 0,
          cholesterol: 10,
          sodium: 65,
          totalCarbs: 6,
          dietaryFiber: 0,
          totalSugars: 4,
          addedSugars: 0,
          protein: 18,
          vitaminD: 0,
          calcium: 200,
          iron: 0,
          potassium: 240,
        },
        allergens: [{ name: 'Milk', severity: 'Contains' }],
        healthFlags: [
          { name: 'High Protein', type: 'POSITIVE', confidence: 0.98 },
          { name: 'Low Fat', type: 'POSITIVE', confidence: 0.99 },
          { name: 'Probiotics', type: 'POSITIVE', confidence: 0.85 },
          { name: 'No Added Sugar', type: 'POSITIVE', confidence: 1.0 },
        ],
      },
      {
        productName: 'Chocolate Chip Cookies',
        brandName: 'Sweet Treats Co.',
        ingredients: [
          { name: 'Enriched Flour', order: 1 },
          { name: 'Sugar', order: 2, isHighlighted: true },
          { name: 'Chocolate Chips', order: 3 },
          { name: 'Butter', order: 4 },
          { name: 'Eggs', order: 5 },
          { name: 'Vanilla Extract', order: 6 },
          { name: 'Baking Soda', order: 7 },
          { name: 'Salt', order: 8 },
        ],
        nutritionFacts: {
          servingSize: '2 cookies (34g)',
          servingsPerContainer: '12',
          calories: 160,
          totalFat: 8,
          saturatedFat: 4.5,
          transFat: 0,
          cholesterol: 15,
          sodium: 115,
          totalCarbs: 22,
          dietaryFiber: 1,
          totalSugars: 12,
          addedSugars: 11,
          protein: 2,
          vitaminD: 0,
          calcium: 10,
          iron: 1.1,
          potassium: 45,
        },
        allergens: [
          { name: 'Wheat', severity: 'Contains' },
          { name: 'Milk', severity: 'Contains' },
          { name: 'Eggs', severity: 'Contains' },
          { name: 'Soy', severity: 'May Contain' },
        ],
        healthFlags: [
          { name: 'High Sugar', type: 'NEGATIVE', confidence: 0.96 },
          { name: 'High Saturated Fat', type: 'NEGATIVE', confidence: 0.92 },
          { name: 'Processed Food', type: 'NEGATIVE', confidence: 0.88 },
        ],
      },
    ];

    // Return random mock product or first one
    const selected =
      mockProducts[Math.floor(Math.random() * mockProducts.length)];

    // If hints provided, use them to override mock data
    const result = {
      ...selected,
      productName: request.hints?.productName || selected.productName,
      brandName: request.hints?.brandName || selected.brandName,
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
