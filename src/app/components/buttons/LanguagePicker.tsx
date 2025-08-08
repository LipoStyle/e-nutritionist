'use client';

import { usePathname, useRouter } from 'next/navigation';
import './LanguagePicker.css';

const LanguagePicker: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split('/').filter(Boolean);
  const currentLang = segments[0] || 'en';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const restOfPath = segments.slice(1).join('/');
    const newPath = `/${newLang}/${restOfPath}`;
    router.push(newPath);
  };

  return (
    <select
      className="language-picker"
      value={currentLang}
      onChange={handleLanguageChange}
    >
      <option value="en">🇬🇧 English</option>
      <option value="es">🇪🇸 Español</option>
      <option value="el">🇬🇷 Greek</option>
    </select>
  );
};

export default LanguagePicker;
