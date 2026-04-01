import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewBlogHeader from "./ui/NewBlogHeader";
import NewBlogBody from "./ui/NewBlogBody";
import "@/styles/admin-blog-editor.css";
import "@/styles/buttons/CTAButton.css";
import { saveBlogDraft } from "./actions";

export default async function NewBlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <div className="admin-page-container">
      <Link href={`/${lang}/admin/blogs`} className="back-btn">
        <ArrowLeft size={16} /> Back to Blogs
      </Link>
      <header className="admin-header">
        <h1>New Blog</h1>
        <div className="admin-header__row">
          <p>Create a new blog post. Saved as draft by default.</p>
          <button className="cta-button" type="submit" form="new-blog-form">
            Save draft
          </button>
        </div>
      </header>
      <form id="new-blog-form" action={saveBlogDraft}>
        <input type="hidden" name="current_lang" value={lang} />
        <div className="admin-content-card BlogNew BlogNew--fullBleed">
          <div className="BlogNew__sections">
            <section>
              <h2 className="BlogNew__sectionTitle">Header</h2>
              <div className="BlogNew__card">
                <NewBlogHeader />
              </div>
            </section>

            <section className="BlogNew__bodySection">
              <h2 className="BlogNew__sectionTitle">Body</h2>
              <div className="BlogNew__card BlogNew__bodyCard">
                <NewBlogBody />
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}

