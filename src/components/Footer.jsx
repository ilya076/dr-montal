import { Camera, HeartPulse, Mail, MapPin, Phone, Share2 } from 'lucide-react'

export default function Footer({ t }) {
  const navItems = [
    ['home', t.nav.home],
    ['services', t.nav.services],
    ['team', t.nav.team],
    ['contact', t.nav.contact],
  ]

  return (
    <footer className="border-t border-white/10 bg-[#0f282f] text-slate-300">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.45fr_0.7fr_1.1fr_0.7fr]">
        <div>
          <a href="#home" className="inline-flex items-center gap-3 text-white">
            <span className="grid size-11 place-items-center rounded-2xl bg-teal-600">
              <HeartPulse aria-hidden="true" className="size-6" />
            </span>
            <span>
              <span className="block font-bold">{t.clinic.name}</span>
              <span className="block text-xs text-teal-200">{t.clinic.doctor}</span>
            </span>
          </a>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">{t.footer.description}</p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">{t.footer.navTitle}</h2>
          <nav className="mt-4 grid gap-3" aria-label={t.nav.ariaLabel}>
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="text-sm transition-colors hover:text-teal-200">
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">{t.footer.contactTitle}</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <p className="flex gap-3 leading-6">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-teal-300" />
              {t.clinic.address}
            </p>
            <a href={`tel:${t.clinic.phone.replaceAll(' ', '')}`} aria-label={t.contact.callAria} className="flex items-center gap-3 hover:text-teal-200">
              <Phone aria-hidden="true" className="size-4 text-teal-300" />
              {t.clinic.phone}
            </a>
            <a href={`mailto:${t.clinic.email}`} aria-label={t.contact.emailAria} className="flex items-center gap-3 break-all hover:text-teal-200">
              <Mail aria-hidden="true" className="size-4 shrink-0 text-teal-300" />
              {t.clinic.email}
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">{t.footer.followTitle}</h2>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label={t.footer.instagramLabel} className="grid size-11 place-items-center rounded-xl border border-white/10 text-teal-200 transition hover:bg-white/10">
              <Camera aria-hidden="true" className="size-5" />
            </a>
            <a href="#" aria-label={t.footer.facebookLabel} className="grid size-11 place-items-center rounded-xl border border-white/10 text-teal-200 transition hover:bg-white/10">
              <Share2 aria-hidden="true" className="size-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-shell py-6 text-center text-xs text-slate-500">
          {t.meta.copyrightSymbol} {new Date().getFullYear()} {t.clinic.name}. {t.footer.copyright}
        </div>
      </div>
    </footer>
  )
}
