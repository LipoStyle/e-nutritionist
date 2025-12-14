import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  ChefHat,
  CheckCircle,
  Calendar,
  MessageSquare,
  Star,
  Award,
  Target
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface RecipeDetail {
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
  info: RecipeInfo;
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

const RecipeDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { currentLanguage } = useLanguage();

  const difficultyLabels = {
    'easy': 'Easy',
    'medium': 'Medium',
    'hard': 'Hard'
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!slug) {
        console.error('No slug provided');
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('=== RECIPE DETAIL DEBUG ===');
        console.log('Fetching recipe with slug:', slug, 'language:', currentLanguage);
        console.log('Current URL:', window.location.href);
        
        // Fetch recipe with translations
        const { data: recipeData, error: recipeError } = await supabase
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
          .eq('slug', slug)
          .eq('is_published', true)
          .eq('recipe_translations_2025_12_12_18_15.language_code', currentLanguage)
          .single();

        console.log('Recipe query result:', { recipeData, recipeError });

        if (recipeError) {
          console.error('Recipe error:', recipeError);
          if (recipeError.code === 'PGRST116') {
            console.log('Recipe not found');
            setNotFound(true);
            return;
          }
          throw recipeError;
        }

        // Fetch ingredients
        const { data: ingredientsData } = await supabase
          .from('recipe_ingredients_2025_12_12_18_15')
          .select('name, quantity, unit')
          .eq('recipe_id', recipeData.id)
          .eq('language_code', currentLanguage)
          .order('order_index');

        console.log('Ingredients data:', ingredientsData);

        // Fetch instructions
        const { data: instructionsData } = await supabase
          .from('recipe_instructions_2025_12_12_18_15')
          .select('step_number, instruction')
          .eq('recipe_id', recipeData.id)
          .eq('language_code', currentLanguage)
          .order('step_number');

        console.log('Instructions data:', instructionsData);

        // Fetch nutritional facts
        const { data: nutritionalFactsData } = await supabase
          .from('recipe_nutritional_facts_2025_12_12_19_00')
          .select('name, quantity, unit')
          .eq('recipe_id', recipeData.id)
          .eq('language_code', currentLanguage)
          .order('order_index');

        console.log('Nutritional facts data:', nutritionalFactsData);

        // Check if we have the required translation
        if (!recipeData.recipe_translations_2025_12_12_18_15 || recipeData.recipe_translations_2025_12_12_18_15.length === 0) {
          console.error('No translation found for language:', currentLanguage);
          setNotFound(true);
          return;
        }

        const recipeWithDetails: RecipeDetail = {
          ...recipeData,
          translation: recipeData.recipe_translations_2025_12_12_18_15[0],
          info: recipeData.recipe_info_2025_12_12_18_15[0] || {
            duration_minutes: 30,
            difficulty: 'medium',
            portions: 4
          },
          ingredients: ingredientsData || [],
          instructions: instructionsData || [],
          nutritional_facts: nutritionalFactsData || []
        };

        console.log('Final recipe data:', recipeWithDetails);
        console.log('=== RECIPE FETCH SUCCESS ===');
        setRecipe(recipeWithDetails);
      } catch (error) {
        console.error('=== RECIPE FETCH ERROR ===');
        console.error('Error details:', error);
        console.error('Slug:', slug);
        console.error('Language:', currentLanguage);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [slug, currentLanguage]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound || !recipe) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The recipe you're looking for doesn't exist or is no longer available.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Slug: {slug} | Language: {currentLanguage}
            </p>
            <Button asChild>
              <Link to="/recipes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Recipes
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const translation = recipe.translation!;
  const info = recipe.info;

  return (
    <Layout>
      <Helmet>
        <title>{translation.seo_title || `${translation.title} | e-Nutritionist`}</title>
        <meta name="description" content={translation.seo_description || translation.short_description} />
        <meta name="keywords" content={translation.seo_keywords || ''} />
        
        {/* Open Graph */}
        <meta property="og:title" content={translation.seo_title || translation.title} />
        <meta property="og:description" content={translation.seo_description || translation.short_description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/recipes/${recipe.slug}`} />
        {recipe.image_url && <meta property="og:image" content={recipe.image_url} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={translation.seo_title || translation.title} />
        <meta name="twitter:description" content={translation.seo_description || translation.short_description} />
        {recipe.image_url && <meta name="twitter:image" content={recipe.image_url} />}
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${recipe.image_url || '/images/hero-nutritionist_20251211_133643.png'})`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
          <div className="text-white max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-white/80 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/recipes" className="hover:text-white transition-colors">Recipes</Link>
              <span>/</span>
              <span className="text-white">{translation.title}</span>
            </div>
            
            {/* Recipe Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-primary text-white border-0">
                {recipe.category}
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 capitalize">
                {difficultyLabels[info.difficulty as keyof typeof difficultyLabels]}
              </Badge>
              <div className="flex items-center text-white/90">
                <Clock className="h-4 w-4 mr-1" />
                {info.duration_minutes} min
              </div>
              <div className="flex items-center text-white/90">
                <Users className="h-4 w-4 mr-1" />
                {info.portions} portions
              </div>
            </div>
            
            {/* Title and Description */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 font-heading leading-tight">
              {translation.title}
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl">
              {translation.short_description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Back Button */}
            <div className="flex items-center">
              <Button variant="outline" size="sm" asChild>
                <Link to="/recipes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Recipes
                </Link>
              </Button>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  About This Recipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  {translation.full_description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">
                          <strong>{ingredient.quantity} {ingredient.unit}</strong> {ingredient.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ChefHat className="h-5 w-5 mr-2" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {instruction.step_number}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm leading-relaxed">{instruction.instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nutritional Facts */}
            {recipe.nutritional_facts && recipe.nutritional_facts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Nutritional Facts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recipe.nutritional_facts.map((fact, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {fact.quantity}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            {fact.unit}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {fact.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    * Nutritional values are approximate and may vary based on specific ingredients and preparation methods.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nutrition Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Nutrition Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Nutritious</h3>
                    <p className="text-sm text-muted-foreground">
                      Carefully balanced ingredients to provide essential nutrients for your health.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Goal-Oriented</h3>
                    <p className="text-sm text-muted-foreground">
                      Designed to support your specific health and fitness objectives.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <ChefHat className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Expert Crafted</h3>
                    <p className="text-sm text-muted-foreground">
                      Created by certified nutritionists with years of experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipe Info Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center">Recipe Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Prep Time:
                    </span>
                    <span className="font-medium">{info.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Servings:
                    </span>
                    <span className="font-medium">{info.portions} portions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <ChefHat className="h-4 w-4 mr-2" />
                      Difficulty:
                    </span>
                    <span className="font-medium capitalize">
                      {difficultyLabels[info.difficulty as keyof typeof difficultyLabels]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Category:
                    </span>
                    <span className="font-medium">{recipe.category}</span>
                  </div>
                </div>

                <Separator />

                <Button 
                  size="lg" 
                  className="w-full gradient-accent text-white btn-modern shadow-medium"
                  asChild
                >
                  <Link to="/contact">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Get Nutrition Advice
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  asChild
                >
                  <Link to="/services">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Related Recipes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">More Recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/recipes">View All Recipes</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to={`/recipes?category=${recipe.category}`}>
                      More {recipe.category} Recipes
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/services">Personalized Meal Plans</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetailPage;