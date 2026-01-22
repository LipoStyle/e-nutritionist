"use client";

import Link from "next/link";
import "@/styles/buttons/CTAButton.css";

interface CTAButtonProps {
  text: string;
  link: string;
  ariaLabel?: string; // optional
}

const CTAButton: React.FC<CTAButtonProps> = ({ text, link, ariaLabel }) => {
  return (
    <Link
      href={link}
      className="cta-button"
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})} // only add if provided
    >
      {text}
    </Link>
  );
};

export default CTAButton;
