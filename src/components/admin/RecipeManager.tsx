import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Save, X, Eye, EyeOff, ArrowLeft, Clock, Users, ChefHat } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Recipe {
  id: string;
  slug: string;
  category: string;
  image_url?: string;
  published_date: string;
  is_published: boolean;
  translation?: {
    title: string;
    short_description: string;
    full_description: string;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
  };
  ingredients?: Ingredient[];
  instructions?: Instruction[];
  info?: RecipeInfo;
  nutritional_facts?: NutritionalFact[];
}

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Instruction {
  step_number: number;
  instruction: string;
}

interface RecipeInfo {
  duration_minutes: number;
  difficulty: string;
  portions: number;
}

interface NutritionalFact {
  name: string;
  quantity: number;
  unit: string;
}

interface RecipeTranslation {
  title: string;
  short_description: string;
  full_description: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

interface RecipeManagerProps {
  onBack: () => void;
}

const RecipeManager: React.FC<RecipeManagerProps> = ({ onBack }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'gr', name: 'Ελληνικά', flag: '🇬🇷' }
  ];

  const categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snacks',
    'Desserts',
    'Beverages',
    'Appetizers',
    'Salads',
    'Soups',
    'Main Course',
    'Side Dishes',
    'Healthy',
    'Vegetarian',
    'Vegan',
    'Gluten-Free'
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const units = [
    'g', 'kg', 'ml', 'l', 'cup', 'cups', 'tbsp', 'tsp', 'piece', 'pieces', 
    'slice', 'slices', 'clove', 'cloves', 'pinch', 'dash', 'handful', 'oz', 'lb'
  ];

  const nutritionalUnits = [
    'kcal', 'cal', 'g', 'mg', 'μg', 'IU', '%', 'ml', 'l'
  ];

  // Initial form state
  const initialRecipeForm = {
    slug: '',
    category: 'Main Course',
    image_url: '',
    published_date: new Date().toISOString().split('T')[0],
    is_published: true
  };

  const initialTranslationForm: RecipeTranslation = {
    title: '',
    short_description: '',
    full_description: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  };

  const initialRecipeInfo = {
    duration_minutes: 30,
    difficulty: 'medium',
    portions: 4
  };

  const [recipeForm, setRecipeForm] = useState(initialRecipeForm);
  const [translationForms, setTranslationForms] = useState<Record<string, RecipeTranslation>>({
    en: { ...initialTranslationForm },
    es: { ...initialTranslationForm },
    gr: { ...initialTranslationForm }
  });
  const [ingredientForms, setIngredientForms] = useState<Record<string, Ingredient[]>>({
    en: [{ name: '', quantity: 0, unit: 'g' }],
    es: [{ name: '', quantity: 0, unit: 'g' }],
    gr: [{ name: '', quantity: 0, unit: 'g' }]
  });
  const [instructionForms, setInstructionForms] = useState<Record<string, string[]>>({
    en: [''],
    es: [''],
    gr: ['']
  });
  const [recipeInfo, setRecipeInfo] = useState(initialRecipeInfo);
  const [nutritionalFactsForms, setNutritionalFactsForms] = useState<Record<string, NutritionalFact[]>>({
    en: [{ name: '', quantity: 0, unit: 'kcal' }],
    es: [{ name: '', quantity: 0, unit: 'kcal' }],
    gr: [{ name: '', quantity: 0, unit: 'kcal' }]
  });

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Auto-generate slug when English title changes
  useEffect(() => {
    if (translationForms.en.title && !editingRecipe) {
      const slug = generateSlug(translationForms.en.title);
      setRecipeForm(prev => ({ ...prev, slug }));
    }
  }, [translationForms.en.title, editingRecipe]);

  // Fetch recipes
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes_2025_12_12_18_15')
        .select(`
          *,
          recipe_translations_2025_12_12_18_15!inner(
            title,
            short_description,
            full_description,
            seo_title,
            seo_description,
            seo_keywords
          ),
          recipe_info_2025_12_12_18_15(
            duration_minutes,
            difficulty,
            portions
          )
        `)
        .eq('recipe_translations_2025_12_12_18_15.language_code', currentLanguage)
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      const recipesWithDetails = (recipesData || []).map(recipe => ({
        ...recipe,
        translation: recipe.recipe_translations_2025_12_12_18_15[0] || null,
        info: recipe.recipe_info_2025_12_12_18_15[0] || null
      }));

      setRecipes(recipesWithDetails);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch recipes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [currentLanguage]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.');
      }

      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size too large. Please upload images smaller than 50MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `recipes/recipe-${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      setRecipeForm(prev => ({ ...prev, image_url: publicUrl }));
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Add ingredient
  const addIngredient = (languageCode: string) => {
    setIngredientForms(prev => ({
      ...prev,
      [languageCode]: [...prev[languageCode], { name: '', quantity: 0, unit: 'g' }]
    }));
  };

  // Remove ingredient
  const removeIngredient = (languageCode: string, index: number) => {
    setIngredientForms(prev => ({
      ...prev,
      [languageCode]: prev[languageCode].filter((_, i) => i !== index)
    }));
  };

  // Update ingredient
  const updateIngredient = (languageCode: string, index: number, field: keyof Ingredient, value: any) => {
    setIngredientForms(prev => ({
      ...prev,
      [languageCode]: prev[languageCode].map((ingredient, i) => 
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  // Add instruction
  const addInstruction = (languageCode: string) => {
    setInstructionForms(prev => ({
      ...prev,
      [languageCode]: [...prev[languageCode], '']
    }));
  };

  // Remove instruction
  const removeInstruction = (languageCode: string, index: number) => {
    setInstructionForms(prev => ({
      ...prev,
      [languageCode]: prev[languageCode].filter((_, i) => i !== index)
    }));
  };

  // Update instruction
  const updateInstruction = (languageCode: string, index: number, value: string) => {
    setInstructionForms(prev => ({
      ...prev,
      [languageCode]: prev[languageCode].map((instruction, i) => i === index ? value : instruction)
    }));
  };

  // Add nutritional fact
  const addNutritionalFact = (languageCode: string) => {
    setNutritionalFactsForms(prev => ({
      ...prev,
      [languageCode]: [...prev[languageCode], { name: '', quantity: 0, unit: 'kcal' }]
    }));
  };

  // Remove nutritional fact
  const removeNutritionalFact = (languageCode: string, index: number) => {
    setNutritionalFactsForms(prev => ({
      ...prev,
      [languageCode]: prev[languageCode].filter((_, i) => i !== index)
    }));
  };

  // Update nutritional fact
  const updateNutritionalFact = (languageCode: string, index: number, field: keyof NutritionalFact, value: any) => {
    setNutritionalFactsForms(prev => ({
      ...prev,
      [languageCode]: prev[languageCode].map((fact, i) => 
        i === index ? { ...fact, [field]: value } : fact
      )
    }));
  };

  // Create or update recipe
  const createRecipe = async () => {
    try {
      // Validation
      for (const lang of languages) {
        if (!translationForms[lang.code].title || !translationForms[lang.code].short_description || !translationForms[lang.code].full_description) {
          throw new Error(`Please fill in all required fields for ${lang.name}`);
        }
        if (translationForms[lang.code].short_description.length > 300) {
          throw new Error(`Short description for ${lang.name} must be 300 characters or less`);
        }
        if (translationForms[lang.code].seo_description && translationForms[lang.code].seo_description.length > 160) {
          throw new Error(`SEO description for ${lang.name} must be 160 characters or less`);
        }
      }

      let recipeData;
      
      if (editingRecipe) {
        // Update existing recipe
        const { data: updatedRecipe, error: recipeError } = await supabase
          .from('recipes_2025_12_12_18_15')
          .update(recipeForm)
          .eq('id', editingRecipe.id)
          .select()
          .single();

        if (recipeError) throw recipeError;
        recipeData = updatedRecipe;

        // Delete existing related data
        await Promise.all([
          supabase.from('recipe_translations_2025_12_12_18_15').delete().eq('recipe_id', editingRecipe.id),
          supabase.from('recipe_ingredients_2025_12_12_18_15').delete().eq('recipe_id', editingRecipe.id),
          supabase.from('recipe_instructions_2025_12_12_18_15').delete().eq('recipe_id', editingRecipe.id),
          supabase.from('recipe_info_2025_12_12_18_15').delete().eq('recipe_id', editingRecipe.id),
          supabase.from('recipe_nutritional_facts_2025_12_12_19_00').delete().eq('recipe_id', editingRecipe.id)
        ]);
      } else {
        // Create new recipe
        const { data: newRecipe, error: recipeError } = await supabase
          .from('recipes_2025_12_12_18_15')
          .insert([recipeForm])
          .select()
          .single();

        if (recipeError) throw recipeError;
        recipeData = newRecipe;
      }

      // Create translations
      const translationsToInsert = languages.map(lang => ({
        recipe_id: recipeData.id,
        language_code: lang.code,
        ...translationForms[lang.code]
      }));

      const { error: translationsError } = await supabase
        .from('recipe_translations_2025_12_12_18_15')
        .insert(translationsToInsert);

      if (translationsError) throw translationsError;

      // Create recipe info
      const { error: infoError } = await supabase
        .from('recipe_info_2025_12_12_18_15')
        .insert([{ recipe_id: recipeData.id, ...recipeInfo }]);

      if (infoError) throw infoError;

      // Create ingredients
      const ingredientsToInsert = languages.flatMap(lang => 
        ingredientForms[lang.code]
          .filter(ingredient => ingredient.name.trim() && ingredient.quantity > 0)
          .map((ingredient, index) => ({
            recipe_id: recipeData.id,
            language_code: lang.code,
            name: ingredient.name.trim(),
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            order_index: index
          }))
      );

      if (ingredientsToInsert.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients_2025_12_12_18_15')
          .insert(ingredientsToInsert);

        if (ingredientsError) throw ingredientsError;
      }

      // Create instructions
      const instructionsToInsert = languages.flatMap(lang => 
        instructionForms[lang.code]
          .filter(instruction => instruction.trim())
          .map((instruction, index) => ({
            recipe_id: recipeData.id,
            language_code: lang.code,
            step_number: index + 1,
            instruction: instruction.trim()
          }))
      );

      if (instructionsToInsert.length > 0) {
        const { error: instructionsError } = await supabase
          .from('recipe_instructions_2025_12_12_18_15')
          .insert(instructionsToInsert);

        if (instructionsError) throw instructionsError;
      }

      // Create nutritional facts
      const nutritionalFactsToInsert = languages.flatMap(lang => 
        nutritionalFactsForms[lang.code]
          .filter(fact => fact.name.trim() && fact.quantity > 0)
          .map((fact, index) => ({
            recipe_id: recipeData.id,
            language_code: lang.code,
            name: fact.name.trim(),
            quantity: fact.quantity,
            unit: fact.unit,
            order_index: index
          }))
      );

      if (nutritionalFactsToInsert.length > 0) {
        const { error: nutritionalFactsError } = await supabase
          .from('recipe_nutritional_facts_2025_12_12_19_00')
          .insert(nutritionalFactsToInsert);

        if (nutritionalFactsError) throw nutritionalFactsError;
      }

      toast({
        title: 'Success',
        description: editingRecipe ? 'Recipe updated successfully' : 'Recipe created successfully'
      });

      setShowCreateForm(false);
      resetForms();
      fetchRecipes();
    } catch (error: any) {
      console.error('Error creating recipe:', error);
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create recipe',
        variant: 'destructive'
      });
    }
  };

  // Reset forms
  const resetForms = () => {
    setRecipeForm(initialRecipeForm);
    setTranslationForms({
      en: { ...initialTranslationForm },
      es: { ...initialTranslationForm },
      gr: { ...initialTranslationForm }
    });
    setIngredientForms({
      en: [{ name: '', quantity: 0, unit: 'g' }],
      es: [{ name: '', quantity: 0, unit: 'g' }],
      gr: [{ name: '', quantity: 0, unit: 'g' }]
    });
    setInstructionForms({
      en: [''],
      es: [''],
      gr: ['']
    });
    setRecipeInfo(initialRecipeInfo);
    setNutritionalFactsForms({
      en: [{ name: '', quantity: 0, unit: 'kcal' }],
      es: [{ name: '', quantity: 0, unit: 'kcal' }],
      gr: [{ name: '', quantity: 0, unit: 'kcal' }]
    });
    setEditingRecipe(null);
  };

  // Toggle recipe published status
  const toggleRecipePublished = async (recipeId: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('recipes_2025_12_12_18_15')
        .update({ is_published: !isPublished })
        .eq('id', recipeId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Recipe ${!isPublished ? 'published' : 'unpublished'}`
      });

      fetchRecipes();
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast({
        title: 'Error',
        description: 'Failed to update recipe',
        variant: 'destructive'
      });
    }
  };

  // Load recipe for editing
  const loadRecipeForEdit = async (recipeId: string) => {
    try {
      // Fetch recipe with all related data
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes_2025_12_12_18_15')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (recipeError) throw recipeError;

      // Fetch translations
      const { data: translationsData } = await supabase
        .from('recipe_translations_2025_12_12_18_15')
        .select('*')
        .eq('recipe_id', recipeId);

      // Fetch ingredients
      const { data: ingredientsData } = await supabase
        .from('recipe_ingredients_2025_12_12_18_15')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('order_index');

      // Fetch instructions
      const { data: instructionsData } = await supabase
        .from('recipe_instructions_2025_12_12_18_15')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('step_number');

      // Fetch recipe info
      const { data: infoData } = await supabase
        .from('recipe_info_2025_12_12_18_15')
        .select('*')
        .eq('recipe_id', recipeId)
        .single();

      // Fetch nutritional facts
      const { data: nutritionalFactsData } = await supabase
        .from('recipe_nutritional_facts_2025_12_12_19_00')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('order_index');

      // Set recipe form
      setRecipeForm({
        slug: recipeData.slug,
        category: recipeData.category,
        image_url: recipeData.image_url || '',
        published_date: recipeData.published_date,
        is_published: recipeData.is_published
      });

      // Set translations
      const translationsByLang: Record<string, RecipeTranslation> = {
        en: { ...initialTranslationForm },
        es: { ...initialTranslationForm },
        gr: { ...initialTranslationForm }
      };
      
      translationsData?.forEach(translation => {
        translationsByLang[translation.language_code] = {
          title: translation.title,
          short_description: translation.short_description,
          full_description: translation.full_description,
          seo_title: translation.seo_title,
          seo_description: translation.seo_description,
          seo_keywords: translation.seo_keywords
        };
      });
      setTranslationForms(translationsByLang);

      // Set ingredients by language
      const ingredientsByLang: Record<string, Ingredient[]> = {
        en: [],
        es: [],
        gr: []
      };
      
      ingredientsData?.forEach(ingredient => {
        if (!ingredientsByLang[ingredient.language_code]) {
          ingredientsByLang[ingredient.language_code] = [];
        }
        ingredientsByLang[ingredient.language_code].push({
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        });
      });
      
      // Ensure each language has at least one empty ingredient
      Object.keys(ingredientsByLang).forEach(lang => {
        if (ingredientsByLang[lang].length === 0) {
          ingredientsByLang[lang] = [{ name: '', quantity: 0, unit: 'g' }];
        }
      });
      setIngredientForms(ingredientsByLang);

      // Set instructions by language
      const instructionsByLang: Record<string, string[]> = {
        en: [],
        es: [],
        gr: []
      };
      
      instructionsData?.forEach(instruction => {
        if (!instructionsByLang[instruction.language_code]) {
          instructionsByLang[instruction.language_code] = [];
        }
        instructionsByLang[instruction.language_code].push(instruction.instruction);
      });
      
      // Ensure each language has at least one empty instruction
      Object.keys(instructionsByLang).forEach(lang => {
        if (instructionsByLang[lang].length === 0) {
          instructionsByLang[lang] = [''];
        }
      });
      setInstructionForms(instructionsByLang);

      // Set nutritional facts by language
      const nutritionalFactsByLang: Record<string, NutritionalFact[]> = {
        en: [],
        es: [],
        gr: []
      };
      
      nutritionalFactsData?.forEach(fact => {
        if (!nutritionalFactsByLang[fact.language_code]) {
          nutritionalFactsByLang[fact.language_code] = [];
        }
        nutritionalFactsByLang[fact.language_code].push({
          name: fact.name,
          quantity: fact.quantity,
          unit: fact.unit
        });
      });
      
      // Ensure each language has at least one empty nutritional fact
      Object.keys(nutritionalFactsByLang).forEach(lang => {
        if (nutritionalFactsByLang[lang].length === 0) {
          nutritionalFactsByLang[lang] = [{ name: '', quantity: 0, unit: 'kcal' }];
        }
      });
      setNutritionalFactsForms(nutritionalFactsByLang);

      // Set recipe info
      if (infoData) {
        setRecipeInfo({
          duration_minutes: infoData.duration_minutes,
          difficulty: infoData.difficulty,
          portions: infoData.portions
        });
      }

      // Set editing state
      setEditingRecipe({ ...recipeData, id: recipeId });
      setShowCreateForm(true);

      toast({
        title: 'Success',
        description: 'Recipe loaded for editing'
      });
    } catch (error: any) {
      console.error('Error loading recipe for edit:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recipe for editing',
        variant: 'destructive'
      });
    }
  };

  // Delete recipe
  const deleteRecipe = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('recipes_2025_12_12_18_15')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Recipe deleted successfully'
      });

      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete recipe',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Recipe Management</h2>
            <p className="text-muted-foreground">Create and manage your nutrition recipes</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gradient-accent text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Recipe
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}</CardTitle>
            <CardDescription>
              {editingRecipe ? 'Update recipe information and content' : 'Add a new recipe with multilingual content and detailed instructions'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content & SEO</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
                <TabsTrigger value="details">Recipe Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={recipeForm.category} 
                      onValueChange={(value) => setRecipeForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Published Date</Label>
                    <Input
                      type="date"
                      value={recipeForm.published_date}
                      onChange={(e) => setRecipeForm(prev => ({ ...prev, published_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>URL Slug (auto-generated)</Label>
                  <Input
                    value={recipeForm.slug}
                    onChange={(e) => setRecipeForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="recipe-url-slug"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL: /recipes/{recipeForm.slug}
                  </p>
                </div>

                {/* Recipe Image Upload */}
                <div className="space-y-2">
                  <Label>Recipe Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {recipeForm.image_url ? (
                      <div className="space-y-2">
                        <img 
                          src={recipeForm.image_url} 
                          alt="Recipe preview" 
                          className="max-h-32 mx-auto rounded"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setRecipeForm(prev => ({ ...prev, image_url: '' }))}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ChefHat className="h-12 w-12 mx-auto text-gray-400" />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            className="hidden"
                            id="recipe-image-upload"
                          />
                          <Label htmlFor="recipe-image-upload" className="cursor-pointer">
                            <Button variant="outline" asChild>
                              <span>
                                <Plus className="h-4 w-4 mr-2" />
                                Upload Image
                              </span>
                            </Button>
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {languages.map(lang => (
                      <TabsTrigger key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {languages.map(lang => (
                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title *</Label>
                          <Input
                            value={translationForms[lang.code].title}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], title: e.target.value }
                            }))}
                            placeholder="Recipe title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Short Description * (max 300 chars)</Label>
                          <Textarea
                            value={translationForms[lang.code].short_description}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], short_description: e.target.value }
                            }))}
                            placeholder="Brief recipe description for cards"
                            maxLength={300}
                            rows={3}
                          />
                          <p className="text-sm text-muted-foreground">
                            {translationForms[lang.code].short_description.length}/300 characters
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Full Description *</Label>
                        <Textarea
                          value={translationForms[lang.code].full_description}
                          onChange={(e) => setTranslationForms(prev => ({
                            ...prev,
                            [lang.code]: { ...prev[lang.code], full_description: e.target.value }
                          }))}
                          placeholder="Detailed recipe description and background"
                          rows={6}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>SEO Title</Label>
                          <Input
                            value={translationForms[lang.code].seo_title}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], seo_title: e.target.value }
                            }))}
                            placeholder="SEO optimized title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SEO Description (max 160 chars)</Label>
                          <Textarea
                            value={translationForms[lang.code].seo_description}
                            onChange={(e) => setTranslationForms(prev => ({
                              ...prev,
                              [lang.code]: { ...prev[lang.code], seo_description: e.target.value }
                            }))}
                            placeholder="SEO meta description"
                            maxLength={160}
                            rows={2}
                          />
                          <p className="text-sm text-muted-foreground">
                            {translationForms[lang.code].seo_description.length}/160 characters
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>SEO Keywords</Label>
                        <Input
                          value={translationForms[lang.code].seo_keywords}
                          onChange={(e) => setTranslationForms(prev => ({
                            ...prev,
                            [lang.code]: { ...prev[lang.code], seo_keywords: e.target.value }
                          }))}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>

              <TabsContent value="ingredients" className="space-y-4">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {languages.map(lang => (
                      <TabsTrigger key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {languages.map(lang => (
                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Ingredients</Label>
                        {ingredientForms[lang.code].map((ingredient, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-5">
                              <Input
                                value={ingredient.name}
                                onChange={(e) => updateIngredient(lang.code, index, 'name', e.target.value)}
                                placeholder="Ingredient name"
                              />
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={ingredient.quantity}
                                onChange={(e) => updateIngredient(lang.code, index, 'quantity', parseFloat(e.target.value) || 0)}
                                placeholder="Quantity"
                              />
                            </div>
                            <div className="col-span-3">
                              <Select
                                value={ingredient.unit}
                                onValueChange={(value) => updateIngredient(lang.code, index, 'unit', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {units.map(unit => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeIngredient(lang.code, index)}
                                disabled={ingredientForms[lang.code].length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addIngredient(lang.code)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Ingredient
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>

              <TabsContent value="instructions" className="space-y-4">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {languages.map(lang => (
                      <TabsTrigger key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {languages.map(lang => (
                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Cooking Instructions</Label>
                        {instructionForms[lang.code].map((instruction, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">
                              {index + 1}
                            </div>
                            <Textarea
                              value={instruction}
                              onChange={(e) => updateInstruction(lang.code, index, e.target.value)}
                              placeholder={`Step ${index + 1} instructions`}
                              rows={2}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeInstruction(lang.code, index)}
                              disabled={instructionForms[lang.code].length === 1}
                              className="mt-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addInstruction(lang.code)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Step
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={recipeInfo.duration_minutes}
                      onChange={(e) => setRecipeInfo(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 30 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select 
                      value={recipeInfo.difficulty} 
                      onValueChange={(value) => setRecipeInfo(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(diff => (
                          <SelectItem key={diff.value} value={diff.value}>
                            {diff.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Portions</Label>
                    <Input
                      type="number"
                      min="1"
                      value={recipeInfo.portions}
                      onChange={(e) => setRecipeInfo(prev => ({ ...prev, portions: parseInt(e.target.value) || 4 }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-4">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {languages.map(lang => (
                      <TabsTrigger key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {languages.map(lang => (
                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nutritional Facts</Label>
                        {nutritionalFactsForms[lang.code].map((fact, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-5">
                              <Input
                                value={fact.name}
                                onChange={(e) => updateNutritionalFact(lang.code, index, 'name', e.target.value)}
                                placeholder="Nutrient name (e.g., Calories, Protein)"
                              />
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={fact.quantity}
                                onChange={(e) => updateNutritionalFact(lang.code, index, 'quantity', parseFloat(e.target.value) || 0)}
                                placeholder="Amount"
                              />
                            </div>
                            <div className="col-span-3">
                              <Select
                                value={fact.unit}
                                onValueChange={(value) => updateNutritionalFact(lang.code, index, 'unit', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {nutritionalUnits.map(unit => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeNutritionalFact(lang.code, index)}
                                disabled={nutritionalFactsForms[lang.code].length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addNutritionalFact(lang.code)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Nutritional Fact
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => { 
                setShowCreateForm(false); 
                resetForms(); 
              }}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={createRecipe} 
                className="gradient-accent text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recipes List */}
      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  {recipe.image_url && (
                    <img 
                      src={recipe.image_url} 
                      alt={recipe.translation?.title || 'Recipe'} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {recipe.translation?.title || 'Untitled Recipe'}
                      <Badge variant={recipe.is_published ? 'default' : 'secondary'}>
                        {recipe.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="outline">
                        {recipe.category}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.info?.duration_minutes} min
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {recipe.info?.portions} portions
                      </span>
                      <span className="capitalize">{recipe.info?.difficulty}</span>
                      <span>/{recipe.slug}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRecipePublished(recipe.id, recipe.is_published)}
                  >
                    {recipe.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadRecipeForEdit(recipe.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteRecipe(recipe.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {recipe.translation?.short_description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {recipes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recipes created yet</h3>
            <p className="text-muted-foreground mb-6">Create your first recipe to get started with your nutrition content</p>
            <Button onClick={() => setShowCreateForm(true)} className="gradient-accent text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create First Recipe
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecipeManager;