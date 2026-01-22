"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "@/styles/buttons/LanguagePicker.css";

const SUPPORTED = new Set(["en", "es", "el"]);

const LanguagePicker: React.FC = () => {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const router = useRouter();

  const segs = pathname.split("/").filter(Boolean);
  const hasLang = segs[0] && SUPPORTED.has(segs[0]);
  const currentLang = hasLang ? segs[0]! : "en";
  const rest = hasLang ? segs.slice(1).join("/") : segs.join("/");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const nextPath = `/${newLang}${rest ? `/${rest}` : ""}`;
    const qs = searchParams.toString();
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.push(`${nextPath}${qs ? `?${qs}` : ""}${hash}`);
  };

  return (
    <select
      className="language-picker"
      value={currentLang}
      onChange={handleLanguageChange}
      aria-label="Select language"
    >
      <option value="en">🇬🇧 English</option>
      <option value="es">🇪🇸 Español</option>
      <option value="el">🇬🇷 Greek</option>
    </select>
  );
};

export default LanguagePicker;
