'use client'

import Image from 'next/image'
import Link from 'next/link'

import logo from '@/../public/assets/images/header/logo.svg'
import './LogoSection.css'

const LogoSection = () => {
  return (
    <div className="homepg-logo">
      <Link href="/" className="logo-link">
        <div className="logo-pack">
          <Image src={logo} alt="Logo" className="logo-img" />
          <div className="logo-text">
            <p className="author-name">Thymios Arvanitis</p>
            <p className="author-job">Nutritionist</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default LogoSection
