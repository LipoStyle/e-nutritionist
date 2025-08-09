import LogoSection from '../Header/LogoSection/LogoSection';
import './Footer.css';
import FooterNavs from './FooterNavs/FooterNavs';
import FooterSocials from './FooterSocials/FooterSocials';
import FooterSubscribe from './FooterSubscribe/FooterSubscribe';
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
      <FooterSubscribe lang={lang} />
      <FooterNavs lang={lang} />
       <FooterSocials />
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
