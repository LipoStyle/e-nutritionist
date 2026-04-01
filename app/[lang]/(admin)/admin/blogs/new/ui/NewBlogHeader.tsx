"use client";

import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type BlogLang = "en" | "el" | "es";
type HeaderState = Record<
  BlogLang,
  {
    title: string;
    slug: string;
    categories: string[];
    excerpt: string;
    coverImageUrl: string;
    metaTitle: string;
    metaDescription: string;
    ogImageUrl: string;
    metaKeywords: string;
  }
>;

const LANGS: Array<{ code: BlogLang; label: string }> = [
  { code: "en", label: "EN" },
  { code: "el", label: "EL" },
  { code: "es", label: "ES" },
];

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export type BlogHeaderLang = BlogLang;
export type BlogHeaderState = HeaderState;

export default function NewBlogHeader({ initial }: { initial?: Partial<HeaderState> } = {}) {
  const [activeLang, setActiveLang] = useState<BlogLang>("en");
  const [state, setState] = useState<HeaderState>(() => ({
    en: {
      title: initial?.en?.title ?? "",
      slug: initial?.en?.slug ?? "",
      categories: initial?.en?.categories ?? [],
      excerpt: initial?.en?.excerpt ?? "",
      coverImageUrl: initial?.en?.coverImageUrl ?? "",
      metaTitle: initial?.en?.metaTitle ?? "",
      metaDescription: initial?.en?.metaDescription ?? "",
      ogImageUrl: initial?.en?.ogImageUrl ?? "",
      metaKeywords: initial?.en?.metaKeywords ?? "",
    },
    el: {
      title: initial?.el?.title ?? "",
      slug: initial?.el?.slug ?? "",
      categories: initial?.el?.categories ?? [],
      excerpt: initial?.el?.excerpt ?? "",
      coverImageUrl: initial?.el?.coverImageUrl ?? "",
      metaTitle: initial?.el?.metaTitle ?? "",
      metaDescription: initial?.el?.metaDescription ?? "",
      ogImageUrl: initial?.el?.ogImageUrl ?? "",
      metaKeywords: initial?.el?.metaKeywords ?? "",
    },
    es: {
      title: initial?.es?.title ?? "",
      slug: initial?.es?.slug ?? "",
      categories: initial?.es?.categories ?? [],
      excerpt: initial?.es?.excerpt ?? "",
      coverImageUrl: initial?.es?.coverImageUrl ?? "",
      metaTitle: initial?.es?.metaTitle ?? "",
      metaDescription: initial?.es?.metaDescription ?? "",
      ogImageUrl: initial?.es?.ogImageUrl ?? "",
      metaKeywords: initial?.es?.metaKeywords ?? "",
    },
  }));
  const [uploadState, setUploadState] = useState<{ isUploading: boolean; error: string }>({
    isUploading: false,
    error: "",
  });
  const [categoryDraft, setCategoryDraft] = useState<string>("");

  const current = state[activeLang];

  const namePrefix = useMemo(() => `tr_${activeLang}_`, [activeLang]);

  return (
    <div>
      <div className="BlogNew__langTabs" role="tablist" aria-label="Blog language">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`BlogNew__langTab ${activeLang === l.code ? "is-active" : ""}`}
            onClick={() => setActiveLang(l.code)}
            role="tab"
            aria-selected={activeLang === l.code}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Hidden fields for non-active languages so form submission keeps all translations */}
      {LANGS.filter((l) => l.code !== activeLang).map((l) => (
        <div key={l.code} style={{ display: "none" }}>
          <input name={`tr_${l.code}_title`} value={state[l.code].title} readOnly />
          <input name={`tr_${l.code}_slug`} value={state[l.code].slug} readOnly />
          <input name={`tr_${l.code}_categories`} value={state[l.code].categories.join(",")} readOnly />
          <textarea name={`tr_${l.code}_excerpt`} value={state[l.code].excerpt} readOnly />
          <input name={`tr_${l.code}_cover_image_url`} value={state[l.code].coverImageUrl} readOnly />
          <input name={`tr_${l.code}_meta_title`} value={state[l.code].metaTitle} readOnly />
          <textarea name={`tr_${l.code}_meta_description`} value={state[l.code].metaDescription} readOnly />
          <input name={`tr_${l.code}_og_image_url`} value={state[l.code].ogImageUrl} readOnly />
          <input name={`tr_${l.code}_meta_keywords`} value={state[l.code].metaKeywords} readOnly />
        </div>
      ))}

      <div className="BlogNew__grid" role="tabpanel">
        <label className="BlogNew__field">
          <span className="BlogNew__fieldLabel">Title</span>
          <input
            className="BlogNew__input"
            name={`${namePrefix}title`}
            value={current.title}
            onChange={(e) => {
              const title = e.target.value;
              setState((prev) => {
                const next = { ...prev };
                const cur = next[activeLang];
                // only auto-fill slug if empty
                const nextSlug = cur.slug ? cur.slug : slugify(title);
                next[activeLang] = { ...cur, title, slug: nextSlug };
                return next;
              });
            }}
            placeholder="Blog title…"
          />
        </label>

        <label className="BlogNew__field">
          <span className="BlogNew__fieldLabel">Slug</span>
          <input
            className="BlogNew__input"
            name={`${namePrefix}slug`}
            value={current.slug}
            onChange={(e) => {
              const slug = slugify(e.target.value);
              setState((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], slug } }));
            }}
            placeholder="blog-title-slug"
          />
          <p className="BlogNew__hint">Used in the URL. Letters/numbers only; spaces become dashes.</p>
        </label>

        <label className="BlogNew__field">
          <span className="BlogNew__fieldLabel">Category</span>
          <input type="hidden" name={`${namePrefix}categories`} value={current.categories.join(",")} />
          <div className="BlogNew__tags">
            {current.categories.map((c) => (
              <span key={c} className="BlogNew__tag">
                {c}
                <button
                  type="button"
                  className="BlogNew__tagRemove"
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      [activeLang]: {
                        ...prev[activeLang],
                        categories: prev[activeLang].categories.filter((x) => x !== c),
                      },
                    }));
                  }}
                  aria-label={`Remove category ${c}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              className="BlogNew__tagInput"
              value={categoryDraft}
              onChange={(e) => setCategoryDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== ",") return;
                e.preventDefault();
                const raw = categoryDraft.trim();
                const cleaned = raw.replace(/,+$/, "").trim();
                if (!cleaned) return;
                setState((prev) => {
                  const existing = prev[activeLang].categories;
                  if (existing.includes(cleaned)) return prev;
                  return {
                    ...prev,
                    [activeLang]: { ...prev[activeLang], categories: [...existing, cleaned] },
                  };
                });
                setCategoryDraft("");
              }}
              placeholder="Type a category and press Enter…"
            />
          </div>
          <p className="BlogNew__hint">Press Enter (or comma) to add multiple categories.</p>
        </label>

        <label className="BlogNew__field">
          <span className="BlogNew__fieldLabel">Cover image</span>
          <input type="hidden" name={`${namePrefix}cover_image_url`} value={current.coverImageUrl} />
          <input
            className="BlogNew__input"
            type="file"
            accept="image/*"
            disabled={uploadState.isUploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setUploadState({ isUploading: true, error: "" });
              try {
                const supabase = createSupabaseBrowserClient();

                const ext = file.name.split(".").pop()?.toLowerCase() || "png";
                const safeExt = ext.match(/^[a-z0-9]+$/) ? ext : "png";
                const fileName = `${crypto.randomUUID()}.${safeExt}`;
                const path = `blog-covers/${fileName}`;

                const { error: uploadErr } = await supabase.storage.from("blog-images").upload(path, file, {
                  cacheControl: "3600",
                  upsert: false,
                  contentType: file.type || undefined,
                });
                if (uploadErr) throw uploadErr;

                const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
                const publicUrl = data.publicUrl;
                if (!publicUrl) throw new Error("No public URL returned.");

                setState((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], coverImageUrl: publicUrl } }));
              } catch (err: any) {
                setUploadState({
                  isUploading: false,
                  error:
                    err?.message ||
                    'Upload failed. Ensure you have a Supabase Storage bucket named "blog-images" and the right permissions.',
                });
                return;
              } finally {
                setUploadState((prev) => ({ ...prev, isUploading: false }));
              }
            }}
          />
          {current.coverImageUrl ? (
            <p className="BlogNew__hint">
              Uploaded: <span style={{ wordBreak: "break-all" }}>{current.coverImageUrl}</span>
            </p>
          ) : (
            <p className="BlogNew__hint">Uploads to Supabase Storage bucket: <strong>blog-images</strong></p>
          )}
          {uploadState.error ? (
            <p className="BlogNew__hint" style={{ color: "var(--danger)" }}>
              {uploadState.error}
            </p>
          ) : null}
        </label>

        <label className="BlogNew__field" style={{ gridColumn: "1 / -1" }}>
          <span className="BlogNew__fieldLabel">Excerpt</span>
          <textarea
            className="BlogNew__textarea"
            name={`${namePrefix}excerpt`}
            value={current.excerpt}
            onChange={(e) => setState((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], excerpt: e.target.value } }))}
            placeholder="Short description used in lists and previews…"
          />
        </label>

        <div className="BlogNew__seo" style={{ gridColumn: "1 / -1" }}>
          <div className="BlogNew__seoTitle">SEO (optional)</div>

          <label className="BlogNew__field">
            <span className="BlogNew__fieldLabel">Meta title</span>
            <input
              className="BlogNew__input"
              name={`${namePrefix}meta_title`}
              value={current.metaTitle}
              onChange={(e) => setState((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], metaTitle: e.target.value } }))}
              placeholder="If empty, we’ll use the blog title."
            />
            <p className="BlogNew__hint">Recommended: ~50–60 characters.</p>
          </label>

          <label className="BlogNew__field">
            <span className="BlogNew__fieldLabel">Meta description</span>
            <textarea
              className="BlogNew__textarea"
              name={`${namePrefix}meta_description`}
              value={current.metaDescription}
              onChange={(e) => setState((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], metaDescription: e.target.value } }))}
              placeholder="If empty, we’ll use the excerpt."
            />
            <p className="BlogNew__hint">Recommended: ~150–160 characters.</p>
          </label>

          <label className="BlogNew__field">
            <span className="BlogNew__fieldLabel">OG image URL</span>
            <input
              className="BlogNew__input"
              name={`${namePrefix}og_image_url`}
              value={current.ogImageUrl}
              onChange={(e) => setState((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], ogImageUrl: e.target.value } }))}
              placeholder="If empty, we’ll use the cover image."
            />
          </label>

          <label className="BlogNew__field" style={{ gridColumn: "1 / -1" }}>
            <span className="BlogNew__fieldLabel">Meta keywords</span>
            <input
              className="BlogNew__input"
              name={`${namePrefix}meta_keywords`}
              value={current.metaKeywords}
              onChange={(e) => setState((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], metaKeywords: e.target.value } }))}
              placeholder="Comma-separated (optional)"
            />
            <p className="BlogNew__hint">Not used by Google, but OK to keep for completeness.</p>
          </label>
        </div>
      </div>
    </div>
  );
}

