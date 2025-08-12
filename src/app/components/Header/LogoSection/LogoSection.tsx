'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import logo from '@/../public/assets/images/header/logo.svg'
import './LogoSection.css'

export default function LogoSection() {
  const pathname = usePathname()
  const lang = pathname?.split('/')[1] || 'en'

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
  )
}
