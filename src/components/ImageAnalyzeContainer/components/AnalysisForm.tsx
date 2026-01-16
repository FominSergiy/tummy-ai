import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AnalysisData,
  Ingredient,
  NutritionFacts,
} from '../ImageAnalyzeContainer.types';

interface AnalysisFormProps {
  analysis: AnalysisData;
  onChange: <K extends keyof AnalysisData>(
    field: K,
    value: AnalysisData[K]
  ) => void;
  isDisabled?: boolean;
}

export const AnalysisForm = ({
  analysis,
  onChange,
  isDisabled = false,
}: AnalysisFormProps) => {
  const [showNutrition, setShowNutrition] = useState(false);

  const handleMealTitleChange = useCallback(
    (text: string) => onChange('mealTitle', text),
    [onChange]
  );

  const handleMealDescriptionChange = useCallback(
    (text: string) => onChange('mealDescription', text),
    [onChange]
  );

  const handleNutritionFactChange = useCallback(
    (key: keyof NutritionFacts, value: string) => {
      const nutrition = analysis.nutritionFacts || {};
      const numericKeys = [
        'calories',
        'totalFat',
        'saturatedFat',
        'transFat',
        'cholesterol',
        'sodium',
        'totalCarbs',
        'dietaryFiber',
        'totalSugars',
        'addedSugars',
        'protein',
        'vitaminD',
        'calcium',
        'iron',
        'potassium',
      ];

      let parsedValue: string | number | undefined;
      if (numericKeys.includes(key)) {
        parsedValue = value === '' ? undefined : parseFloat(value);
        if (parsedValue !== undefined && isNaN(parsedValue)) {
          return; // Don't update if invalid number
        }
      } else {
        parsedValue = value;
      }

      onChange('nutritionFacts', {
        ...nutrition,
        [key]: parsedValue,
      });
    },
    [analysis.nutritionFacts, onChange]
  );

  const handleIngredientChange = useCallback(
    (index: number, name: string) => {
      const updated = [...analysis.ingredients];
      updated[index] = { ...updated[index], name };
      onChange('ingredients', updated);
    },
    [analysis.ingredients, onChange]
  );

  const handleRemoveIngredient = useCallback(
    (index: number) => {
      const updated = analysis.ingredients.filter((_, i) => i !== index);
      // Re-order remaining ingredients
      const reordered = updated.map((ing, i) => ({ ...ing, order: i + 1 }));
      onChange('ingredients', reordered);
    },
    [analysis.ingredients, onChange]
  );

  const handleAddIngredient = useCallback(() => {
    const newIngredient: Ingredient = {
      name: '',
      order: analysis.ingredients.length + 1,
    };
    onChange('ingredients', [...analysis.ingredients, newIngredient]);
  }, [analysis.ingredients, onChange]);

  const toggleNutrition = useCallback(() => {
    setShowNutrition((prev) => !prev);
  }, []);

  const renderIngredientsList = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {analysis.ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <Text style={styles.ingredientOrder}>{ingredient.order}.</Text>
          <TextInput
            style={[styles.ingredientInput, isDisabled && styles.disabledInput]}
            value={ingredient.name}
            onChangeText={(text) => handleIngredientChange(index, text)}
            editable={!isDisabled}
            placeholder="Ingredient name"
          />
          {!isDisabled && (
            <TouchableOpacity
              onPress={() => handleRemoveIngredient(index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {!isDisabled && (
        <TouchableOpacity
          onPress={handleAddIngredient}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Add Ingredient</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderNutritionFacts = () => {
    const nutrition = analysis.nutritionFacts || {};

    const nutritionFields: {
      key: keyof NutritionFacts;
      label: string;
      unit?: string;
    }[] = [
      { key: 'servingSize', label: 'Serving Size' },
      { key: 'calories', label: 'Calories' },
      { key: 'totalFat', label: 'Total Fat', unit: 'g' },
      { key: 'saturatedFat', label: 'Saturated Fat', unit: 'g' },
      { key: 'cholesterol', label: 'Cholesterol', unit: 'mg' },
      { key: 'sodium', label: 'Sodium', unit: 'mg' },
      { key: 'totalCarbs', label: 'Total Carbs', unit: 'g' },
      { key: 'dietaryFiber', label: 'Dietary Fiber', unit: 'g' },
      { key: 'totalSugars', label: 'Total Sugars', unit: 'g' },
      { key: 'protein', label: 'Protein', unit: 'g' },
    ];

    return (
      <View style={styles.section}>
        <TouchableOpacity
          onPress={toggleNutrition}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Nutrition Facts</Text>
          <Text style={styles.expandIcon}>{showNutrition ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        {showNutrition && (
          <View style={styles.nutritionGrid}>
            {nutritionFields.map(({ key, label, unit }) => (
              <View key={key} style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>{label}</Text>
                <View style={styles.nutritionInputWrapper}>
                  <TextInput
                    style={[
                      styles.nutritionInput,
                      isDisabled && styles.disabledInput,
                    ]}
                    value={
                      nutrition[key] !== undefined ? String(nutrition[key]) : ''
                    }
                    onChangeText={(text) =>
                      handleNutritionFactChange(key, text)
                    }
                    editable={!isDisabled}
                    placeholder="-"
                    keyboardType={key === 'servingSize' ? 'default' : 'numeric'}
                  />
                  {unit && <Text style={styles.unitText}>{unit}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderAllergens = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Allergens</Text>
      <View style={styles.pillContainer}>
        {analysis.allergens.length > 0 ? (
          analysis.allergens.map((allergen, index) => (
            <View
              key={index}
              style={[
                styles.pill,
                allergen.severity === 'Contains'
                  ? styles.pillDanger
                  : styles.pillWarning,
              ]}
            >
              <Text style={styles.pillText}>
                {allergen.severity === 'May Contain' ? '⚠ ' : ''}
                {allergen.name}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No allergens detected</Text>
        )}
      </View>
    </View>
  );

  const renderHealthFlags = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Health Flags</Text>
      {analysis.healthFlags.length > 0 ? (
        analysis.healthFlags.map((flag, index) => (
          <View key={index} style={styles.healthFlagRow}>
            <Text
              style={[
                styles.healthFlagIcon,
                flag.type === 'POSITIVE' && styles.positive,
                flag.type === 'NEGATIVE' && styles.negative,
                flag.type === 'NEUTRAL' && styles.neutral,
              ]}
            >
              {flag.type === 'POSITIVE'
                ? '+'
                : flag.type === 'NEGATIVE'
                  ? '-'
                  : '•'}
            </Text>
            <Text style={styles.healthFlagText}>{flag.name}</Text>
            {flag.confidence && (
              <Text style={styles.confidenceText}>
                {Math.round(flag.confidence * 100)}%
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No health flags</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Meal Title */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Meal Title</Text>
        <TextInput
          style={[styles.input, isDisabled && styles.disabledInput]}
          value={analysis.mealTitle || ''}
          onChangeText={handleMealTitleChange}
          editable={!isDisabled}
          placeholder="e.g., Tuna Sandwich"
        />
      </View>

      {/* Meal Description */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Meal Description</Text>
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            isDisabled && styles.disabledInput,
          ]}
          value={analysis.mealDescription || ''}
          onChangeText={handleMealDescriptionChange}
          editable={!isDisabled}
          placeholder="Describe the meal..."
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {renderIngredientsList()}
      {renderNutritionFacts()}
      {renderAllergens()}
      {renderHealthFlags()}

      {/* Confidence Score */}
      {analysis.confidence !== undefined && (
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>
            Analysis Confidence: {Math.round(analysis.confidence * 100)}%
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 12,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  expandIcon: {
    fontSize: 12,
    color: '#666',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientOrder: {
    width: 24,
    fontSize: 14,
    color: '#666',
  },
  ingredientInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  nutritionGrid: {
    marginTop: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  nutritionInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nutritionInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    minWidth: 60,
    textAlign: 'right',
  },
  unitText: {
    fontSize: 14,
    color: '#666',
    minWidth: 20,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pillDanger: {
    backgroundColor: '#ffebee',
  },
  pillWarning: {
    backgroundColor: '#fff3e0',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  healthFlagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  healthFlagIcon: {
    width: 24,
    fontSize: 16,
    fontWeight: '700',
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#ff4444',
  },
  neutral: {
    color: '#666',
  },
  healthFlagText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  confidenceText: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  confidenceContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#666',
  },
});
