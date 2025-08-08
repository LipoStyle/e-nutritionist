'use client';

import { useEffect, useState } from 'react';
import './Header.css';

import BurgerMenu from './BurgerMenu/BurgerMenu';
import Navbar from './NavBar/NavBar';
import LogoSection from './LogoSection/LogoSection';
import DarkModeToggle from '../buttons/DarkModeToggle';
import LanguagePicker from '../buttons/LanguagePicker';
import CTAButton from '../buttons/CTAButton';

type Lang = 'en' | 'es' | 'el';

type HeaderProps = {
  lang: Lang; // align with Navbar/Footer
};

const Header = ({ lang }: HeaderProps) => {
  const [scrolling, setScrolling] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 840;
      setIsMobile(mobile);
      if (!mobile) setBurgerOpen(false);
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setScrolling(window.scrollY > lastScrollY);
      lastScrollY = window.scrollY;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleBurger = () => setBurgerOpen(prev => !prev);
  const closeNavbar = () => setBurgerOpen(false);

  // Optional CTA translation (keep or remove if you prefer static text)
  const ctaText =
    lang === 'es'
      ? 'Reserva una consulta'
      : lang === 'el'
      ? 'Κλείσε ραντεβού'
      : 'Book a Consultation';

  return (
    <header className={`header ${scrolling ? 'hidden' : ''}`}>
      {/* 🔹 Top Bar */}
      <div className="header-top">
        {!isMobile && (
          <div className="header-features">
            <DarkModeToggle />
            <LanguagePicker />
          </div>
        )}

        {isMobile ? (
          <BurgerMenu isOpen={burgerOpen} toggleBurger={toggleBurger} />
        ) : (
          <Navbar isOpen={false} closeNavbar={closeNavbar} lang={lang} isMobile={false} />
        )}

        <CTAButton text={ctaText} link={`/${lang}/book-consultation`} />
      </div>

      {/* 🔹 Logo Row */}
      <div className="header-bottom">
        <LogoSection />
      </div>

      {/* 🔹 Mobile Slide Menu */}
      {isMobile && (
        <Navbar isOpen={burgerOpen} closeNavbar={closeNavbar} lang={lang} isMobile={true} />
      )}
    </header>
  );
};

export default Header;
