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
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = supportedLangs.includes(lang as Lang) ? (lang as Lang) : 'en'

  return (
    <html lang={safeLang}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
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
