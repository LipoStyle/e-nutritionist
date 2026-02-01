type Lang = "en" | "es" | "el";

export const adminLoginUI: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    cta: string;
    back: string;
    errorPrefix: string;
  }
> = {
  en: {
    title: "Admin Login",
    subtitle: "Sign in to access the admin dashboard.",
    email: "Email",
    password: "Password",
    cta: "Sign in",
    back: "Back to Home",
    errorPrefix: "Error:",
  },
  es: {
    title: "Acceso Admin",
    subtitle: "Inicia sesión para acceder al panel de administración.",
    email: "Email",
    password: "Contraseña",
    cta: "Entrar",
    back: "Volver al Inicio",
    errorPrefix: "Error:",
  },
  el: {
    title: "Σύνδεση Admin",
    subtitle: "Συνδέσου για πρόσβαση στο admin dashboard.",
    email: "Email",
    password: "Κωδικός",
    cta: "Σύνδεση",
    back: "Πίσω στην Αρχική",
    errorPrefix: "Σφάλμα:",
  },
};
