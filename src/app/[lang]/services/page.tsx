export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <main>
      <h1>Services Page - {lang}</h1>
      <p>This is where we’ll list our services.</p>
    </main>
  )
}
