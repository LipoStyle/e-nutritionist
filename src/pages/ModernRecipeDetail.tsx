import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  ChefHat,
  Star,
  Heart,
  Share2,
  Printer,
  BookOpen,
  Utensils
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ModernRecipeDetail = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log('Fetching recipe:', slug);
        
        // Get recipe
        const { data: recipeData } = await supabase
          .from('recipes_2025_12_12_18_15')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!recipeData) {
          setLoading(false);
          return;
        }

        // Get translation
        const { data: translation } = await supabase
          .from('recipe_translations_2025_12_12_18_15')
          .select('*')
          .eq('recipe_id', recipeData.id)
          .eq('language_code', currentLanguage)
          .single();

        // Get info
        const { data: info } = await supabase
          .from('recipe_info_2025_12_12_18_15')
          .select('*')
          .eq('recipe_id', recipeData.id)
          .single();

        // Get ingredients
        const { data: ingredients } = await supabase
          .from('recipe_ingredients_2025_12_12_18_15')
          .select('*')
          .eq('recipe_id', recipeData.id)
          .eq('language_code', currentLanguage)
          .order('order_index');

        // Get instructions
        const { data: instructions } = await supabase
          .from('recipe_instructions_2025_12_12_18_15')
          .select('*')
          .eq('recipe_id', recipeData.id)
          .eq('language_code', currentLanguage)
          .order('step_number');

        // Get nutrition
        const { data: nutrition } = await supabase
          .from('recipe_nutritional_facts_2025_12_12_19_00')
          .select('*')
          .eq('recipe_id', recipeData.id)
          .eq('language_code', currentLanguage)
          .order('order_index');

        setRecipe({
          ...recipeData,
          translation,
          info: info || { duration_minutes: 30, difficulty: 'medium', portions: 4 },
          ingredients: ingredients || [],
          instructions: instructions || [],
          nutrition: nutrition || []
        });

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchRecipe();
    }
  }, [slug, currentLanguage]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading delicious recipe...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!recipe || !recipe.translation) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Recipe Not Found</h1>
            <p className="text-gray-600 mb-6">Sorry, we couldn't find this recipe.</p>
            <Button asChild>
              <Link to="/recipes">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Recipes
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  return (
    <Layout>
      <Helmet>
        <title>{recipe.translation.title} | e-Nutritionist</title>
        <meta name="description" content={recipe.translation.short_description} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {recipe.image_url && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${recipe.image_url})` }}
          ></div>
        )}
        
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-white/70 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/recipes" className="hover:text-white transition-colors">Recipes</Link>
              <span>/</span>
              <span className="text-white">{recipe.translation.title}</span>
            </nav>

            {/* Category & Difficulty */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-primary text-white px-3 py-1">
                {recipe.category}
              </Badge>
              <Badge className={`px-3 py-1 capitalize ${difficultyColors[recipe.info.difficulty] || difficultyColors.medium}`}>
                {recipe.info.difficulty}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {recipe.translation.title}
            </h1>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl">
              {recipe.translation.short_description}
            </p>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{recipe.info.duration_minutes} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">{recipe.info.portions} servings</span>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                <span className="font-medium capitalize">{recipe.info.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column - Recipe Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Back Button */}
            <Button variant="outline" asChild className="mb-8">
              <Link to="/recipes">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Recipes
              </Link>
            </Button>

            {/* Recipe Image */}
            {recipe.image_url && (
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={recipe.image_url} 
                  alt={recipe.translation.title}
                  className="w-full h-80 lg:h-96 object-cover"
                />
              </div>
            )}

            {/* Description */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">About This Recipe</h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {recipe.translation.full_description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Utensils className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Ingredients</h2>
                    <Badge variant="secondary" className="ml-auto">
                      {recipe.ingredients.length} items
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <span className="font-semibold text-primary">
                            {ingredient.quantity} {ingredient.unit}
                          </span>
                          <span className="ml-2 text-gray-700">
                            {ingredient.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <ChefHat className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Instructions</h2>
                    <Badge variant="secondary" className="ml-auto">
                      {recipe.instructions.length} steps
                    </Badge>
                  </div>
                  <div className="space-y-6">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                          {instruction.step_number}
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {instruction.instruction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nutrition Facts */}
            {recipe.nutrition && recipe.nutrition.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Nutrition Facts</h2>
                    <span className="text-sm text-gray-500 ml-auto">Per serving</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recipe.nutrition.map((fact, index) => (
                      <div 
                        key={index} 
                        className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="text-3xl font-bold text-primary mb-2">
                          {fact.quantity}
                          <span className="text-lg text-gray-500 ml-1">
                            {fact.unit}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {fact.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-6">
                    * Nutritional values are approximate and may vary based on ingredients and preparation methods.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            
            {/* Recipe Summary Card */}
            <Card className="border-0 shadow-lg sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 text-center">Recipe Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Prep Time</span>
                    </div>
                    <span className="font-semibold">{recipe.info.duration_minutes} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Servings</span>
                    </div>
                    <span className="font-semibold">{recipe.info.portions}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <ChefHat className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Difficulty</span>
                    </div>
                    <Badge className={`capitalize ${difficultyColors[recipe.info.difficulty] || difficultyColors.medium}`}>
                      {recipe.info.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Utensils className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Category</span>
                    </div>
                    <span className="font-semibold">{recipe.category}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg" asChild>
                    <Link to="/contact">
                      <Heart className="w-4 h-4 mr-2" />
                      Get Nutrition Advice
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/services">
                      Book Consultation
                    </Link>
                  </Button>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Recipes */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">More Recipes</h3>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/recipes">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse All Recipes
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to={`/recipes?category=${recipe.category}`}>
                      <Utensils className="w-4 h-4 mr-2" />
                      More {recipe.category}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/services">
                      <Star className="w-4 h-4 mr-2" />
                      Custom Meal Plans
                    </Link>
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

export default ModernRecipeDetail;