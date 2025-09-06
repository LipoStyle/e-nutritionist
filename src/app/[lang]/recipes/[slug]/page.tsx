// src/app/[lang]/recipes/[slug]/page.tsx
import Image from "next/image";
import type { Metadata } from "next";
import styles from "./RecipeDetail.module.css";
import { getRecipeBySlug } from "./recipe-data.server";
import { notFound } from "next/navigation";
import IngredientsChecklist from "./IngredientsChecklist"; // ← interactive client component

type Params = { lang: string; slug: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return {};

  const title = recipe.meta_info?.meta_title ?? recipe.title;

  const normalizedDesc =
    recipe.meta_info?.meta_description ??
    recipe.description?.replace(/\s+/g, " ").trim();

  const description =
    normalizedDesc && normalizedDesc.length > 160
      ? `${normalizedDesc.slice(0, 157)}…`
      : normalizedDesc ?? undefined;

  const img =
    (recipe as any).image_url ??
    (recipe as any).image ??
    "/assets/recipes/cards/default.jpg";

  const keywords = recipe.meta_info?.meta_keywords
    ? String(recipe.meta_info.meta_keywords)
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [{ url: img }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
  };
}

export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const img =
    (recipe as any).image_url ??
    (recipe as any).image ??
    "/assets/recipes/cards/default.jpg";

  const vi = recipe.valuable_info ?? {
    duration: "",
    difficulty: "",
    portions: "",
  };

  const ingredients = recipe.ingredients ?? [];
  const instructions = (recipe.instructions ?? []).slice().sort((a, b) => {
    const A = a?.step_number ?? 0;
    const B = b?.step_number ?? 0;
    return A - B;
  });
  const nutrition = recipe.nutritional_facts ?? [];

  return (
    <article className={styles.page}>
      {/* HERO — full width with overlay; top padding handled via CSS (header height var) */}
      <section className={styles.hero}>
        <div className={styles.heroImageWrap}>
          <Image
            src={img}
            alt={recipe.title}
            fill
            priority
            className={styles.heroImage}
            sizes="100vw"
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{recipe.title}</h1>

          {(vi.duration || vi.difficulty || vi.portions) && (
            <ul className={styles.heroMeta}>
              {vi.duration ? (
                <li className={styles.metaPill}>
                  <span className={styles.metaDot} aria-hidden />
                  {vi.duration} min
                </li>
              ) : null}
              {vi.difficulty ? (
                <li className={styles.metaPill}>
                  <span className={styles.metaDot} aria-hidden />
                  {vi.difficulty}
                </li>
              ) : null}
              {vi.portions ? (
                <li className={styles.metaPill}>
                  <span className={styles.metaDot} aria-hidden />
                  {vi.portions} {Number(vi.portions) === 1 ? "serving" : "servings"}
                </li>
              ) : null}
            </ul>
          )}
        </div>
      </section>

      {/* DESCRIPTION */}
      {recipe.description?.trim() ? (
        <section className={`${styles.section} ${styles.descSection}`}>
          <h2 className={styles.sectionTitle}>About this recipe</h2>
          <p className={styles.lead}>
            {recipe.description.replace(/\s*\n+\s*/g, " ").trim()}
          </p>
        </section>
      ) : null}

      {/* FEATURED DISH PHOTO (framed) */}
      <section className={`${styles.section} ${styles.photoSection}`}>
        <div className={styles.photoFrame}>
          <Image
            src={img}
            alt={`${recipe.title} – dish`}
            fill
            className={styles.photoImg}
            sizes="(max-width: 900px) 100vw, 900px"
          />
        </div>
      </section>

      {/* INGREDIENTS + INSTRUCTIONS (seamless two-column slab) */}
      <section className={`${styles.section} ${styles.cookSection}`}>
        <div className={styles.twoColSeamless}>
          {/* LEFT: Ingredients */}
          <div className={styles.slabLeft}>
            <h3 className={styles.slabTitle}>Ingredients</h3>

            <div className={styles.tipBar}>
              <span className={styles.tipBadge}>TIP</span>
              <p className={styles.tipText}>
                Check off the ingredients you’ve used in the recipe, or mark the ones you already have and add the rest to your shopping list.
              </p>
            </div>

            {ingredients.length ? (
              <ul className={styles.listRows}>
                {ingredients.map((ing) => (
                  <li
                    key={ing.id ?? `${ing.name}-${ing.size}-${ing.quantity}`}
                    className={styles.row}
                  >
                    <input type="checkbox" className={styles.rowCheck} />
                    <span className={styles.rowText}>
                      {ing.quantity ? (
                        <strong className={styles.rowStrong}>
                          {ing.quantity}{ing.size ? ` ${ing.size}` : ""}{" "}
                        </strong>
                      ) : null}
                      <span className={styles.rowName}>{ing.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyNote}>Ingredients coming soon.</p>
            )}
          </div>

          {/* RIGHT: Instructions */}
          <div className={styles.slabRight}>
            <h3 className={styles.slabTitle}>Instructions</h3>

            <div className={styles.tipBar}>
              <span className={styles.tipBadge}>TIP</span>
              <p className={styles.tipText}>
                Tick each step as you go. Keep heat medium for even browning; add a splash of water if the pan gets too dry.
              </p>
            </div>

            {instructions.length ? (
              <ol className={styles.listRows}>
                {instructions.map((st) => (
                  <li key={st.id ?? st.step_number} className={styles.row}>
                    <input type="checkbox" className={styles.rowCheck} />
                    <span className={styles.rowText}>
                      <strong className={styles.rowStepNo}>Step {st.step_number} → </strong>
                      <span className={styles.rowName}>{st.step_content}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.emptyNote}>Instructions coming soon.</p>
            )}
          </div>
        </div>
      </section>


      {/* NUTRITION */}
      {nutrition.length ? (
        <section className={`${styles.section} ${styles.nutriSection}`}>
          <h3 className={styles.sectionTitle}>Nutritional facts (per portion)</h3>
          <div className={styles.nutriGrid}>
            {nutrition.map((nf) => (
              <div key={nf.id ?? nf.name} className={styles.nutriCard}>
                <div className={styles.nutriName}>{nf.name}</div>
                <div className={styles.nutriValue}>
                  {nf.quantity} {nf.size}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
