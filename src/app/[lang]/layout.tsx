import Header from '@/app/components/Header/Header'

import Footer from '../components/Footer/Footer'
import '../../styles/global.css'

const supportedLangs = ['en', 'es', 'el'] as const
type Lang = (typeof supportedLangs)[number]

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const { lang } = await params

  // ✅ Narrow 'lang' to 'Lang' or fallback to 'en'
  const safeLang: Lang = supportedLangs.includes(lang as Lang) ? (lang as Lang) : 'en'

  return (
    <html lang={safeLang}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-pap7x1Aq6+Sm+9..." // update or shorten as needed
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Header lang={safeLang} />
        {children}
        <Footer lang={safeLang} />
      </body>
    </html>
  )
}
