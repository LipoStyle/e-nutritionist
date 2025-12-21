import { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { useHeroSlides, type Slide } from "@/hooks/useHeroSlides";

const getSafeUrl = (url?: string | null) => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return null;
};

const HeroSlider = () => {
  // Hook supplies slides, loading state, and autoplay navigation logic.
  const { slides, loading, currentSlide, nextSlide, prevSlide, goToSlide } =
    useHeroSlides();

  const handleKeyNavigation = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    if (event.key === "ArrowRight") {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  const scrollToContent = () => {
    const nextSection = document.querySelector("#services-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Component remains responsible for rendering and computing visual overlays.
  const generateGradientCSS = (slide: Slide) => {
    const {
      layer_type,
      layer_direction,
      layer_color_1,
      layer_color_2,
      layer_color_3,
      layer_opacity,
    } = slide;

    let gradient = "";
    if (layer_type === "single") {
      gradient = layer_color_1;
    } else if (layer_type === "gradient_2") {
      const direction =
        layer_direction === "radial"
          ? "radial-gradient(circle,"
          : layer_direction === "vertical"
          ? "linear-gradient(to bottom,"
          : "linear-gradient(to right,";
      gradient = `${direction} ${layer_color_1}, ${layer_color_2})`;
    } else if (layer_type === "gradient_3") {
      const direction =
        layer_direction === "radial"
          ? "radial-gradient(circle,"
          : layer_direction === "vertical"
          ? "linear-gradient(to bottom,"
          : "linear-gradient(to right,";
      gradient = `${direction} ${layer_color_1}, ${layer_color_2}, ${layer_color_3})`;
    }

    return {
      background: gradient,
      opacity: layer_opacity,
    };
  };

  if (loading) {
    return (
      <section
        className="h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary"
        role="status"
        aria-live="polite"
      >
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading slides...</p>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section
        className="h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary"
        role="region"
        aria-label="Hero introduction"
      >
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to e-Nutritionist</h1>
          <p className="text-xl mb-8">
            Professional nutrition consulting services
          </p>
          <Button className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/contact">Get Started</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-screen overflow-hidden"
      role="region"
      aria-label="Featured highlights carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyNavigation}
    >
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : index < currentSlide
                  ? "opacity-0 -translate-x-full pointer-events-none"
                  : "opacity-0 translate-x-full pointer-events-none"
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: slide.background_image_url
                    ? `url(${slide.background_image_url})`
                    : "none",
                }}
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
                    <div
                      className="text-white space-y-6 animate-fade-in"
                      aria-hidden={!isActive}
                    >
                      <h1 className="text-5xl lg:text-7xl font-bold leading-tight font-heading">
                        {slide.translation?.h1_title ||
                          "Welcome to e-Nutritionist"}
                      </h1>

                      <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl font-body">
                        {slide.translation?.paragraph ||
                          "Professional nutrition consulting services"}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        {(() => {
                          const configuredPrimaryUrl =
                            slide.translation?.primary_button_url?.trim() || "";
                          const fallbackPrimaryUrl = "/contact";
                          const primaryText =
                            slide.translation?.primary_button_text ||
                            "Get Started";

                          const renderPrimaryLink = () => {
                            if (configuredPrimaryUrl.startsWith("http://") || configuredPrimaryUrl.startsWith("https://")) {
                              return (
                                <a
                                  href={configuredPrimaryUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  tabIndex={isActive ? 0 : -1}
                                >
                                  {primaryText}
                                </a>
                              );
                            }

                            const internalUrl =
                              getSafeUrl(configuredPrimaryUrl) ||
                              fallbackPrimaryUrl;

                            return (
                              <Link to={internalUrl} tabIndex={isActive ? 0 : -1}>
                                {primaryText}
                              </Link>
                            );
                          };

                          return (
                            <Button
                              size="lg"
                              className="bg-white text-primary hover:bg-white/90 btn-modern shadow-medium text-lg px-8 py-4"
                              asChild
                            >
                              {renderPrimaryLink()}
                            </Button>
                          );
                        })()}
                        {(() => {
                          const secondaryUrl =
                            getSafeUrl(slide.translation?.secondary_button_url) ||
                            "/services";
                          const secondaryText =
                            slide.translation?.secondary_button_text ||
                            "Learn More";
                          return (
                            <Button
                              size="lg"
                              variant="outline"
                              className="border-white text-white hover:bg-white hover:text-primary btn-modern text-lg px-8 py-4"
                              asChild
                            >
                              <Link
                                to={secondaryUrl}
                                tabIndex={isActive ? 0 : -1}
                              >
                                {secondaryText}
                              </Link>
                            </Button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? "true" : undefined}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div
              className="h-full bg-secondary transition-all duration-300 ease-out"
              style={{
                width: `${((currentSlide + 1) / slides.length) * 100}%`,
              }}
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
