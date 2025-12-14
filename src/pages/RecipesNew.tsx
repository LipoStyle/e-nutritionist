import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, Users, ChefHat, Search, Filter } from 'lucide-react';

interface Recipe {
  id: string;
  slug: string;
  category: string;
  image_url?: string;
  published_date: string;
  is_published: boolean;
  recipe_translations_2025_12_12_18_15: {
    title: string;
    short_description: string;
    full_description: string;
  }[];
  recipe_info_2025_12_12_18_15: {
    duration_minutes: number;
    difficulty: string;
    portions: number;
  }[];
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const { currentLanguage } = useLanguage();

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log('Fetching recipes for language:', currentLanguage);
        const { data, error } = await supabase
          .from('recipes_2025_12_12_18_15')
          .select(`
            *,
            recipe_translations_2025_12_12_18_15!inner(
              title,
              short_description,
              full_description
            ),
            recipe_info_2025_12_12_18_15(
              duration_minutes,
              difficulty,
              portions
            )
          `)
          .eq('is_published', true)
          .eq('recipe_translations_2025_12_12_18_15.language_code', currentLanguage)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching recipes:', error);
          throw error;
        }

        console.log('Fetched recipes:', data);
        setRecipes(data || []);
        setFilteredRecipes(data || []);
        
        // Extract unique categories
        const categories = new Set<string>();
        data?.forEach(recipe => {
          categories.add(recipe.category);
        });
        setAllCategories(Array.from(categories));
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [currentLanguage]);

  // Filter recipes based on search and filters
  useEffect(() => {
    let filtered = recipes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.recipe_translations_2025_12_12_18_15[0]?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.recipe_translations_2025_12_12_18_15[0]?.short_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(recipe => 
        recipe.recipe_info_2025_12_12_18_15[0]?.difficulty === selectedDifficulty
      );
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-heading">
            Healthy Recipes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover delicious and nutritious recipes crafted by our expert nutritionists. 
            From quick meals to gourmet dishes, find the perfect recipe for your healthy lifestyle.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select value={selectedDifficulty || "all"} onValueChange={(value) => setSelectedDifficulty(value === "all" ? "" : value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map(diff => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory || selectedDifficulty) && (
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredRecipes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ChefHat className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedCategory || selectedDifficulty
                  ? 'Try adjusting your filters to find more recipes.'
                  : 'No recipes are available at the moment.'}
              </p>
              {(searchTerm || selectedCategory || selectedDifficulty) && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            filteredRecipes.map((recipe) => {
              const translation = recipe.recipe_translations_2025_12_12_18_15[0];
              const info = recipe.recipe_info_2025_12_12_18_15[0];
              
              return (
                <Card key={recipe.id} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={recipe.image_url || '/images/hero-nutritionist_20251211_133643.png'} 
                      alt={translation?.title || 'Recipe'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white">
                        {recipe.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90 text-gray-800 capitalize">
                        {info?.difficulty || 'Medium'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{translation?.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{translation?.short_description}</p>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {info?.duration_minutes || 30} min
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {info?.portions || 4} portions
                      </div>
                    </div>
                    
                    <Button className="w-full gradient-accent text-white btn-modern shadow-medium" asChild>
                      <Link to={`/recipes/${recipe.slug}`}>
                        View Recipe
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Call to Action */}
        {!loading && filteredRecipes.length > 0 && (
          <div className="text-center mt-16 py-12 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Need Personalized Nutrition Advice?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our expert nutritionists can help you create a personalized meal plan that fits your lifestyle, 
              dietary preferences, and health goals.
            </p>
            <Button size="lg" className="gradient-accent text-white" asChild>
              <Link to="/services">
                Book a Consultation
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Recipes;