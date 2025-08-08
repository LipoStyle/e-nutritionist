export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <main>
      <h1>Contact Page - {lang}</h1>
      <p>Contact form will go here.</p>
    </main>
  )
}
