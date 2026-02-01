import Link from "next/link";
import "@/styles/admin-login.css";
import { adminSignIn } from "./actions";
import { adminLoginUI } from "./admin-login.data";
import { buildLocaleHref } from "@/lib/i18n/locale";

type Lang = "en" | "es" | "el";

type Props = {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const sp = await searchParams;
  const ui = adminLoginUI[lang];

  return (
    <section className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">{ui.title}</h1>
        <p className="admin-login__subtitle">{ui.subtitle}</p>

        {sp.error ? (
          <p className="admin-login__error">
            <strong>{ui.errorPrefix}</strong> {sp.error}
          </p>
        ) : null}

        <form
          className="admin-login__form"
          action={adminSignIn.bind(null, lang)}
        >
          <label className="admin-login__label">
            {ui.email}
            <input
              className="admin-login__input"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </label>

          <label className="admin-login__label">
            {ui.password}
            <input
              className="admin-login__input"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>

          <button className="admin-login__btn" type="submit">
            {ui.cta}
          </button>
        </form>

        <Link className="admin-login__back" href={buildLocaleHref(lang, "/")}>
          {ui.back}
        </Link>
      </div>
    </section>
  );
}
