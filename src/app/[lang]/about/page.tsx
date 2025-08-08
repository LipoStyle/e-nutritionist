export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <main>
      <h1>About Page - {lang}</h1>
      <p>This page will describe E-Nutritionist.</p>
    </main>
  )
}
