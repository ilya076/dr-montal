import { HeartPulse, Menu, Phone, X } from 'lucide-react'
import LanguageToggle from './LanguageToggle'

export default function Header({ t, language, onLanguageChange, menuOpen, onMenuToggle, activeSection }) {
  const navItems = [
    ['home', t.nav.home],
    ['services', t.nav.services],
    ['team', t.nav.team],
    ['contact', t.nav.contact],
  ]

  const handleNavClick = () => {
    if (menuOpen) onMenuToggle()
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between gap-4">
        <a href="#home" className="flex min-w-0 items-center gap-3" onClick={handleNavClick}>
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-teal-600 text-white shadow-sm">
            <HeartPulse aria-hidden="true" className="size-6" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold text-ink sm:text-base">{t.clinic.name}</span>
            <span className="block truncate text-xs font-medium text-teal-700">{t.clinic.doctor}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t.nav.ariaLabel}>
          {navItems.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? 'page' : undefined}
              className={`relative rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeSection === id ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              {label}
              <span
                className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-teal-500 transition-transform ${
                  activeSection === id ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle
            language={language}
            options={t.languageOptions}
            onChange={onLanguageChange}
            label={t.nav.languageLabel}
          />
          <a
            href={`tel:${t.clinic.phone.replaceAll(' ', '')}`}
            aria-label={t.contact.callAria}
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-700"
          >
            <Phone aria-hidden="true" className="size-4" />
            {t.nav.call}
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={onMenuToggle}
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-ink lg:hidden"
        >
          {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-slate-200 bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
          menuOpen ? 'max-h-[34rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="page-shell space-y-4 py-5">
          <nav className="grid gap-1" aria-label={t.nav.ariaLabel}>
            {navItems.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={handleNavClick}
                aria-current={activeSection === id ? 'page' : undefined}
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                  activeSection === id ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
          <LanguageToggle
            language={language}
            options={t.languageOptions}
            onChange={onLanguageChange}
            label={t.nav.languageLabel}
            compact
          />
          <a
            href={`tel:${t.clinic.phone.replaceAll(' ', '')}`}
            aria-label={t.contact.callAria}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white"
          >
            <Phone aria-hidden="true" className="size-4" />
            {t.nav.call}
          </a>
        </div>
      </div>
    </header>
  )
}
