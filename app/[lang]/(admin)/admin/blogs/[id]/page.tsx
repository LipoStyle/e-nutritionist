import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import BlogPostView from "@/components/blogs/BlogPostView";
import "@/styles/blogs/blog-post.css";
import "@/styles/buttons/CTAButton.css";

export default async function BlogAdminViewPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, is_published, published_at, created_at, translations:blog_translations(title,slug,excerpt,categories,cover_image_url,body_json,language_code)"
    )
    .eq("id", id)
    .maybeSingle();

  const tr = (data as any)?.translations?.find((t: any) => t.language_code === lang) ?? (data as any)?.translations?.[0];
  const blocks = (tr?.body_json?.blocks && Array.isArray(tr.body_json.blocks) ? tr.body_json.blocks : []) as any[];
  const dateLabel = (data as any)?.published_at
    ? new Date((data as any).published_at).toLocaleDateString()
    : new Date((data as any)?.created_at ?? Date.now()).toLocaleDateString();

  return (
    <div className="admin-page-container">
      <Link href={`/${lang}/admin/blogs`} className="back-btn">
        <ArrowLeft size={16} /> Back to Blogs
      </Link>
      <header className="admin-header">
        <h1>Blog Preview</h1>
        <div className="admin-header__row">
          <p>{tr?.title ?? "Untitled"}</p>
          {tr?.slug ? (
            <Link className="nav-icon-link" href={`/${lang}/blogs/${tr.slug}`} target="_blank">
              Open public page
            </Link>
          ) : null}
        </div>
      </header>
      <div className="admin-content-card">
        {error || !data ? (
          <p className="text-muted">{error?.message ?? "Blog not found."}</p>
        ) : (
          <BlogPostView
            lang={lang}
            title={tr?.title ?? "Untitled"}
            slug={tr?.slug}
            excerpt={tr?.excerpt ?? null}
            categories={tr?.categories ?? []}
            coverImageUrl={tr?.cover_image_url ?? null}
            dateLabel={dateLabel}
            blocks={blocks as any}
            backHref={`/${lang}/admin/blogs`}
            breadcrumb={[
              { label: "Home", href: `/${lang}` },
              { label: "Blog", href: `/${lang}/blogs` },
              { label: tr?.title ?? "Untitled" },
            ]}
            shareUrl={tr?.slug ? `/${lang}/blogs/${tr.slug}` : null}
          />
        )}
      </div>
    </div>
  );
}

