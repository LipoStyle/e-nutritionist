// =============================================================
// File: src/app/components/shared/hero-home/hero-home.tsx
// Description: Home Hero component (TypeScript, Next.js App Router compatible)
// Notes: No external libs. Minimal, accessible slider with autoplay.
// =============================================================
"use client";

import React, { useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";
import "./hero-home.css";
import CTAButton from "@/app/components/buttons/CTAButton";
import CTAButtonSecondary from "@/app/components/buttons/CTAButtonSecondary";

// ---- Types ----------------------------------------------------
export type Lang = "en" | "es" | "el";
export type HeroVariant = "slider" | "static";

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string; // stable key
  title: string;
  subtitle?: string;
  backgroundImage: string; // URL or public path
  ctaPrimary: HeroCta;
  ctaSecondary?: HeroCta;
  ariaLabel?: string; // for a11y announcements
}

export interface HeroHomeProps {
  lang?: Lang;
  variant?: HeroVariant;
  autoplay?: boolean;
  intervalMs?: number; // default 4000
  showSecondaryCta?: boolean;
}

// ---- Data loaders (language-specific) ------------------------
// Lazy static imports to keep tree-shaking friendly
async function loadSlides(lang: Lang): Promise<HeroSlide[]> {
  switch (lang) {
    case "es":
      return (await import("./data/slides.es")).slides;
    case "el":
      return (await import("./data/slides.el")).slides;
    case "en":
    default:
      return (await import("./data/slides.en")).slides;
  }
}

// ---- Subcomponents -------------------------------------------
function Dots({ count, active, onJump }: { count: number; active: number; onJump: (i: number) => void }) {
  return (
    <div className="heroDots" role="tablist" aria-label="Hero slides">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className={`heroDot ${i === active ? "is-active" : ""}`}
          role="tab"
          aria-selected={i === active}
          aria-controls={`hero-slide-${i}`}
          onClick={() => onJump(i)}
        >
          <span className="visuallyHidden">Go to slide {i + 1}</span>
        </button>
      ))}
    </div>
  );
}

function Controls({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div className="heroControls" aria-hidden="false">
      <button className="heroControl heroControl--prev" onClick={onPrev} aria-label="Previous slide" />
      <button className="heroControl heroControl--next" onClick={onNext} aria-label="Next slide" />
    </div>
  );
}

// ---- Main Component ------------------------------------------
const HeroHome: React.FC<HeroHomeProps> = ({
  lang = "en",
  variant = "slider",
  autoplay = true,
  intervalMs = 4000,
  showSecondaryCta = true,
}) => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [active, setActive] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  // Load slides by language
  useEffect(() => {
    let mounted = true;
    loadSlides(lang).then((s) => {
      if (mounted) {
        setSlides(s);
        setActive(0);
      }
    });
    return () => {
      mounted = false;
    };
  }, [lang]);

  const count = slides.length;

  // Autoplay logic
  useEffect(() => {
    if (variant !== "slider" || !autoplay || count <= 1) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, Math.max(2000, intervalMs));
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [variant, autoplay, intervalMs, count]);

  // Keyboard navigation
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (variant !== "slider" || count <= 1) return;
    if (e.key === "ArrowRight") setActive((i) => (i + 1) % count);
    if (e.key === "ArrowLeft") setActive((i) => (i - 1 + count) % count);
  };

  const onPrev = () => setActive((i) => (i - 1 + count) % count);
  const onNext = () => setActive((i) => (i + 1) % count);
  const onJump = (i: number) => setActive(i);

  const activeSlide = useMemo(() => slides[active], [slides, active]);

  return (
    <section
      className={`heroHome ${variant === "slider" ? "heroHome--slider" : "heroHome--static"}`}
      aria-roledescription="carousel"
      aria-label="Highlighted services"
      ref={regionRef}
      tabIndex={0}
      onKeyDown={onKey}
    >
      {/* Slides */}
      <div className="heroSlides">
        {slides.map((s, i) => (
          <article
            key={s.id}
            id={`hero-slide-${i}`}
            className={`heroSlide ${i === active ? "is-active" : ""}`}
            aria-roledescription="slide"
            aria-label={s.ariaLabel || s.title}
          >
            <div className="heroSlide__bg" style={{ backgroundImage: `url(${s.backgroundImage})` }} />
            <div className="heroSlide__overlay">
              <h1 className="heroTitle">{s.title}</h1>
              {s.subtitle && <p className="heroSubtitle">{s.subtitle}</p>}
              <div className="heroActions">
                <CTAButton
                  text={s.ctaPrimary.label}
                  link={s.ctaPrimary.href}
                  ariaLabel={s.ariaLabel || s.title}
                />
                {showSecondaryCta && s.ctaSecondary && (
                  <CTAButtonSecondary
                    text={s.ctaSecondary.label}
                    link={s.ctaSecondary.href}
                    ariaLabel={`Secondary: ${s.ariaLabel || s.title}`}
                  />
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Controls & Dots (only for slider with >1 slide) */}
      {variant === "slider" && count > 1 && (
        <>
          <Controls onPrev={onPrev} onNext={onNext} />
          <Dots count={count} active={active} onJump={onJump} />
        </>
      )}

      {/* Scroll cue */}
      <div className="heroScrollCue" aria-hidden="true" />
    </section>
  );
};

export default HeroHome;