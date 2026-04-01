import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import NewBlogHeader from "../../new/ui/NewBlogHeader";
import NewBlogBody from "../../new/ui/NewBlogBody";
import "@/styles/admin-blog-editor.css";
import "@/styles/buttons/CTAButton.css";
import { updateBlogDraft } from "./actions";

export default async function EditBlogPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, is_published, published_at, created_at, translations:blog_translations(title,slug,excerpt,categories,cover_image_url,meta_title,meta_description,og_image_url,body_json,language_code)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return (
      <div className="admin-page-container">
        <Link href={`/${lang}/admin/blogs`} className="back-btn">
          <ArrowLeft size={16} /> Back to Blogs
        </Link>
        <header className="admin-header">
          <h1>Edit Blog</h1>
          <p className="text-muted">Could not load this blog.</p>
        </header>
        <div className="admin-content-card">
          <p className="text-muted">{error?.message ?? "Not found."}</p>
        </div>
      </div>
    );
  }

  const mapTr = (code: "en" | "el" | "es") => {
    const tr = (data as any).translations?.find((t: any) => t.language_code === code);
    return {
      title: String(tr?.title ?? ""),
      slug: String(tr?.slug ?? ""),
      categories: Array.isArray(tr?.categories) ? (tr.categories as string[]) : [],
      excerpt: String(tr?.excerpt ?? ""),
      coverImageUrl: String(tr?.cover_image_url ?? ""),
      metaTitle: String(tr?.meta_title ?? ""),
      metaDescription: String(tr?.meta_description ?? ""),
      ogImageUrl: String(tr?.og_image_url ?? ""),
      metaKeywords: Array.isArray(tr?.meta_keywords) ? (tr.meta_keywords as string[]).join(", ") : String(tr?.meta_keywords ?? ""),
    };
  };

  const headerInitial = {
    en: mapTr("en"),
    el: mapTr("el"),
    es: mapTr("es"),
  };

  const bodyBlocksFor = (code: "en" | "el" | "es") => {
    const tr = (data as any).translations?.find((t: any) => t.language_code === code);
    const body = tr?.body_json;
    const blocks = Array.isArray(body?.blocks) ? body.blocks : [];
    return { blocks };
  };

  const bodyInitial = {
    en: bodyBlocksFor("en"),
    el: bodyBlocksFor("el"),
    es: bodyBlocksFor("es"),
  };

  return (
    <div className="admin-page-container">
      <Link href={`/${lang}/admin/blogs`} className="back-btn">
        <ArrowLeft size={16} /> Back to Blogs
      </Link>
      <header className="admin-header">
        <h1>Edit Blog</h1>
        <div className="admin-header__row">
          <p>Edit your draft and save changes.</p>
          <button className="cta-button" type="submit" form="edit-blog-form">
            Save changes
          </button>
        </div>
      </header>
      <form id="edit-blog-form" action={updateBlogDraft}>
        <input type="hidden" name="current_lang" value={lang} />
        <input type="hidden" name="blog_id" value={id} />
        <div className="admin-content-card BlogNew BlogNew--fullBleed">
          <div className="BlogNew__sections">
            <section>
              <h2 className="BlogNew__sectionTitle">Header</h2>
              <div className="BlogNew__card">
                <NewBlogHeader initial={headerInitial as any} />
              </div>
            </section>

            <section className="BlogNew__bodySection">
              <h2 className="BlogNew__sectionTitle">Body</h2>
              <div className="BlogNew__card BlogNew__bodyCard">
                <NewBlogBody initial={bodyInitial as any} />
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}

