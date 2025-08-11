'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import './DarkModeToggle.css'
import moonIcon from '@/../public/assets/images/buttons/moon.svg'
import sunIcon from '@/../public/assets/images/buttons/sun.svg'

const DarkModeToggle: React.FC = () => {
  // null until we read localStorage on client to avoid SSR mismatch
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null)

  useEffect(() => {
    // prefer saved theme; fallback to dark (your current behavior)
    const saved = localStorage.getItem('theme')
    const initialIsDark = saved ? saved === 'dark' : true

    setIsDarkMode(initialIsDark)

    const root = document.documentElement
    root.classList.toggle('dark-mode', initialIsDark)
    root.classList.toggle('light-mode', !initialIsDark)
  }, [])

  const toggleDarkMode = () => {
    if (isDarkMode === null) return
    const next = !isDarkMode
    setIsDarkMode(next)

    const root = document.documentElement
    root.classList.toggle('dark-mode', next)
    root.classList.toggle('light-mode', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  // Avoid hydration mismatch by not rendering until mounted
  if (isDarkMode === null) return null

  const isDark = isDarkMode

  return (
    <button
      type="button"
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={`toggle-bar ${isDark ? 'dark' : 'light'}`}>
        <Image
          src={isDark ? moonIcon : sunIcon}
          alt={isDark ? 'Dark mode' : 'Light mode'}
          className="toggle-icon"
          width={20}
          height={20}
          priority
        />
      </div>
    </button>
  )
}

export default DarkModeToggle
