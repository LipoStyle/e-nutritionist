"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import "@/styles/home/hero-slider.css";

import type { Lang } from "@/lib/i18n/locale";
import { normalizeLang, buildLocaleHref } from "@/lib/i18n/locale";

export type HeroSlideModel = {
  id: string;
  order_index: number;
  is_active: boolean;

  background_image_url: string | null;

  layer_type: string | null; // single | gradient_2 | gradient_3
  layer_direction: string | null; // horizontal | vertical | radial
  layer_opacity: number | null;

  layer_color_1: string | null;
  layer_color_2: string | null;
  layer_color_3: string | null;

  content: {
    h1_title: string;
    paragraph: string;
    primary_button_text: string;
    primary_button_url: string;
    secondary_button_text: string;
    secondary_button_url: string;
  };
};

function isAbsoluteUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function normalizeBgUrl(url: string | null) {
  if (!url) return "/images/hero-slide-fallback.jpg";
  const trimmed = url.trim();
  if (!trimmed) return "/images/hero-slide-fallback.jpg";
  if (isAbsoluteUrl(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}

function generateOverlayStyle(slide: HeroSlideModel) {
  const type = (slide.layer_type ?? "gradient_2").toLowerCase();
  const dirRaw = (slide.layer_direction ?? "horizontal").toLowerCase();

  const opacity = Math.max(0, Math.min(1, Number(slide.layer_opacity ?? 0.75)));

  const c1 = slide.layer_color_1 ?? "#075056";
  const c2 = slide.layer_color_2 ?? "#ff5b04";
  const c3 = slide.layer_color_3 ?? null;

  if (type === "single") {
    return { background: c1, opacity };
  }

  const direction =
    dirRaw === "radial"
      ? "radial-gradient(circle,"
      : dirRaw === "vertical"
        ? "linear-gradient(to bottom,"
        : "linear-gradient(to right,";

  if (type === "gradient_3" && c3) {
    return { background: `${direction} ${c1}, ${c2}, ${c3})`, opacity };
  }

  // default gradient_2
  return { background: `${direction} ${c1}, ${c2})`, opacity };
}

function getSafeInternalUrl(url: string) {
  const u = (url ?? "").trim();
  if (!u) return null;
  if (u.startsWith("/")) return u;
  return null;
}

export default function HomeHeroSlider({
  slides,
}: {
  slides: HeroSlideModel[];
}) {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang) as Lang;

  const stageRef = useRef<HTMLElement | null>(null);

  const activeSlides = useMemo(
    () =>
      (slides ?? [])
        .filter((s) => s.is_active)
        .sort((a, b) => a.order_index - b.order_index),
    [slides],
  );

  const total = activeSlides.length;
  const [current, setCurrent] = useState(0);

  const currentSlide = activeSlides[current];

  const progressPct = useMemo(() => {
    if (!total) return 0;
    return ((current + 1) / total) * 100;
  }, [current, total]);

  const contentKey = useMemo(() => {
    if (!currentSlide) return "no-slide";
    return `slide-${currentSlide.id}-${current}`;
  }, [currentSlide, current]);

  function nextSlide() {
    if (!total) return;
    setCurrent((p) => (p + 1) % total);
  }

  function prevSlide() {
    if (!total) return;
    setCurrent((p) => (p - 1 + total) % total);
  }

  function goToSlide(i: number) {
    if (!total) return;
    const clamped = Math.max(0, Math.min(total - 1, i));
    setCurrent(clamped);
  }

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      if (e.key === "ArrowRight") nextSlide();
      else prevSlide();
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  function scrollToContent() {
    const nextSection = document.querySelector("#services-section");
    if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
  }

  if (!total) {
    // Keep it graceful
    return (
      <section className="home-hero" aria-label="Hero introduction">
        <div className="home-hero__fallback">
          <div className="home-hero__fallback-inner">
            <h1 className="home-hero__fallback-title">
              Welcome to e-Nutritionist
            </h1>
            <p className="home-hero__fallback-subtitle">
              Professional nutrition consulting services
            </p>
            <Link
              className="cta-button"
              href={buildLocaleHref(lang, "/contact")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={stageRef}
      className="home-hero"
      role="region"
      aria-label="Featured highlights carousel"
      aria-roledescription="carousel"
      tabIndex={0}
    >
      <div className="home-hero__slides" aria-live="polite">
        {activeSlides.map((slide, i) => {
          const isActive = i === current;
          const bgUrl = normalizeBgUrl(slide.background_image_url);
          const overlayStyle = generateOverlayStyle(slide);

          return (
            <div
              key={slide.id}
              className={`home-hero__slide ${
                isActive ? "is-active" : i < current ? "is-prev" : "is-next"
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${total}`}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <div
                className="home-hero__bg"
                style={{ backgroundImage: `url("${bgUrl}")` }}
                aria-hidden="true"
              >
                <div
                  className="home-hero__overlay"
                  style={overlayStyle}
                  aria-hidden="true"
                />
              </div>

              <div className="home-hero__container">
                <div
                  className="home-hero__content"
                  key={isActive ? contentKey : undefined}
                >
                  <h1 className="home-hero__title">
                    {slide.content.h1_title || "Welcome to e-Nutritionist"}
                  </h1>

                  <p className="home-hero__subtitle">
                    {slide.content.paragraph ||
                      "Professional nutrition consulting services"}
                  </p>

                  <div className="home-hero__actions">
                    <PrimaryCta
                      lang={lang}
                      label={slide.content.primary_button_text || "Get Started"}
                      href={slide.content.primary_button_url || "/contact"}
                      isActive={isActive}
                    />

                    <SecondaryCta
                      lang={lang}
                      label={
                        slide.content.secondary_button_text || "View Services"
                      }
                      href={slide.content.secondary_button_url || "/services"}
                      isActive={isActive}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="home-hero__arrow home-hero__arrow--left"
            aria-label="Previous slide"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="home-hero__arrow home-hero__arrow--right"
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="home-hero__dots" aria-label="Slide navigation">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                className={`home-hero__dot ${i === current ? "is-active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
              />
            ))}
          </div>

          <div className="home-hero__progress" aria-hidden="true">
            <div
              className="home-hero__progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </>
      )}

      <div className="home-hero__scroll">
        <button
          type="button"
          onClick={scrollToContent}
          className="home-hero__scroll-btn"
          aria-label="Scroll to content"
        >
          <span className="home-hero__scroll-text">Scroll</span>
          <span className="home-hero__scroll-mouse" aria-hidden="true">
            <span className="home-hero__scroll-dot" />
          </span>
          <span className="home-hero__scroll-arrow" aria-hidden="true">
            ↓
          </span>
        </button>
      </div>
    </section>
  );
}

function PrimaryCta({
  lang,
  label,
  href,
  isActive,
}: {
  lang: Lang;
  label: string;
  href: string;
  isActive: boolean;
}) {
  const trimmed = (href ?? "").trim();
  const tabIndex = isActive ? 0 : -1;

  // External
  if (isAbsoluteUrl(trimmed)) {
    return (
      <a
        className="cta-button"
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={tabIndex}
      >
        {label}
      </a>
    );
  }

  // Internal (locale-aware)
  const internal = getSafeInternalUrl(trimmed) ?? "/contact";
  return (
    <Link
      className="cta-button"
      href={buildLocaleHref(lang, internal)}
      tabIndex={tabIndex}
    >
      {label}
    </Link>
  );
}

function SecondaryCta({
  lang,
  label,
  href,
  isActive,
}: {
  lang: Lang;
  label: string;
  href: string;
  isActive: boolean;
}) {
  const tabIndex = isActive ? 0 : -1;
  const internal = getSafeInternalUrl(href) ?? "/services";
  return (
    <Link
      className="cta-button cta-button--secondary"
      href={buildLocaleHref(lang, internal)}
      tabIndex={tabIndex}
    >
      {label}
    </Link>
  );
}
