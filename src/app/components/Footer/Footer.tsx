import './Footer.css';
import footerTranslations from './translations';

type FooterProps = {
  lang: 'en' | 'es' | 'el';
};

const Footer = ({ lang }: FooterProps) => {
  const t = footerTranslations[lang] ?? footerTranslations.en;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-newsletter">
          <h3>{t.newsletterTitle}</h3>
          <p>{t.newsletterDescription}</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder={t.placeholder}
              aria-label="Email"
              required
            />
            <button type="submit">{t.subscribe}</button>
          </form>
        </div>

        <div className="footer-social">
          <p>{t.followUs}</p>
          {/* Add your social media icons/links here */}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} E-Nutritionist</span>
        <span>{t.rights}</span>
      </div>
    </footer>
  );
};

export default Footer;
