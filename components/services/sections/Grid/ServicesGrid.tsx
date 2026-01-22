// components/services/sections/Grid/ServicesGrid.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/services/grid.css";
import type { ServiceCardModel } from "@/app/[lang]/(public)/services/services.queries";

import ServiceCard from "./ServiceCard";

export default function ServicesGrid({ cards }: { cards: ServiceCardModel[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect(); // animate once
        }
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`services-grid ${visible ? "is-visible" : ""}`}
      id="services"
      aria-label="Services list"
    >
      <div className="services-grid__inner">
        <div className="services-grid__grid">
          {cards.map((c, i) => (
            <div
              key={c.id}
              className="services-grid__item"
              style={{ ["--stagger" as any]: `${i * 90}ms` }}
            >
              <ServiceCard card={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
