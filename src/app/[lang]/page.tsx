export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <main>
      
      <h1>Home Page - Language: {lang}</h1>
      <p>Welcome to E-Nutritionist</p>
      <p>Welcome to E-Nutritionist</p>
      <p>Welcome to E-Nutritionist</p>
      <p>Welcome to E-Nutritionist</p>
      <p>Welcome to E-Nutritionist</p>
      <p>Welcome to E-Nutritionist</p>
      <p>Welcome to E-Nutritionist</p>
      <p>Welcome to E-Nutritionist</p>
     
    </main>
  )
}
