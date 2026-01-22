"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/header/Header.css";

import DarkModeToggle from "../buttons/DarkModeToggle";
import LanguagePicker from "../buttons/LanguagePicker";
import Navbar from "./NavBar/NavBar";
import LogoSection from "./LogoSection/LogoSection";
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import CTAButton from "../buttons/CTAButton";

type Lang = "en" | "es" | "el";

export default function Header() {
  const params = useParams<{ lang?: Lang }>();
  const lang: Lang = params?.lang ?? "en";

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
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleBurger = () => setBurgerOpen((prev) => !prev);
  const closeNavbar = () => setBurgerOpen(false);

  // CTA translation (move to a shared file later)
  const ctaText =
    lang === "es"
      ? "Reserva una consulta"
      : lang === "el"
      ? "Κλείσε ραντεβού"
      : "Book a Consultation";

  return (
    <header className={`header ${scrolling ? "hidden" : ""}`}>
      <div className="header-top">
        {!isMobile && (
          <div className="header-features">
            <DarkModeToggle />
            <Suspense fallback={null}>
              <LanguagePicker />
            </Suspense>
          </div>
        )}

        {isMobile ? (
          <BurgerMenu isOpen={burgerOpen} toggleBurger={toggleBurger} />
        ) : (
          <Navbar
            isOpen={false}
            closeNavbar={closeNavbar}
            lang={lang}
            isMobile={false}
          />
        )}

        <CTAButton
          text={ctaText}
          link="https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA="
        />
      </div>

      <div className="header-bottom">
        <LogoSection />
      </div>

      {isMobile && (
        <Navbar
          isOpen={burgerOpen}
          closeNavbar={closeNavbar}
          lang={lang}
          isMobile={true}
        />
      )}
    </header>
  );
}
