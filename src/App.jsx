import { useEffect, useState } from 'react'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Header from './components/Header'
import Hero from './components/Hero'
import Insurance from './components/Insurance'
import Services from './components/Services'
import Team from './components/Team'
import { translations } from './data/translations'

const observedSections = ['home', 'services', 'team', 'contact']
const bookingUrl = 'https://calendar.app.google/Ecr2vpaTYAKdjB7B7'

export default function App() {
  const [language, setLanguage] = useState('ca')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const t = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.meta.pageTitle
    let description = document.querySelector('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = t.meta.pageDescription
  }, [language, t.meta.pageDescription, t.meta.pageTitle])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.1, 0.35] },
    )

    observedSections.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a
        href="#home"
        className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white transition-transform focus:translate-y-0"
      >
        {t.skipLink}
      </a>
      <Header
        t={t}
        language={language}
        onLanguageChange={(nextLanguage) => {
          setLanguage(nextLanguage)
          setMenuOpen(false)
        }}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        activeSection={activeSection}
        bookingUrl={bookingUrl}
      />
      <main>
        <Hero t={t} bookingUrl={bookingUrl} />
        <Services t={t} />
        <Team t={t} />
        <Insurance t={t} />
        <Gallery t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  )
}
