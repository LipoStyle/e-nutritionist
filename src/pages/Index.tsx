import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSlider from '@/components/HeroSlider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Star, Clock, Users, CheckCircle, Utensils, BookOpen, Calendar } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  short_description: string;
  price: number;
  duration_minutes: number;
  image_url: string;
}

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  slug: string;
  created_at: string;
  tags: string[];
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  difficulty_level: string;
  image_url: string;
}

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const { data: servicesData } = await supabase
          .from('services_2025_12_11_13_27')
          .select('*')
          .eq('is_active', true)
          .limit(3);

        // Fetch blogs
        const { data: blogsData } = await supabase
          .from('blogs_2025_12_11_13_27')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        // Fetch recipes
        const { data: recipesData } = await supabase
          .from('recipes_2025_12_11_13_27')
          .select('*')
          .eq('is_published', true)
          .limit(3);

        setServices(servicesData || []);
        setBlogs(blogsData || []);
        setRecipes(recipesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Services Preview Section */}
      <section id="services-section" className="py-20 bg-accent-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Professional Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive nutrition consulting tailored to your unique needs and goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              services.map((service) => (
                <Card key={service.id} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={service.image_url} 
                      alt={service.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-white">
                        ${service.price}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.short_description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration_minutes} min
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/services/${service.id}`}>
                          Learn More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center">
            <Button size="lg" className="gradient-accent text-white btn-modern shadow-medium" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Banner Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Meet Your Certified 
                <span className="text-primary">Sports Nutritionist</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With over 10 years of experience in sports nutrition and athletic performance, 
                I specialize in helping athletes and active individuals optimize their nutrition 
                for peak performance and long-term health.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Athletes Coached</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Certified Sports Nutritionist (CISSN)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Registered Dietitian Nutritionist (RDN)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Master's in Sports Nutrition</span>
                </div>
              </div>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  Learn More About Me
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="/images/about-nutritionist_20251211_133645.png" 
                alt="About Nutritionist" 
                className="rounded-2xl shadow-medium w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 bg-accent-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Latest Nutrition <span className="text-primary">Insights</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest research, tips, and strategies for optimal nutrition and performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              blogs.map((blog) => (
                <Card key={blog.id} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={blog.image_url} 
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/blogs/${blog.slug}`}>
                          Read More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/blogs">
                <BookOpen className="mr-2 h-5 w-5" />
                View All Articles
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recipe Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Healthy <span className="text-primary">Recipe Collection</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Delicious, nutritious recipes designed for optimal performance and health
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              recipes.map((recipe) => (
                <Card key={recipe.id} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={recipe.image_url} 
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={`${
                        recipe.difficulty_level === 'easy' ? 'bg-green-500' :
                        recipe.difficulty_level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {recipe.difficulty_level}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {recipe.difficulty_level}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/recipes/${recipe.id}`}>
                        View Recipe
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/recipes">
                <Utensils className="mr-2 h-5 w-5" />
                View All Recipes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Banner Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Transform Your Nutrition?
            </h2>
            <p className="text-xl text-white/90">
              Book your free consultation today and take the first step towards optimal health and performance. 
              Let's create a personalized nutrition plan that works for your lifestyle and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 btn-modern shadow-medium"
                asChild
              >
                <Link to="/contact">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Free Consultation
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary btn-modern"
                asChild
              >
                <Link to="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
