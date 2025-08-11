// src/app/components/Footer/FooterSubscribe/translations.ts
export type Lang = 'en' | 'es' | 'el'

interface FooterSubscribeTranslation {
  title: string
  subtitle: string
  placeholder: string
  button: string
  success: string
  error: string
}

const t: Record<Lang, FooterSubscribeTranslation> = {
  en: {
    title: 'Subscribe to our newsletter',
    subtitle: 'Get tips, recipes, and updates straight to your inbox.',
    placeholder: 'Enter your email',
    button: 'Subscribe',
    success: 'Thanks for subscribing! Please check your inbox.',
    error: 'Please enter a valid email address.',
  },
  es: {
    title: 'Suscríbete a nuestro boletín',
    subtitle: 'Recibe consejos, recetas y novedades en tu correo.',
    placeholder: 'Introduce tu correo',
    button: 'Suscribirse',
    success: '¡Gracias por suscribirte! Revisa tu bandeja de entrada.',
    error: 'Por favor introduce un correo válido.',
  },
  el: {
    title: 'Εγγραφείτε στο ενημερωτικό δελτίο',
    subtitle: 'Λάβετε συμβουλές, συνταγές και νέα στο email σας.',
    placeholder: 'Πληκτρολογήστε το email σας',
    button: 'Εγγραφή',
    success: 'Ευχαριστούμε για την εγγραφή! Ελέγξτε το email σας.',
    error: 'Παρακαλώ εισάγετε ένα έγκυρο email.',
  },
}

export type { FooterSubscribeTranslation }
export default t
