'use client';

import Link from 'next/link';
import './CTAButtonSecondary.css';

interface CTAButtonSecondaryProps {
  text: string;
  link: string;
  ariaLabel?: string;
}

const CTAButtonSecondary: React.FC<CTAButtonSecondaryProps> = ({ text, link, ariaLabel }) => {
  return (
    <Link
      href={link}
      className="cta-button-secondary"
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {text}
    </Link>
  );
};

export default CTAButtonSecondary;
