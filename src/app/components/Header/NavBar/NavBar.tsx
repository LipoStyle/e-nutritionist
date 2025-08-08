'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import './Navbar.css';
import DarkModeToggle from '@/app/components/buttons/DarkModeToggle';
import LanguagePicker from '@/app/components/buttons/LanguagePicker';

type Lang = 'en' | 'es' | 'el';

interface NavbarProps {
  isOpen: boolean;
  isMobile: boolean;
  closeNavbar: () => void;
  lang: Lang;
}

const Navbar = ({ isOpen, isMobile, closeNavbar, lang }: NavbarProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const translations = {
    en: { home: 'Home', services: 'Services', blogs: 'Blogs', recipes: 'Recipes', about: 'About', contact: 'Contact' },
    es: { home: 'Inicio', services: 'Servicios', blogs: 'Blog', recipes: 'Recetas', about: 'Acerca de', contact: 'Contacto' },
    el: { home: 'Αρχική', services: 'Υπηρεσίες', blogs: 'Άρθρα', recipes: 'Συνταγές', about: 'Σχετικά', contact: 'Επικοινωνία' },
  };

  const t = translations[lang] || translations.en;

  const isActive = (path: string) => mounted && pathname === `/${lang}${path}`;

  return (
    <nav className={`navbar ${isOpen ? 'active' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* 🌟 MOBILE UTILITIES SECTION */}
      {isMobile && (
        <div className="navbar-utilities">
          <DarkModeToggle />
          <LanguagePicker />
        </div>
      )}

      {/* 🌟 NAV LINKS */}
      <div className="navbar-links">
        <Link href={`/${lang}`} className={`nav-link ${isActive('') ? 'active' : ''}`} onClick={closeNavbar}>
          {t.home}
        </Link>
        <Link href={`/${lang}/services`} className={`nav-link ${isActive('/services') ? 'active' : ''}`} onClick={closeNavbar}>
          {t.services}
        </Link>
        <Link href={`/${lang}/blogs`} className={`nav-link ${isActive('/blogs') ? 'active' : ''}`} onClick={closeNavbar}>
          {t.blogs}
        </Link>
        <Link href={`/${lang}/recipes`} className={`nav-link ${isActive('/recipes') ? 'active' : ''}`} onClick={closeNavbar}>
          {t.recipes}
        </Link>
        <Link href={`/${lang}/about`} className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={closeNavbar}>
          {t.about}
        </Link>
        <Link href={`/${lang}/contact`} className={`nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={closeNavbar}>
          {t.contact}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
