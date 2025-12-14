import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, ArrowRight, CheckCircle, Users, Calendar } from 'lucide-react';

interface Service {
  id: string;
  slug: string;
  price: number;
  service_type: string;
  duration_minutes: number | null;
  is_active: boolean;
  service_translations_2025_12_11_16_00: {
    title: string;
    summary: string;
    description: string;
  }[];
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase
          .from('services_new_2025_12_11_16_00')
          .select(`
            *,
            service_translations_2025_12_11_16_00!inner(
              title,
              summary,
              description
            )
          `)
          .eq('is_active', true)
          .eq('service_translations_2025_12_11_16_00.language_code', currentLanguage)
          .order('price', { ascending: true });

        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Professional Nutrition Services
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Comprehensive nutrition consulting services tailored to your unique needs, 
            goals, and lifestyle. From athletic performance to weight management, 
            we have the expertise to help you succeed.
          </p>
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
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of professional nutrition services designed to help you achieve your health and performance goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              services.map((service) => (
                <Card key={service.id} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={service.image_url || '/images/hero-nutritionist_20251211_133643.png'} 
                      alt={service.service_translations_2025_12_11_16_00[0]?.title || 'Service'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-white text-lg px-3 py-1">
                        {service.price === 0 ? 'Free' : `€${service.price}`}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.service_translations_2025_12_11_16_00[0]?.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.service_translations_2025_12_11_16_00[0]?.summary}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      {service.duration_minutes && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration_minutes} minutes
                        </div>
                      )}
                      <div className="text-2xl font-bold text-primary">
                        {service.price === 0 ? 'Free' : `€${service.price}`}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button className="w-full gradient-accent text-white btn-modern shadow-medium" asChild>
                        <Link to={`/services/${service.slug}`}>
                          Learn More & Book
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-accent-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How We Work Together</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our proven process ensures you get the most effective and personalized nutrition guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold">Initial Consultation</h3>
              <p className="text-muted-foreground">
                Comprehensive assessment of your current health status, goals, lifestyle, and dietary preferences
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold">Custom Plan Creation</h3>
              <p className="text-muted-foreground">
                Development of a personalized nutrition plan tailored to your specific needs and objectives
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold">Implementation Support</h3>
              <p className="text-muted-foreground">
                Ongoing guidance and support to help you successfully implement your nutrition plan
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold">Progress Monitoring</h3>
              <p className="text-muted-foreground">
                Regular check-ins and plan adjustments to ensure optimal results and continued progress
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-2xl p-8 shadow-medium">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Consultation Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">In-Person Consultations</h4>
                      <p className="text-muted-foreground text-sm">
                        Face-to-face meetings at our professional clinic for comprehensive assessments
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Virtual Consultations</h4>
                      <p className="text-muted-foreground text-sm">
                        Online video consultations for convenience and accessibility from anywhere
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Hybrid Approach</h4>
                      <p className="text-muted-foreground text-sm">
                        Combination of in-person and virtual sessions based on your needs and preferences
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/images/contact-consultation_20251211_133649.png" 
                  alt="Consultation Methods" 
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Start Your Nutrition Journey?
            </h2>
            <p className="text-xl text-white/90">
              Take the first step towards better health and performance. 
              Book your free consultation today and discover how personalized nutrition can transform your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 transition-colors"
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
                className="border-white text-white hover:bg-white hover:text-primary transition-colors"
                asChild
              >
                <Link to="/about">Learn About Our Approach</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;