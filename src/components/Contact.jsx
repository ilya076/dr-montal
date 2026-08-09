import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import SectionHeading from './SectionHeading'

export default function Contact({ t }) {
  const contactItems = [
    { icon: MapPin, label: t.contact.addressLabel, value: t.clinic.address },
    {
      icon: Phone,
      label: t.contact.phoneLabel,
      value: t.clinic.phone,
      href: `tel:${t.clinic.phone.replaceAll(' ', '')}`,
      ariaLabel: t.contact.callAria,
    },
    {
      icon: Mail,
      label: t.contact.emailLabel,
      value: t.clinic.email,
      href: `mailto:${t.clinic.email}`,
      ariaLabel: t.contact.emailAria,
    },
  ]

  return (
    <section id="contact" className="section-space scroll-mt-20 bg-ink text-white">
      <div className="page-shell">
        <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro} inverse />

        <div className="mt-14 grid gap-7 lg:grid-cols-[0.88fr_1.12fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 sm:p-8">
            <h3 className="text-2xl font-bold">{t.contact.infoTitle}</h3>
            <div className="mt-7 divide-y divide-white/10">
              {contactItems.map(({ icon: Icon, label, value, href, ariaLabel }) => {
                const content = (
                  <>
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-500/15 text-teal-200">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-[0.18em] text-teal-200">{label}</span>
                      <span className="mt-1 block break-words text-sm leading-6 text-slate-100 sm:text-base">{value}</span>
                    </span>
                  </>
                )

                return href ? (
                  <a
                    key={label}
                    href={href}
                    aria-label={ariaLabel}
                    className="flex gap-4 py-5 transition-colors hover:text-teal-200"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={label} className="flex gap-4 py-5">
                    {content}
                  </div>
                )
              })}
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 text-slate-700 shadow-2xl shadow-black/10 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <Clock3 aria-hidden="true" className="size-5" />
              </span>
              <h3 className="text-2xl font-bold text-ink">{t.contact.hoursTitle}</h3>
            </div>
            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.15em] text-slate-500">
                  <tr>
                    <th className="px-4 py-4 font-bold sm:px-6">{t.contact.dayHeader}</th>
                    <th className="px-4 py-4 font-bold sm:px-6">{t.contact.hoursHeader}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {t.contact.days.map(([day, hours]) => (
                    <tr key={day} className="transition-colors hover:bg-teal-50/50">
                      <th className="px-4 py-3.5 font-semibold text-ink sm:px-6">{day}</th>
                      <td className={`px-4 py-3.5 sm:px-6 ${hours === t.contact.closed ? 'font-semibold text-slate-400' : 'text-slate-600'}`}>
                        {hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
