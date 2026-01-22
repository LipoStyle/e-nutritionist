"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import logo from "@/public/assets/headerlogo/logo.svg";
import "@/styles/header/LogoSection.css";

type Params = { lang?: "en" | "es" | "el" };

export default function LogoSection() {
  const params = useParams<Params>();
  const lang = params?.lang ?? "en";

  return (
    <div className="homepg-logo">
      <Link href={`/${lang}`} className="logo-link">
        <div className="logo-pack">
          <Image
            src={logo}
            alt="Logo"
            className="logo-img"
            width={120}
            height={40}
            priority
          />
          <div className="logo-text">
            <p className="author-name">Thymios Arvanitis</p>
            <p className="author-job">Nutritionist</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
