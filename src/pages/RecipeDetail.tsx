import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Clock, Users, ChefHat, Share2, BookOpen, CheckCircle } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  difficulty_level: string;
  image_url: string;
  nutrition_info: any;
  tags: string[];
}

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);
  const [checkedInstructions, setCheckedInstructions] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      try {
        const { data } = await supabase
          .from('recipes_2025_12_11_13_27')
          .select('*')
          .eq('id', id)
          .eq('is_published', true)
          .single();

        setRecipe(data);
        if (data) {
          setCheckedIngredients(new Array(data.ingredients.length).fill(false));
          setCheckedInstructions(new Array(data.instructions.length).fill(false));
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.title,
          text: recipe?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleIngredient = (index: number) => {
    const newChecked = [...checkedIngredients];
    newChecked[index] = !newChecked[index];
    setCheckedIngredients(newChecked);
  };

  const toggleInstruction = (index: number) => {
    const newChecked = [...checkedInstructions];
    newChecked[index] = !newChecked[index];
    setCheckedInstructions(newChecked);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!recipe) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
          <p className="text-muted-foreground mb-8">The recipe you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/recipes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recipes
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-accent-light/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/recipes" className="text-muted-foreground hover:text-primary">Recipes</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{recipe.title}</span>
          </nav>
        </div>
      </div>

      {/* Recipe Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button variant="outline" size="sm" className="mb-8" asChild>
              <Link to="/recipes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Recipes
              </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recipe Header */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                    {recipe.title}
                  </h1>
                  
                  <p className="text-xl text-muted-foreground mb-6">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {recipe.prep_time_minutes + recipe.cook_time_minutes} min total
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-medium">{recipe.servings} servings</span>
                      </div>
                      <Badge className={`${getDifficultyColor(recipe.difficulty_level)} text-white`}>
                        {recipe.difficulty_level}
                      </Badge>
                    </div>
                    
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Recipe
                    </Button>
                  </div>
                </div>

                {/* Recipe Image */}
                <div className="relative">
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title}
                    className="w-full h-auto rounded-2xl shadow-medium"
                  />
                </div>

                {/* Time Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{recipe.prep_time_minutes}</div>
                        <div className="text-sm text-muted-foreground">Prep Time (min)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{recipe.cook_time_minutes}</div>
                        <div className="text-sm text-muted-foreground">Cook Time (min)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {recipe.prep_time_minutes + recipe.cook_time_minutes}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Time (min)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ingredients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ChefHat className="mr-2 h-5 w-5" />
                      Ingredients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <div 
                          key={index}
                          className="flex items-center space-x-3 cursor-pointer hover:bg-accent-light/30 p-2 rounded transition-colors"
                          onClick={() => toggleIngredient(index)}
                        >
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                            checkedIngredients[index] 
                              ? 'bg-primary border-primary' 
                              : 'border-muted-foreground'
                          }`}>
                            {checkedIngredients[index] && (
                              <CheckCircle className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span className={`${
                            checkedIngredients[index] 
                              ? 'line-through text-muted-foreground' 
                              : 'text-foreground'
                          }`}>
                            {ingredient}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex space-x-4">
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-colors ${
                              checkedInstructions[index]
                                ? 'bg-primary text-white'
                                : 'bg-accent text-accent-foreground'
                            }`}
                            onClick={() => toggleInstruction(index)}
                          >
                            {index + 1}
                          </div>
                          <p 
                            className={`flex-1 leading-relaxed cursor-pointer transition-colors ${
                              checkedInstructions[index]
                                ? 'line-through text-muted-foreground'
                                : 'text-foreground'
                            }`}
                            onClick={() => toggleInstruction(index)}
                          >
                            {instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Nutrition Info */}
                {recipe.nutrition_info && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Nutrition Facts</CardTitle>
                      <p className="text-sm text-muted-foreground">Per serving</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(recipe.nutrition_info).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace('_', ' ')}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recipe Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pro Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p>• Prep ingredients in advance for quicker cooking</p>
                      <p>• Store leftovers in the refrigerator for up to 3 days</p>
                      <p>• Double the recipe for meal prep portions</p>
                      <p>• Adjust seasonings to taste preferences</p>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-primary text-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Need More Personalized Recipes?
                    </h3>
                    <p className="text-sm text-white/90 mb-4">
                      Get custom meal plans and recipes tailored to your dietary needs and goals.
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full bg-white text-primary hover:bg-white/90"
                      asChild
                    >
                      <Link to="/services">
                        View Nutrition Services
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Recipes CTA */}
      <section className="py-20 bg-accent-light/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              Explore More Healthy Recipes
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover more nutritious and delicious recipes designed for optimal health and performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/recipes">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse All Recipes
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  Get Custom Meal Plans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RecipeDetail;