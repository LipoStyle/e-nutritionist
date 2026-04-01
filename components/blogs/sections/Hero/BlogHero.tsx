"use client";

import { useParams } from "next/navigation";
import "@/styles/blogs/blog-hero.css";
import { blogHeroData } from "@/app/[lang]/(public)/blogs/BlogHero.data";
import { normalizeLang } from "@/lib/i18n/locale";

export default function BlogHero() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);
  const content = blogHeroData[lang];

  return (
    <section className="blog-hero" aria-labelledby="blog-hero-title">
      <div className="blog-hero__container">
        <h1 id="blog-hero-title" className="blog-hero__title">
          {content.title}
        </h1>
        <p className="blog-hero__description">{content.description}</p>
      </div>
    </section>
  );
}

