'use client';

import Link from 'next/link';
import './CTAButton.css';

interface CTAButtonProps {
  text: string;
  link: string;
}

const CTAButton: React.FC<CTAButtonProps> = ({ text, link }) => {
  return (
    <Link href={link} className="cta-button">
      {text}
    </Link>
  );
};

export default CTAButton;
