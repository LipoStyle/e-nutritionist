import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Clock, CheckCircle, Calendar, MessageSquare } from 'lucide-react';

interface ServiceDetail {
  id: string;
  slug: string;
  price: number;
  service_type: string;
  duration_minutes: number | null;
  is_active: boolean;
  image_url?: string;
  translation?: {
    title: string;
    summary: string;
    description: string;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
  };
  features?: string[];
}

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { currentLanguage } = useLanguage();

  console.log('ServiceDetailPage - slug:', slug, 'currentLanguage:', currentLanguage);

  const serviceTypeLabels = {
    'free_pdf': 'Free PDF Book',
    'paid_pdf': 'Paid PDF Book',
    'free_consultation': 'Free Consultation',
    'paid_consultation': 'Paid Consultation'
  };

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) {
        console.log('No slug provided');
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching service with slug:', slug, 'language:', currentLanguage);
        
        // Fetch service with translations
        const { data: serviceData, error: serviceError } = await supabase
          .from('services_new_2025_12_11_16_00')
          .select(`
            *,
            service_translations_2025_12_11_16_00!inner(
              title,
              summary,
              description,
              seo_title,
              seo_description,
              seo_keywords
            )
          `)
          .eq('slug', slug)
          .eq('is_active', true)
          .eq('service_translations_2025_12_11_16_00.language_code', currentLanguage)
          .single();

        console.log('Service query result:', { serviceData, serviceError });

        if (serviceError) {
          console.error('Service error:', serviceError);
          if (serviceError.code === 'PGRST116') {
            console.log('Service not found');
            setNotFound(true);
            return;
          }
          throw serviceError;
        }

        // Fetch features
        const { data: featuresData } = await supabase
          .from('service_features_2025_12_11_16_00')
          .select('feature_text')
          .eq('service_id', serviceData.id)
          .eq('language_code', currentLanguage)
          .order('order_index');

        console.log('Features data:', featuresData);

        const serviceWithFeatures: ServiceDetail = {
          ...serviceData,
          translation: serviceData.service_translations_2025_12_11_16_00[0] || null,
          features: featuresData?.map(f => f.feature_text) || []
        };

        console.log('Final service data:', serviceWithFeatures);
        setService(serviceWithFeatures);
      } catch (error) {
        console.error('Error fetching service:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
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

  if (notFound || !service) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The service you're looking for doesn't exist or is no longer available.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Slug: {slug} | Language: {currentLanguage}
            </p>
            <Button asChild>
              <Link to="/services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const translation = service.translation!;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <span>/</span>
          <span className="text-foreground">{translation.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/services">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Services
                  </Link>
                </Button>
                <Badge variant="outline">
                  {serviceTypeLabels[service.service_type as keyof typeof serviceTypeLabels]}
                </Badge>
              </div>

              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-heading">
                  {translation.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {translation.summary}
                </p>
              </div>

              {/* Service Image */}
              {service.image_url && (
                <div className="rounded-2xl overflow-hidden shadow-medium">
                  <img 
                    src={service.image_url} 
                    alt={translation.title}
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  {translation.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center">
                  {service.price === 0 ? 'Free Service' : `€${service.price}`}
                </CardTitle>
                {service.duration_minutes && (
                  <CardDescription className="text-center flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration_minutes} minutes
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full gradient-accent text-white btn-modern shadow-medium"
                  asChild
                >
                  <Link to="/contact">
                    <Calendar className="h-4 w-4 mr-2" />
                    {service.price === 0 ? 'Get Free Access' : 'Book Now'}
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  asChild
                >
                  <Link to="/contact">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask Questions
                  </Link>
                </Button>

                <div className="space-y-3 text-sm pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Service Type:</span>
                    <span className="font-medium">
                      {serviceTypeLabels[service.service_type as keyof typeof serviceTypeLabels]}
                    </span>
                  </div>
                  {service.duration_minutes && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{service.duration_minutes} min</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium text-lg">
                      {service.price === 0 ? 'Free' : `€${service.price}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetailPage;