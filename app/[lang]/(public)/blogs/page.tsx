import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import BlogsFiltersPublic from "./BlogsFiltersPublic";
import BlogHero from "@/components/blogs/sections/Hero/BlogHero";
import "@/styles/blogs/blogs-page.css";

type Lang = "en" | "el" | "es";

type Props = {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ q?: string; topic?: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.e-nutritionist.com";
  const canonical = new URL(`/${lang}/blogs`, site).toString();

  const title = "Nutrition Blog & Insights";
  const description =
    "Stay updated with evidence-based nutrition articles, practical guides, and performance-focused tips from our certified nutritionist.";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: new URL("/en/blogs", site).toString(),
        es: new URL("/es/blogs", site).toString(),
        el: new URL("/el/blogs", site).toString(),
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PublicBlogsPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { q, topic } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("blogs")
    .select(
      "id, is_published, published_at, created_at, translations:blog_translations!inner(title,slug,excerpt,cover_image_url,categories,language_code)"
    )
    .eq("is_published", true)
    .eq("translations.language_code", lang)
    .order("published_at", { ascending: false });

  const blogs = (data ?? []) as Array<{
    id: string;
    published_at: string | null;
    created_at: string;
    translations: Array<{
      title: string;
      slug: string;
      excerpt?: string | null;
      cover_image_url: string | null;
      categories?: string[] | null;
    }>;
  }>;

  const allTopics = Array.from(
    new Set(
      blogs
        .flatMap((b) => b.translations?.[0]?.categories ?? [])
        .map((x) => String(x).trim())
        .filter(Boolean)
        .map((x) => x.toLowerCase())
    )
  )
    .sort()
    .slice(0, 14); // keep it tidy like screenshot

  let filtered = blogs;
  const query = String(q ?? "").trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((b) => {
      const tr = b.translations?.[0];
      const hay = `${tr?.title ?? ""} ${tr?.slug ?? ""} ${tr?.excerpt ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
  }

  const topicNorm = String(topic ?? "").trim().toLowerCase();
  if (topicNorm) {
    filtered = filtered.filter((b) => {
      const tr = b.translations?.[0];
      const cats = (tr?.categories ?? []).map((x) => String(x).toLowerCase());
      return cats.includes(topicNorm);
    });
  }

  return (
    <>
      <BlogHero />
      <div className="PublicBlogs">
        <div className="PublicBlogs__wrap">
          <BlogsFiltersPublic lang={lang} topics={allTopics} />
          <div className="PublicBlogs__count">{filtered.length} articles found</div>

          {filtered.length === 0 ? (
            <div className="admin-content-card">
              <p className="text-muted">{q || topic ? "No results. Try adjusting filters." : "No published articles yet."}</p>
            </div>
          ) : (
            <div className="PublicBlogs__grid">
              {filtered.map((b) => {
                const tr = b.translations?.[0];
                const title = tr?.title ?? "Untitled";
                const cover = tr?.cover_image_url ?? "";
                const excerpt = tr?.excerpt ?? "";
                const href = `/${lang}/blogs/${tr?.slug ?? ""}`;
                const tags = (tr?.categories ?? []).slice(0, 2);
                const date = b.published_at ? new Date(b.published_at).toLocaleDateString() : "";

                return (
                  <article key={b.id} className="PublicBlogs__card">
                    <div className="PublicBlogs__cardImg">
                      {cover ? <img src={cover} alt={title} /> : null}
                    </div>
                    <div className="PublicBlogs__cardBody">
                      {tags.length ? (
                        <div className="PublicBlogs__cardTags">
                          {tags.map((t) => (
                            <span key={t} className="PublicBlogs__cardTag">
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <h2 className="PublicBlogs__cardTitle">{title}</h2>
                      <p className="PublicBlogs__cardExcerpt">{excerpt}</p>
                      <div className="PublicBlogs__cardMeta">
                        <span>{date}</span>
                        <Link className="PublicBlogs__readMore" href={href}>
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
