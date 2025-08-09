import LogoSection from '../Header/LogoSection/LogoSection';
import './Footer.css';
import footerTranslations from './translations';

type Lang = 'en' | 'es' | 'el';

type FooterProps = {
  lang: Lang;
};

const Footer = ({ lang }: FooterProps) => {
  const t = footerTranslations[lang] ?? footerTranslations.en;
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <LogoSection />
      <div className="footer__container">
        <p className="footer__copy">
          © {year} E-Nutritionist — {t.rights}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
