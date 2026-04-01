import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CTAButton from "@/components/buttons/CTAButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { togglePublishBlog } from "./actions";
import DeleteBlogButton from "./DeleteBlogButton";
import BlogsFilters from "./BlogsFilters";
import "@/styles/admin-blogs.css";

type BlogRow = {
  id: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  translations: Array<{
    title: string;
    slug: string;
    cover_image_url: string | null;
    categories?: string[] | null;
    language_code: string;
  }>;
};

export default async function BlogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
    q?: string;
    status?: "all" | "draft" | "published";
    category?: string;
    from?: string; // YYYY-MM-DD
    to?: string; // YYYY-MM-DD
  }>;
}) {
  const { lang } = await params;
  const { created, updated, deleted, error, q, status = "all", category, from, to } = await searchParams;

  const supabase = await createSupabaseServerClient();
  const { data, error: fetchErr } = await supabase
    .from("blogs")
    .select("id, is_published, published_at, created_at, translations:blog_translations!inner(title,slug,cover_image_url,categories,language_code)")
    .eq("translations.language_code", lang)
    .order("created_at", { ascending: false });

  let blogs = (data ?? []) as BlogRow[];

  // Filters (kept simple; can be pushed into SQL later if needed)
  const query = String(q ?? "").trim().toLowerCase();
  if (query) {
    blogs = blogs.filter((b) => {
      const tr = b.translations?.[0];
      const hay = `${tr?.title ?? ""} ${tr?.slug ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
  }
  if (status === "draft") blogs = blogs.filter((b) => !b.is_published);
  if (status === "published") blogs = blogs.filter((b) => b.is_published);
  const cat = String(category ?? "").trim().toLowerCase();
  if (cat) {
    blogs = blogs.filter((b) => {
      const tr = b.translations?.[0];
      const cats = (tr?.categories ?? []).map((x) => String(x).toLowerCase());
      return cats.some((x) => x.includes(cat));
    });
  }
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;
  if (fromDate || toDate) {
    blogs = blogs.filter((b) => {
      const d = new Date(b.created_at);
      if (fromDate && d < fromDate) return false;
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    });
  }

  return (
    <div className="admin-page-container">
      <Link href="/admin" className="back-btn">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <header className="admin-header">
        <h1>Blog Management</h1>
        <div className="admin-header__row">
          <p>Write and publish articles for your audience.</p>
          <CTAButton text="Create new" link={`/${lang}/admin/blogs/new`} ariaLabel="Create a new blog post" />
        </div>
      </header>
      <div className="blogs-admin-container">
        <BlogsFilters lang={lang} />

        {error ? <div className="blog-list-msg">Error: {error}</div> : null}
        {fetchErr ? <div className="blog-list-msg">Error: {fetchErr.message}</div> : null}
        {created ? <div className="blog-list-msg">Saved.</div> : null}
        {updated ? <div className="blog-list-msg">Updated.</div> : null}
        {deleted ? <div className="blog-list-msg">Deleted.</div> : null}

        {blogs.length === 0 ? (
          <div className="admin-content-card">
            <p className="text-muted">No blogs yet. Click “Create new” to add your first draft.</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map((b) => {
              const tr = b.translations?.[0];
              const title = tr?.title ?? "Untitled";
              const cover = tr?.cover_image_url ?? "";

              return (
                <article key={b.id} className="blog-card">
                  <div className="blog-card__image">
                    {cover ? <img src={cover} alt={title} /> : <div className="placeholder-img">No Cover</div>}

                    <div className="blog-card__toggle">
                      <form action={togglePublishBlog}>
                        <input type="hidden" name="current_lang" value={lang} />
                        <input type="hidden" name="id" value={b.id} />
                        <input type="hidden" name="next_published" value={String(!b.is_published)} />
                        <button type="submit" className={`blog-toggle-btn ${b.is_published ? "published" : "draft"}`}>
                          {b.is_published ? "Published" : "Draft"}
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="blog-card__body">
                    <h2 className="blog-card__title">{title}</h2>
                    <div className="blog-card__meta">
                      <span>/{tr?.slug ?? ""}</span>
                      <span>{b.published_at ? new Date(b.published_at).toLocaleDateString() : "Not published"}</span>
                    </div>

                    <div className="blog-card__actions">
                      <Link className="blog-action-btn view" href={`/${lang}/admin/blogs/${b.id}`}>
                        View
                      </Link>
                      <Link className="blog-action-btn edit" href={`/${lang}/admin/blogs/edit/${b.id}`}>
                        Update
                      </Link>
                      <DeleteBlogButton blogId={b.id} lang={lang} title={title} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
