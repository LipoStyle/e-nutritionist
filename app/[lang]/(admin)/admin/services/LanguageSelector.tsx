"use client";

import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

const SUPPORTED_LOCALES = [
  { code: "en", label: "English" },
  { code: "el", label: "Ελληνικά" },
  { code: "es", label: "Español" },
];

export default function LanguageSelector({
  currentLang,
}: {
  currentLang: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;

    // Replace the first segment of the path (the lang) with the new one
    // Example: /en/admin/services -> /el/admin/services
    const segments = pathname.split("/");
    segments[1] = newLang;
    const newPath = segments.join("/");

    router.push(newPath);
  };

  return (
    <div className="lang-select-wrapper">
      <Globe size={14} className="lang-icon" />
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        className="lang-dropdown"
      >
        {SUPPORTED_LOCALES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
