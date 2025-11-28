import { resolveLocale } from './../i18n/utils'
import { getHeroSettings } from '@/lib/hero'
import './test.css'

type Lang = 'en' | 'es' | 'el'

export default async function HomePage({ params }: { params: { lang: Lang } }) {
  const { lang } = params
  const locale = resolveLocale(lang) as Lang

  await getHeroSettings('home', locale)

  return (
    <>
      <div className="curved-text-wrapper test">
        <svg viewBox="0 0 300 80" width="300">
          <path id="curveUp" d="M10,60 Q150 0 290,60" fill="transparent" />
          <text className="curved-text">
            <textPath href="#curveUp">test</textPath>
          </text>
        </svg>
      </div>
    </>
  )
}
