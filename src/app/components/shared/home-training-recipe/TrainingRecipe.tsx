'use client'

import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import './TrainingRecipe.css'
import Link from 'next/link'

import type { Lang, TrainingRecipePair } from './types'
import { pairsEN } from './data/pairs.en'
import { pairsES } from './data/pairs.es'
import { pairsEL } from './data/pairs.el'

const SUPPORTED: Lang[] = ['en', 'es', 'el']
const withLang = (lang: Lang, path: string) => {
  if (!path) return `/${lang}`
  const parts = path.split('/').filter(Boolean)
  if (parts.length > 0 && SUPPORTED.includes(parts[0] as Lang)) return path
  return `/${lang}${path.startsWith('/') ? '' : '/'}${path}`
}

export interface TrainingRecipeProps {
  lang?: Lang
  title?: string
  subtitle?: string
}

const TrainingRecipe: React.FC<TrainingRecipeProps> = ({ lang, title, subtitle }) => {
  const pathname = usePathname() || '/'
  const detected = useMemo<Lang>(() => {
    const seg = pathname.split('/').filter(Boolean)[0]
    return (SUPPORTED.includes(seg as Lang) ? (seg as Lang) : 'en')
  }, [pathname])
  const locale = (lang ?? detected) as Lang

  const data: TrainingRecipePair[] =
    locale === 'es' ? pairsES :
    locale === 'el' ? pairsEL :
    pairsEN

  const looped = [...data, ...data]

  const learnMoreLabel =
    locale === 'es' ? 'Más información' :
    locale === 'el' ? 'Μάθε περισσότερα' :
    'Learn more'

  return (
    <section className="trSection" aria-labelledby="training-recipe-title">
      <header className="trHeader">
        <h2 id="training-recipe-title">
          {title ??
            (locale === 'es' ? 'Entrenamientos + Recetas' :
             locale === 'el' ? 'Προπονήσεις + Συνταγές' :
             'Training + Recipes')}
        </h2>
        <p className="trSubtitle">
          {subtitle ??
            (locale === 'es' ? 'Pares curados: lo que haces y cómo te alimentas.' :
             locale === 'el' ? 'Επιμελημένα ζευγάρια: τι κάνεις και πώς τρέφεσαι.' :
             'Curated pairs: what you do and how you fuel.')}
        </p>
      </header>

      <div className="trViewport" aria-live="off">
        <div className="trTrack" role="list">
          {looped.map((p, idx) => (
            <article className="trSlide" role="listitem" key={`${p.id}-${idx}`}>
              {/* Top: Training */}
              <Link
                className="trHalf trHalf--training"
                href={withLang(locale, p.trainingHref)}
                aria-label={p.trainingTitle}
              >
                <div className="trHalf__bg" style={{ backgroundImage: `url(${p.trainingImage})` }} />
                <div className="trHalf__overlay trHalf__overlay--training">
                  <span className="trKicker">
                    {locale === 'es' ? 'Entrenamiento' : locale === 'el' ? 'Προπόνηση' : 'Training'}
                  </span>
                  <h3 className="trTitle">{p.trainingTitle}</h3>
                  <p className="trBlurb">{p.trainingBlurb}</p>
                </div>
              </Link>

              {/* Bottom: Recipe */}
              <div className="trHalf trHalf--recipe">
                <div className="trHalf__bg trHalf__bg--dim" />
                <div className="trHalf__overlay trHalf__overlay--recipe">
                  <img src={p.recipeThumb} alt={p.recipeTitle} className="trRecipeThumb" />
                  <div className="trRecipeText">
                    <span className="trKicker">
                      {locale === 'es' ? 'Receta' : locale === 'el' ? 'Συνταγή' : 'Recipe'}
                    </span>
                    <h3 className="trTitle">{p.recipeTitle}</h3>
                    <p className="trBlurb">{p.recipeBlurb}</p>
                  </div>
                  <Link
                    className="cta-button-secondary cta-button-secondary--sm"
                    href={withLang(locale, p.recipeHref)}
                    aria-label={`${learnMoreLabel}: ${p.recipeTitle}`}
                  >
                    {learnMoreLabel}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrainingRecipe
