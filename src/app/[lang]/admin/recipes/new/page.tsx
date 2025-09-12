'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import './AdminRecipeForm.css';

type Language = 'en' | 'es' | 'el';
type Difficulty = 'easy' | 'medium' | 'hard';

type Ing = { name: string; quantity: string; size: string };
type Step = { step_content: string };
type Nutri = { name: string; quantity: string; size: string };

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function AdminNewRecipePage() {
  const pathname = usePathname();
  const router = useRouter();

  const lang = useMemo<Language>(() => {
    const seg = pathname?.split('/').filter(Boolean)[0] ?? 'en';
    return (['en', 'es', 'el'].includes(seg) ? (seg as Language) : 'en');
  }, [pathname]);

  // Basics
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publishedDate, setPublishedDate] = useState<string>('');

  // Arrays
  const [ingredients, setIngredients] = useState<Ing[]>([{ name: '', quantity: '', size: '' }]);
  const [instructions, setInstructions] = useState<Step[]>([{ step_content: '' }]);
  const [nutritionalFacts, setNutritionalFacts] = useState<Nutri[]>([{ name: '', quantity: '', size: '' }]);

  // Valuable info
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [portions, setPortions] = useState<string>('1');

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  // UX
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slug) setSlug(slugify(v));
  }

  function addIngredient() { setIngredients(arr => [...arr, { name: '', quantity: '', size: '' }]); }
  function delIngredient(i: number) { setIngredients(arr => arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr); }
  function addInstruction() { setInstructions(arr => [...arr, { step_content: '' }]); }
  function delInstruction(i: number) { setInstructions(arr => arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr); }
  function addNutritional() { setNutritionalFacts(arr => [...arr, { name: '', quantity: '', size: '' }]); }
  function delNutritional(i: number) { setNutritionalFacts(arr => arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setHint(null);

    try {
      const payload: any = {
        language: lang,
        title: title.trim(),
        slug: slugify(slug || title),
        category: category.trim(),
      };

      if (shortDescription.trim()) payload.short_description = shortDescription.trim();
      if (description.trim()) payload.description = description.trim();
      if (imageUrl.trim()) payload.image_url = imageUrl.trim();
      if (publishedDate) payload.published_date = new Date(publishedDate).toISOString();

      // ingredients
      const ing = ingredients
        .map(i => ({
          name: i.name.trim(),
          quantity: i.quantity === '' ? '' : Number(i.quantity),
          size: i.size.trim() || '-',
        }))
        .filter(i => i.name);
      if (ing.length) payload.ingredients = ing;

      // instructions (auto step_number)
      const steps = instructions
        .map(s => s.step_content.trim())
        .filter(Boolean)
        .map((txt, idx) => ({ step_number: idx + 1, step_content: txt }));
      if (steps.length) payload.instructions = steps;

      // valuable_info (create only if something present)
      const hasVal =
        duration.trim() !== '' || (portions && portions !== '1') || difficulty;
      if (hasVal) {
        payload.valuable_info = {
          duration: duration.trim() || '0',
          difficulty: (difficulty || 'easy') as Difficulty,
          portions: Number(portions || '1'),
        };
      }

      // nutritional facts
      const nf = nutritionalFacts
        .map(n => ({
          name: n.name.trim(),
          quantity: n.quantity === '' ? '' : Number(n.quantity),
          size: n.size.trim() || '-',
        }))
        .filter(n => n.name);
      if (nf.length) payload.nutritional_facts = nf;

      // meta info
      const hasMeta = metaTitle.trim() || metaDescription.trim() || metaKeywords.trim();
      if (hasMeta) {
        payload.meta_info = {
          meta_title: metaTitle.trim() || null,
          meta_description: metaDescription.trim() || null,
          meta_keywords: metaKeywords.trim() || null,
        };
      }

      // Minimal required validation
      for (const key of ['title', 'slug', 'language', 'category']) {
        if (!payload[key]) {
          throw new Error(`Missing required field: ${key}`);
        }
      }

      const res = await fetch(`/api/admin/recipes`, {
        method: 'POST',
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

      // Success → back to list
      router.replace(`/${lang}/admin/recipes`);
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
          <h1>New Recipe</h1>
          <p className="admin-sub">Fill in all the details and save.</p>
        </div>
        <div className="admin-actions">
          <Link className="btn btn-ghost" href={`/${lang}/admin/recipes`}>Back</Link>
          <button className="btn btn-primary" onClick={onSubmit as any} disabled={saving}>
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
            />
          </div>
          <div className="rf-field">
            <label>Language</label>
            <select className="input" value={lang} disabled>
              <option value="en">en</option>
              <option value="es">es</option>
              <option value="el">el</option>
            </select>
            <small className="rf-help">Language comes from the URL.</small>
          </div>
          <div className="rf-field rf-col-span-2">
            <label>Short Description</label>
            <input
              className="input"
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
              placeholder="A quick, protein-packed hash with sweet potato, veggies and eggs."
            />
          </div>
          <div className="rf-field rf-col-span-2">
            <label>Image URL</label>
            <input
              className="input"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="rf-image-preview" src={imageUrl} alt="preview" />
            )}
          </div>
          <div className="rf-field rf-col-span-2">
            <label>Published Date</label>
            <input
              className="input"
              type="datetime-local"
              value={publishedDate}
              onChange={e => setPublishedDate(e.target.value)}
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
                />
                <input
                  className="input"
                  placeholder="Quantity (e.g., 2)"
                  value={it.quantity}
                  onChange={e => setIngredients(arr => arr.map((r, idx) => idx === i ? { ...r, quantity: e.target.value } : r))}
                />
                <input
                  className="input"
                  placeholder="Size / Unit (e.g., Medium)"
                  value={it.size}
                  onChange={e => setIngredients(arr => arr.map((r, idx) => idx === i ? { ...r, size: e.target.value } : r))}
                />
                <button type="button" className="btn btn-danger rf-mini" onClick={() => delIngredient(i)}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn rf-add" onClick={addIngredient}>+ Add Ingredient</button>
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
                />
                <button type="button" className="btn btn-danger rf-mini" onClick={() => delInstruction(i)}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn rf-add" onClick={addInstruction}>+ Add Step</button>
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
              />
            </div>
            <div className="rf-field">
              <label>Difficulty</label>
              <select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
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
                />
                <input
                  className="input"
                  placeholder="Quantity (e.g., 16)"
                  value={it.quantity}
                  onChange={e => setNutritionalFacts(arr => arr.map((r, idx) => idx === i ? { ...r, quantity: e.target.value } : r))}
                />
                <input
                  className="input"
                  placeholder="Size / Unit (e.g., g, mg)"
                  value={it.size}
                  onChange={e => setNutritionalFacts(arr => arr.map((r, idx) => idx === i ? { ...r, size: e.target.value } : r))}
                />
                <button type="button" className="btn btn-danger rf-mini" onClick={() => delNutritional(i)}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn rf-add" onClick={addNutritional}>+ Add Nutrient</button>
        </section>

        {/* META INFO */}
        <section className="rf-block">
          <div className="rf-block-title">SEO / Meta</div>
          <div className="rf-grid">
            <div className="rf-field rf-col-span-2">
              <label>Meta Title</label>
              <input className="input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
            </div>
            <div className="rf-field rf-col-span-2">
              <label>Meta Description</label>
              <textarea className="input" rows={3} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
            </div>
            <div className="rf-field rf-col-span-2">
              <label>Meta Keywords</label>
              <input className="input" value={metaKeywords} onChange={e => setMetaKeywords(e.target.value)} />
            </div>
          </div>
        </section>

        <div className="rf-actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Recipe'}
          </button>
          <Link className="btn btn-ghost" href={`/${lang}/admin/recipes`}>Cancel</Link>
        </div>
      </form>
    </main>
  );
}
