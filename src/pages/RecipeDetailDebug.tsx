import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';

const RecipeDetailDebug = () => {
  const { slug } = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log('=== DEBUG RECIPE FETCH ===');
        console.log('Slug:', slug);
        console.log('Language:', currentLanguage);
        console.log('URL:', window.location.href);

        if (!slug) {
          setError('No slug provided');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        // Simple query first
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes_2025_12_12_18_15')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        console.log('Recipe data:', recipeData);
        console.log('Recipe error:', recipeError);

        if (recipeError) {
          console.error('Recipe query error:', recipeError);
          setError(`Recipe query failed: ${recipeError.message}`);
          setLoading(false);
          return;
        }

        if (!recipeData) {
          setError('Recipe not found');
          setLoading(false);
          return;
        }

        // Get translation
        const { data: translationData, error: translationError } = await supabase
          .from('recipe_translations_2025_12_12_18_15')
          .select('*')
          .eq('recipe_id', recipeData.id)
          .eq('language_code', currentLanguage)
          .single();

        console.log('Translation data:', translationData);
        console.log('Translation error:', translationError);

        if (translationError) {
          console.error('Translation query error:', translationError);
          setError(`Translation query failed: ${translationError.message}`);
          setLoading(false);
          return;
        }

        // Get recipe info
        const { data: infoData, error: infoError } = await supabase
          .from('recipe_info_2025_12_12_18_15')
          .select('*')
          .eq('recipe_id', recipeData.id)
          .single();

        console.log('Info data:', infoData);
        console.log('Info error:', infoError);

        const finalRecipe = {
          ...recipeData,
          translation: translationData,
          info: infoData || { duration_minutes: 30, difficulty: 'medium', portions: 4 }
        };

        console.log('Final recipe:', finalRecipe);
        setRecipe(finalRecipe);
        setLoading(false);

      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [slug, currentLanguage]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading recipe...</p>
            <p className="text-sm text-muted-foreground">Slug: {slug}</p>
            <p className="text-sm text-muted-foreground">Language: {currentLanguage}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Recipe</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground mb-4">Slug: {slug}</p>
            <p className="text-sm text-muted-foreground mb-6">Language: {currentLanguage}</p>
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

  if (!recipe || !recipe.translation) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The recipe you're looking for doesn't exist or is not available in the selected language.
            </p>
            <p className="text-sm text-muted-foreground mb-4">Slug: {slug}</p>
            <p className="text-sm text-muted-foreground mb-6">Language: {currentLanguage}</p>
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

  const translation = recipe.translation;
  const info = recipe.info;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Debug Info */}
        <div className="bg-gray-100 p-4 rounded mb-6 text-sm">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p>Slug: {slug}</p>
          <p>Language: {currentLanguage}</p>
          <p>Recipe ID: {recipe.id}</p>
          <p>Has Translation: {translation ? 'Yes' : 'No'}</p>
          <p>Has Info: {info ? 'Yes' : 'No'}</p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/recipes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Link>
          </Button>
        </div>

        {/* Recipe Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{translation.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">{translation.short_description}</p>
            
            {recipe.image_url && (
              <img 
                src={recipe.image_url} 
                alt={translation.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="font-semibold">Duration</div>
              <div>{info?.duration_minutes || 30} minutes</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Difficulty</div>
              <div className="capitalize">{info?.difficulty || 'medium'}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Servings</div>
              <div>{info?.portions || 4} portions</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <div className="prose max-w-none">
              {translation.full_description.split('\\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Raw Data for Debugging */}
          <details className="bg-gray-100 p-4 rounded">
            <summary className="font-bold cursor-pointer">Raw Recipe Data (Debug)</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(recipe, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetailDebug;