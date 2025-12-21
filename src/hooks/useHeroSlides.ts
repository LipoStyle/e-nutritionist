import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Slide {
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

// Hook encapsulates slide fetching, localization, and autoplay/navigation logic.
export const useHeroSlides = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currentLanguage } = useLanguage();

  const getDefaultSlides = (): Slide[] => [
    {
      id: "default-1",
      order_index: 0,
      background_image_url: "/images/hero-slide-1_20251211_141900.png",
      layer_opacity: 0.8,
      layer_type: "gradient_2",
      layer_direction: "horizontal",
      layer_color_1: "#075056",
      layer_color_2: "#ff5b04",
      layer_color_3: null,
      is_active: true,
      translation: {
        h1_title: "Transform Your Health with Expert Nutrition",
        paragraph:
          "Specialized in athletic nutrition, weight management, and performance optimization. Get personalized meal plans and professional guidance to achieve your health goals.",
        primary_button_text: "Book Free Consultation",
        primary_button_url: "/contact",
        secondary_button_text: "View Services",
        secondary_button_url: "/services",
      },
    },
    {
      id: "default-2",
      order_index: 1,
      background_image_url: "/images/hero-slide-2_20251211_141857.png",
      layer_opacity: 0.8,
      layer_type: "gradient_2",
      layer_direction: "horizontal",
      layer_color_1: "#075056",
      layer_color_2: "#ff5b04",
      layer_color_3: null,
      is_active: true,
      translation: {
        h1_title: "Maximize Your Athletic Performance",
        paragraph:
          "Advanced nutrition strategies for competitive athletes. Optimize your fueling, recovery, and performance with evidence-based nutrition protocols tailored to your sport.",
        primary_button_text: "Sports Nutrition Plans",
        primary_button_url: "/services",
        secondary_button_text: "Read Success Stories",
        secondary_button_url: "/blogs",
      },
    },
    {
      id: "default-3",
      order_index: 2,
      background_image_url: "/images/hero-slide-3_20251211_141900.png",
      layer_opacity: 0.8,
      layer_type: "gradient_2",
      layer_direction: "horizontal",
      layer_color_1: "#075056",
      layer_color_2: "#ff5b04",
      layer_color_3: null,
      is_active: true,
      translation: {
        h1_title: "Achieve Your Weight Goals",
        paragraph:
          "Sustainable weight management programs that work. Whether you're looking to lose weight, gain muscle, or maintain your ideal body composition, we have the expertise to help.",
        primary_button_text: "Start Your Journey",
        primary_button_url: "/contact",
        secondary_button_text: "Learn Our Approach",
        secondary_button_url: "/about",
      },
    },
  ];

  const fetchSlides = async () => {
    try {
      setLoading(true);

      const { data: slidesData, error } = await supabase
        .from("hero_slides_2025_12_11_15_30")
        .select(
          `
          *,
          slide_translations_2025_12_11_15_30!inner(
            h1_title,
            paragraph,
            primary_button_text,
            primary_button_url,
            secondary_button_text,
            secondary_button_url
          )
        `
        )
        .eq("is_active", true)
        .eq(
          "slide_translations_2025_12_11_15_30.language_code",
          currentLanguage
        )
        .order("order_index");

      if (error) {
        throw error;
      }

      const transformedSlides: Slide[] = (slidesData || []).map((slide) => ({
        ...slide,
        translation: slide.slide_translations_2025_12_11_15_30[0] || null,
      }));

      setSlides(transformedSlides);
    } catch (err) {
      console.error("Error fetching slides:", err);
      setSlides(getDefaultSlides());
    } finally {
      setLoading(false);
    }
  };

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

  return {
    slides,
    loading,
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
  };
};
