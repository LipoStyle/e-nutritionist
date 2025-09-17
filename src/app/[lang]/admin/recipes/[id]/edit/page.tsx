'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../new/AdminRecipeForm.css';

type Language = 'en' | 'es' | 'el';
type Difficulty = 'easy' | 'medium' | 'hard';

type Ingredient = { id?: string; name: string; quantity: string; size: string };
type Step = { id?: string; step_content: string };
type Nutritional = { id?: string; name: string; quantity: string; size: string };

type ApiRecipe = {
  id: string;
  title: string;
  slug: string;
  language: Language;
  category: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  published_date: string | null;
  ingredients: { id: string; name: string; quantity: number; size: string }[];
  instructions: { id: string; step_number: number; step_content: string }[];
  valuable_info: { duration: string; difficulty: Difficulty; portions: number } | null;
  nutritional_facts: { id: string; name: string; quantity: number; size: string }[];
  meta_info: { meta_title: string | null; meta_description: string | null; meta_keywords: string | null } | null;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function isoToDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

/** Uploader constants (same as New) */
const MAX_MB = 8;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AdminEditRecipePage() {
  const pathname = usePathname();
  const router = useRouter();

  const { lang, id } = useMemo(() => {
    const segs = pathname?.split('/').filter(Boolean) ?? [];
    // /[lang]/admin/recipes/[id]/edit
    return { lang: (segs[0] as Language) || 'en', id: segs[3] || '' };
  }, [pathname]);

  // Basics
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // S3 public URL after upload
  const [publishedDate, setPublishedDate] = useState<string>('');

  // Arrays
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '', size: '' }]);
  const [instructions, setInstructions] = useState<Step[]>([{ step_content: '' }]);
  const [nutritionalFacts, setNutritionalFacts] = useState<Nutritional[]>([{ name: '', quantity: '', size: '' }]);

  // Valuable info
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [portions, setPortions] = useState<string>('1');

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  // UX
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  // Uploader UX (same as New)
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ========= LOAD EXISTING RECIPE ========= */
  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      setErr(null);
      setHint(null);
      try {
        const res = await fetch(`/api/admin/recipes/${id}`, { credentials: 'include' });
        if (res.status === 404) { setHint('Recipe not found.'); throw new Error('NOT_FOUND'); }
        if (res.status === 401 || res.status === 403) { setHint('You are not authenticated as admin.'); throw new Error(`Not authorized (${res.status})`); }
        if (!res.ok) throw new Error(`Failed to load recipe (${res.status})`);

        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const text = await res.text();
          setHint('API returned non-JSON (likely a redirect).');
          throw new Error(text.slice(0, 140));
        }
        const r = (await res.json()) as ApiRecipe;

        // Basics
        setTitle(r.title || '');
        setSlug(r.slug || '');
        setCategory(r.category || '');
        setShortDescription(r.short_description || '');
        setDescription(r.description || '');
        setImageUrl(r.image_url || '');
        setPublishedDate(r.published_date ? isoToDatetimeLocal(r.published_date) : '');

        // Arrays
        setIngredients(
          (r.ingredients || []).map((i) => ({
            id: i.id,
            name: i.name ?? '',
            quantity: Number.isFinite(i.quantity as any) ? String(i.quantity) : '',
            size: i.size ?? '',
          })) || [{ name: '', quantity: '', size: '' }],
        );
        setInstructions(
          (r.instructions || []).map((s) => ({
            id: s.id,
            step_content: s.step_content ?? '',
          })) || [{ step_content: '' }],
        );
        setNutritionalFacts(
          (r.nutritional_facts || []).map((n) => ({
            id: n.id,
            name: n.name ?? '',
            quantity: Number.isFinite(n.quantity as any) ? String(n.quantity) : '',
            size: n.size ?? '',
          })) || [{ name: '', quantity: '', size: '' }],
        );

        // Valuable
        if (r.valuable_info) {
          setDuration(r.valuable_info.duration || '');
          setDifficulty(r.valuable_info.difficulty || 'easy');
          setPortions(typeof r.valuable_info.portions === 'number' ? String(r.valuable_info.portions) : '1');
        } else {
          setDuration(''); setDifficulty('easy'); setPortions('1');
        }

        // SEO
        setMetaTitle(r.meta_info?.meta_title || '');
        setMetaDescription(r.meta_info?.meta_description || '');
        setMetaKeywords(r.meta_info?.meta_keywords || '');
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  /* ========= HELPERS ========= */
  function onTitleChange(v: string) {
    setTitle(v);
    // (Edit page keeps existing slug unless user changes it manually)
  }
  function addIngredient() { setIngredients((arr) => [...arr, { name: '', quantity: '', size: '' }]); }
  function delIngredient(i: number) { setIngredients((arr) => arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr); }
  function addInstruction() { setInstructions((arr) => [...arr, { step_content: '' }]); }
  function delInstruction(i: number) { setInstructions((arr) => arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr); }
  function addNutritional() { setNutritionalFacts((arr) => [...arr, { name: '', quantity: '', size: '' }]); }
  function delNutritional(i: number) { setNutritionalFacts((arr) => arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr); }

  /* ========= IMAGE UPLOAD (same flow as New) ========= */
  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPG, PNG, or WEBP images are allowed.';
    const maxBytes = MAX_MB * 1024 * 1024;
    if (file.size > maxBytes) return `Max file size is ${MAX_MB}MB.`;
    return null;
  }

  async function requestPresign(filename: string, contentType: string, keyHint?: string) {
    const q = new URLSearchParams({ filename, contentType, keyHint: keyHint ?? '' }).toString();
    const res = await fetch(`/api/uploads/recipes?${q}`, { method: 'GET', credentials: 'include' });
    if (!res.ok) throw new Error((await res.text()) || 'Failed to get upload URL.');
    return (await res.json()) as { url: string; key: string; publicUrl: string };
  }

  function uploadWithProgress(putUrl: string, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', putUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
      xhr.onerror = () => reject(new Error('Network error during upload.'));
      xhr.send(file);
    });
  }

  async function handlePickFile(file: File | null) {
    if (!file) return;
    setUploadError(null);
    const errMsg = validateFile(file);
    if (errMsg) { setUploadError(errMsg); return; }

    try {
      setIsUploading(true);
      setUploadProgress(1);

      const hintSlug = slugify(slug || title || 'recipe');
      const presign = await requestPresign(file.name, file.type, hintSlug);
      await uploadWithProgress(presign.url, file);

      setImageUrl(presign.publicUrl); // new S3 URL
      setUploadProgress(100);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }

  function onInputFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    void handlePickFile(f);
    e.currentTarget.value = ''; // allow same file re-select
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] || null;
    void handlePickFile(f);
  }
  function onDragOver(e: React.DragEvent<HTMLDivElement>) { e.preventDefault(); }
  function triggerFileDialog() { fileInputRef.current?.click(); }
  function clearImage() { setImageUrl(''); setUploadProgress(0); setUploadError(null); }

  /* ========= SAVE ========= */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setErr(null);
    setHint(null);

    try {
      const payload: any = {
        title: title.trim(),
        slug: slugify(slug || title),
        category: category.trim(),
        short_description: shortDescription.trim() || undefined,
        description: description.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        published_date: publishedDate ? new Date(publishedDate).toISOString() : undefined,
      };

      // Arrays (replace fully)
      const ing = ingredients
        .map(i => ({
          name: i.name.trim(),
          quantity: i.quantity === '' ? '' : Number(i.quantity),
          size: i.size.trim() || '-',
        }))
        .filter(i => i.name);
      payload.ingredients = ing;

      const steps = instructions
        .map(s => s.step_content.trim())
        .filter(Boolean)
        .map((txt, idx) => ({ step_number: idx + 1, step_content: txt }));
      payload.instructions = steps;

      const nf = nutritionalFacts
        .map(n => ({
          name: n.name.trim(),
          quantity: n.quantity === '' ? '' : Number(n.quantity),
          size: n.size.trim() || '-',
        }))
        .filter(n => n.name);
      payload.nutritional_facts = nf;

      // valuable
      const hasVal = duration.trim() !== '' || (portions && portions !== '1') || difficulty;
      payload.valuable_info = hasVal
        ? {
            duration: duration.trim() || '0',
            difficulty: (difficulty || 'easy') as Difficulty,
            portions: Number(portions || '1'),
          }
        : undefined;

      // meta
      const hasMeta = metaTitle.trim() || metaDescription.trim() || metaKeywords.trim();
      payload.meta_info = hasMeta
        ? {
            meta_title: metaTitle.trim() || null,
            meta_description: metaDescription.trim() || null,
            meta_keywords: metaKeywords.trim() || null,
          }
        : undefined;

      // Required
      for (const key of ['title', 'slug', 'category']) {
        if (!payload[key]) throw new Error(`Missing required field: ${key}`);
      }

      const res = await fetch(`/api/admin/recipes/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        let msg = `Unexpected response from server`;
        if (ct.includes('application/json')) {
          const j = await res.json();
          msg = j?.message || j?.error || msg;
        } else {
          msg = await res.text();
        }
        setHint('Check unique (language, slug) and field formats.');
        throw new Error(msg);
      }

      router.replace(`/${lang}/admin/recipes/${id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-wrap page-with-header-offset">
      <header className="admin-topbar">
        <div className="admin-titles">
          <h1>Edit Recipe</h1>
          <p className="admin-sub">Update fields and save changes.</p>
        </div>
        <div className="admin-actions">
          <Link className="btn btn-ghost" href={`/${lang}/admin/recipes/${id}`}>Back</Link>
          <Link className="btn btn-ghost" href={`/${lang}/recipes/${slug}`} target="_blank">Public preview</Link>
          <button className="btn btn-primary" onClick={onSubmit as any} disabled={saving || loading}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      {(err || hint) && (
        <section className="alert">
          <div className="alert-title">Couldn’t save</div>
          {hint && <div className="alert-hint">{hint}</div>}
          {err && <pre className="alert-detail">{err}</pre>}
        </section>
      )}

      <form className="card recipe-form" onSubmit={onSubmit}>
        {/* BASICS */}
        <section className="rf-grid">
          <div className="rf-field">
            <label>Title *</label>
            <input
              className="input"
              value={title}
              onChange={e => onTitleChange(e.target.value)}
              placeholder="Sweet Potato & Veggie Hash with Eggs"
              required
              disabled={loading}
            />
          </div>
          <div className="rf-field">
            <label>Slug *</label>
            <input
              className="input"
              value={slug}
              onChange={e => setSlug(slugify(e.target.value))}
              placeholder="sweet-potato-veggie-hash"
              required
              disabled={loading}
            />
          </div>
          <div className="rf-field">
            <label>Category *</label>
            <input
              className="input"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Breakfast"
              required
              disabled={loading}
            />
          </div>
          <div className="rf-field">
            <label>Language</label>
            <input className="input" value={lang} disabled />
            <small className="rf-help">Language is fixed by the URL for admin flow.</small>
          </div>

          <div className="rf-field rf-col-span-2">
            <label>Short Description</label>
            <input
              className="input"
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
              placeholder="A quick, protein-packed hash with sweet potato, veggies and eggs."
              disabled={loading}
            />
          </div>

          {/* IMAGE UPLOADER (same UX as New) */}
          <div className="rf-field rf-col-span-2">
            <label>Recipe Image</label>

            {imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="rf-image-preview" src={imageUrl} alt="Recipe image" />
                <div className="rf-row gap-8 mt-8">
                  <button type="button" className="btn" onClick={() => fileInputRef.current?.click()} disabled={isUploading || loading}>
                    {isUploading ? 'Uploading…' : 'Replace image'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={clearImage} disabled={isUploading || loading}>
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className="rf-dropzone"
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                >
                  <p><strong>Drag & drop</strong> an image here, or click to choose a file.</p>
                  <p className="rf-help">JPG, PNG, WEBP — up to {MAX_MB}MB</p>
                </div>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              hidden
              onChange={onInputFileChange}
              disabled={isUploading || loading}
            />

            {isUploading && (
              <div className="rf-progress">
                <div className="rf-progress-bar" style={{ width: `${uploadProgress}%` }} />
                <span className="rf-progress-label">{uploadProgress}%</span>
              </div>
            )}
            {uploadError && <p className="rf-error">{uploadError}</p>}
          </div>

          <div className="rf-field rf-col-span-2">
            <label>Published Date</label>
            <input
              className="input"
              type="datetime-local"
              value={publishedDate}
              onChange={e => setPublishedDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="rf-field rf-col-span-2">
            <label>Description (full)</label>
            <textarea
              className="input"
              rows={6}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Longer description of your recipe..."
              disabled={loading}
            />
          </div>
        </section>

        {/* INGREDIENTS */}
        <section className="rf-block">
          <div className="rf-block-title">Ingredients</div>
          <div className="rf-rep-grid rf-ingredients">
            {ingredients.map((it, i) => (
              <div className="rf-rep-row" key={i}>
                <input
                  className="input"
                  placeholder="Name (e.g., Sweet Potatoes)"
                  value={it.name}
                  onChange={e => setIngredients(arr => arr.map((r, idx) => idx === i ? { ...r, name: e.target.value } : r))}
                  disabled={loading}
                />
                <input
                  className="input"
                  placeholder="Quantity (e.g., 2)"
                  value={it.quantity}
                  onChange={e => setIngredients(arr => arr.map((r, idx) => idx === i ? { ...r, quantity: e.target.value } : r))}
                  disabled={loading}
                />
                <input
                  className="input"
                  placeholder="Size / Unit (e.g., Medium)"
                  value={it.size}
                  onChange={e => setIngredients(arr => arr.map((r, idx) => idx === i ? { ...r, size: e.target.value } : r))}
                  disabled={loading}
                />
                <button type="button" className="btn btn-danger rf-mini" onClick={() => delIngredient(i)} disabled={loading}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn rf-add" onClick={addIngredient} disabled={loading}>+ Add Ingredient</button>
        </section>

        {/* INSTRUCTIONS */}
        <section className="rf-block">
          <div className="rf-block-title">Instructions</div>
          <div className="rf-rep-grid rf-steps">
            {instructions.map((it, i) => (
              <div className="rf-rep-row" key={i}>
                <textarea
                  className="input"
                  rows={2}
                  placeholder={`Step ${i + 1}…`}
                  value={it.step_content}
                  onChange={e => setInstructions(arr => arr.map((r, idx) => idx === i ? { step_content: e.target.value } : r))}
                  disabled={loading}
                />
                <button type="button" className="btn btn-danger rf-mini" onClick={() => delInstruction(i)} disabled={loading}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn rf-add" onClick={addInstruction} disabled={loading}>+ Add Step</button>
        </section>

        {/* VALUABLE INFO */}
        <section className="rf-block">
          <div className="rf-block-title">Valuable Info</div>
          <div className="rf-grid">
            <div className="rf-field">
              <label>Duration</label>
              <input
                className="input"
                placeholder="e.g., 30–35"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="rf-field">
              <label>Difficulty</label>
              <select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} disabled={loading}>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
            <div className="rf-field">
              <label>Portions</label>
              <input
                className="input"
                type="number"
                min={1}
                step={1}
                value={portions}
                onChange={e => setPortions(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* NUTRITIONAL FACTS */}
        <section className="rf-block">
          <div className="rf-block-title">Nutritional Facts</div>
          <div className="rf-rep-grid rf-nutri">
            {nutritionalFacts.map((it, i) => (
              <div className="rf-rep-row" key={i}>
                <input
                  className="input"
                  placeholder="Name (Protein, Carbs, Vitamin C, …)"
                  value={it.name}
                  onChange={e => setNutritionalFacts(arr => arr.map((r, idx) => idx === i ? { ...r, name: e.target.value } : r))}
                  disabled={loading}
                />
                <input
                  className="input"
                  placeholder="Quantity (e.g., 16)"
                  value={it.quantity}
                  onChange={e => setNutritionalFacts(arr => arr.map((r, idx) => idx === i ? { ...r, quantity: e.target.value } : r))}
                  disabled={loading}
                />
                <input
                  className="input"
                  placeholder="Size / Unit (e.g., g, mg)"
                  value={it.size}
                  onChange={e => setNutritionalFacts(arr => arr.map((r, idx) => idx === i ? { ...r, size: e.target.value } : r))}
                  disabled={loading}
                />
                <button type="button" className="btn btn-danger rf-mini" onClick={() => delNutritional(i)} disabled={loading}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn rf-add" onClick={addNutritional} disabled={loading}>+ Add Nutrient</button>
        </section>

        {/* META INFO */}
        <section className="rf-block">
          <div className="rf-block-title">SEO / Meta</div>
          <div className="rf-grid">
            <div className="rf-field rf-col-span-2">
              <label>Meta Title</label>
              <input className="input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} disabled={loading} />
            </div>
            <div className="rf-field rf-col-span-2">
              <label>Meta Description</label>
              <textarea className="input" rows={3} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} disabled={loading} />
            </div>
            <div className="rf-field rf-col-span-2">
              <label>Meta Keywords</label>
              <input className="input" value={metaKeywords} onChange={e => setMetaKeywords(e.target.value)} disabled={loading} />
            </div>
          </div>
        </section>

        <div className="rf-actions">
          <button className="btn btn-primary" type="submit" disabled={saving || loading}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link className="btn btn-ghost" href={`/${lang}/admin/recipes/${id}`}>Cancel</Link>
        </div>
      </form>
    </main>
  );
}
