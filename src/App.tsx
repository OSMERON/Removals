import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Prices from './components/Prices'
import Services from './components/Services'
import AreasCovered from './components/AreasCovered'
import WhyUs from './components/WhyUs'
import Reviews from './components/Reviews'
import Galery from './components/Gallery'
// import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // init from storage or OS
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      document.documentElement.classList.add(stored)
      return
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = prefersDark ? 'dark' : 'light'
    setTheme(initial)
    document.documentElement.classList.add(initial)
  }, [])

  // apply on change
  useEffect(() => {
    const other = theme === 'light' ? 'dark' : 'light'
    document.documentElement.classList.remove(other)
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle theme"
        type="button"
      >
        {theme === 'light' ? 'Switch to Iron Man' : 'Switch to Thor'}
      </button>

      <Hero />
      <Services />
      <Prices />
      <AreasCovered />
      <WhyUs />
      <Reviews />
      <Galery />
      {/* <FAQ /> */}
      <Contact />
      <Footer />
    </>
  )
}