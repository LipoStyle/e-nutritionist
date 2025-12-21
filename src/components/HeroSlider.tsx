import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Slide {
  id: string;
  order_index: number;
  background_image_url: string | null;
  layer_opacity: number;
  layer_type: string;
  layer_direction: string;
  layer_color_1: string;
  layer_color_2: string | null;
  layer_color_3: string | null;
  is_active: boolean;
  translation?: {
    h1_title: string;
    paragraph: string;
    primary_button_text: string;
    primary_button_url: string;
    secondary_button_text: string;
    secondary_button_url: string;
  };
}

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currentLanguage } = useLanguage();

  // Fetch slides from database
  const fetchSlides = async () => {
    try {
      setLoading(true);
      
      // Fetch active slides with translations
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides_2025_12_11_15_30')
        .select(`
          *,
          slide_translations_2025_12_11_15_30!inner(
            h1_title,
            paragraph,
            primary_button_text,
            primary_button_url,
            secondary_button_text,
            secondary_button_url
          )
        `)
        .eq('is_active', true)
        .eq('slide_translations_2025_12_11_15_30.language_code', currentLanguage)
        .order('order_index');

      if (slidesError) throw slidesError;

      // Transform data to match our interface
      const transformedSlides: Slide[] = (slidesData || []).map(slide => ({
        ...slide,
        translation: slide.slide_translations_2025_12_11_15_30[0] || null
      }));

      setSlides(transformedSlides);
    } catch (error) {
      console.error('Error fetching slides:', error);
      // Fallback to default slides if database fetch fails
      setSlides(getDefaultSlides());
    } finally {
      setLoading(false);
    }
  };

  // Default slides as fallback
  const getDefaultSlides = (): Slide[] => [
    {
      id: 'default-1',
      order_index: 0,
      background_image_url: '/images/hero-slide-1_20251211_141900.png',
      layer_opacity: 0.8,
      layer_type: 'gradient_2',
      layer_direction: 'horizontal',
      layer_color_1: '#075056',
      layer_color_2: '#ff5b04',
      layer_color_3: null,
      is_active: true,
      translation: {
        h1_title: 'Transform Your Health with Expert Nutrition',
        paragraph: 'Specialized in athletic nutrition, weight management, and performance optimization. Get personalized meal plans and professional guidance to achieve your health goals.',
        primary_button_text: 'Book Free Consultation',
        primary_button_url: '/contact',
        secondary_button_text: 'View Services',
        secondary_button_url: '/services'
      }
    },
    {
      id: 'default-2',
      order_index: 1,
      background_image_url: '/images/hero-slide-2_20251211_141857.png',
      layer_opacity: 0.8,
      layer_type: 'gradient_2',
      layer_direction: 'horizontal',
      layer_color_1: '#075056',
      layer_color_2: '#ff5b04',
      layer_color_3: null,
      is_active: true,
      translation: {
        h1_title: 'Maximize Your Athletic Performance',
        paragraph: 'Advanced nutrition strategies for competitive athletes. Optimize your fueling, recovery, and performance with evidence-based nutrition protocols tailored to your sport.',
        primary_button_text: 'Sports Nutrition Plans',
        primary_button_url: '/services',
        secondary_button_text: 'Read Success Stories',
        secondary_button_url: '/blogs'
      }
    },
    {
      id: 'default-3',
      order_index: 2,
      background_image_url: '/images/hero-slide-3_20251211_141900.png',
      layer_opacity: 0.8,
      layer_type: 'gradient_2',
      layer_direction: 'horizontal',
      layer_color_1: '#075056',
      layer_color_2: '#ff5b04',
      layer_color_3: null,
      is_active: true,
      translation: {
        h1_title: 'Achieve Your Weight Goals',
        paragraph: 'Sustainable weight management programs that work. Whether you\'re looking to lose weight, gain muscle, or maintain your ideal body composition, we have the expertise to help.',
        primary_button_text: 'Start Your Journey',
        primary_button_url: '/contact',
        secondary_button_text: 'Learn Our Approach',
        secondary_button_url: '/about'
      }
    }
  ];

  // Load slides when component mounts or language changes
  useEffect(() => {
    fetchSlides();
  }, [currentLanguage]);

  useEffect(() => {
    if (slides.length === 0) {
      setCurrentSlide(0);
      return;
    }
    setCurrentSlide((prev) => Math.min(prev, slides.length - 1));
  }, [slides.length]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  const scheduleAutoplayResume = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
      resumeTimeoutRef.current = null;
    }, 8000);
  };

  const pauseAutoplayTemporarily = () => {
    if (slides.length <= 1) return;
    setIsAutoPlaying(false);
    scheduleAutoplayResume();
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    pauseAutoplayTemporarily();
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    pauseAutoplayTemporarily();
  };

  const goToSlide = (index: number) => {
    if (slides.length === 0) return;
    setCurrentSlide(Math.max(0, Math.min(index, slides.length - 1)));
    pauseAutoplayTemporarily();
  };

  const scrollToContent = () => {
    const nextSection = document.querySelector('#services-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate gradient CSS from slide data
  const generateGradientCSS = (slide: Slide) => {
    const { layer_type, layer_direction, layer_color_1, layer_color_2, layer_color_3, layer_opacity } = slide;
    
    let gradient = '';
    if (layer_type === 'single') {
      gradient = layer_color_1;
    } else if (layer_type === 'gradient_2') {
      const direction = layer_direction === 'radial' ? 'radial-gradient(circle,' : 
                      layer_direction === 'vertical' ? 'linear-gradient(to bottom,' : 'linear-gradient(to right,';
      gradient = `${direction} ${layer_color_1}, ${layer_color_2})`;
    } else if (layer_type === 'gradient_3') {
      const direction = layer_direction === 'radial' ? 'radial-gradient(circle,' : 
                      layer_direction === 'vertical' ? 'linear-gradient(to bottom,' : 'linear-gradient(to right,';
      gradient = `${direction} ${layer_color_1}, ${layer_color_2}, ${layer_color_3})`;
    }

    return {
      background: gradient,
      opacity: layer_opacity
    };
  };

  if (loading) {
    return (
      <section className="h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading slides...</p>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to e-Nutritionist</h1>
          <p className="text-xl mb-8">Professional nutrition consulting services</p>
          <Button className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/contact">Get Started</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: slide.background_image_url ? `url(${slide.background_image_url})` : 'none' }}
            >
              <div 
                className="absolute inset-0"
                style={generateGradientCSS(slide)}
              ></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                  <div className="text-white space-y-6 animate-fade-in">
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight font-heading">
                      {slide.translation?.h1_title || 'Welcome to e-Nutritionist'}
                    </h1>
                    
                    <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl font-body">
                      {slide.translation?.paragraph || 'Professional nutrition consulting services'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button 
                        size="lg" 
                        className="bg-white text-primary hover:bg-white/90 btn-modern shadow-medium text-lg px-8 py-4"
                        asChild
                      >
                        <Link to={slide.translation?.primary_button_url || '/contact'}>
                          {slide.translation?.primary_button_text || 'Get Started'}
                        </Link>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-primary btn-modern text-lg px-8 py-4"
                        asChild
                      >
                        <Link to={slide.translation?.secondary_button_url || '/services'}>
                          {slide.translation?.secondary_button_text || 'Learn More'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white group-hover:text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white group-hover:text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div 
              className="h-full bg-secondary transition-all duration-300 ease-out"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            ></div>
          </div>
        </>
      )}

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center space-y-2 text-white/80 hover:text-white transition-colors group"
          aria-label="Scroll to content"
        >
          <span className="text-sm font-medium font-body">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
          </div>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
