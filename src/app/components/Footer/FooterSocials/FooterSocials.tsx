'use client';

import './FooterSocials.css';

type Social = {
  name: string;
  href: string;
  iconClass: string; // Font Awesome class
  label: string;
};

const socials: Social[] = [
  { name: 'Instagram', href: 'https://instagram.com/', iconClass: 'fa-brands fa-instagram', label: 'Visit Instagram' },
  { name: 'TikTok',    href: 'https://tiktok.com/',    iconClass: 'fa-brands fa-tiktok',     label: 'Visit TikTok' },
  { name: 'LinkedIn',  href: 'https://linkedin.com/',  iconClass: 'fa-brands fa-linkedin-in', label: 'Visit LinkedIn' },
  { name: 'YouTube',   href: 'https://youtube.com/',   iconClass: 'fa-brands fa-youtube',     label: 'Visit YouTube' },
  { name: 'Pinterest', href: 'https://pinterest.com/', iconClass: 'fa-brands fa-pinterest-p', label: 'Visit Pinterest' },
  { name: 'Facebook',  href: 'https://facebook.com/',  iconClass: 'fa-brands fa-facebook-f',  label: 'Visit Facebook' },
  { name: 'Twitter',   href: 'https://twitter.com/',   iconClass: 'fa-brands fa-twitter',     label: 'Visit Twitter' },
];

const FooterSocials = () => {
  return (
    <div className="footer-socials" aria-label="Social media links">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="social-btn"
          title={s.name}
        >
          <i className={s.iconClass} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
};

export default FooterSocials;
