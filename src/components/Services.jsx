import { Apple, BadgeCheck, FlaskConical, Stethoscope, UserRoundSearch } from 'lucide-react'
import SectionHeading from './SectionHeading'

const serviceIcons = [Stethoscope, UserRoundSearch, Apple, BadgeCheck]

export default function Services({ t }) {
  return (
    <section id="services" className="section-space scroll-mt-20 bg-white">
      <div className="page-shell">
        <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} intro={t.services.intro} />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {t.services.items.map((service, index) => {
            const Icon = serviceIcons[index]
            return (
              <article
                key={service.title}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-teal-200"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                  <Icon aria-hidden="true" className="size-7" strokeWidth={1.7} />
                </span>
                <h3 className="mt-6 text-xl font-bold text-ink">{service.title}</h3>
                {service.subtitle && <p className="mt-2 text-sm font-semibold leading-6 text-teal-700">{service.subtitle}</p>}
                <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
              </article>
            )
          })}
        </div>

        <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-4 rounded-2xl border border-teal-100 bg-teal-50/80 px-6 py-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-teal-700 shadow-sm">
            <FlaskConical aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">{t.services.supportingLabel}</p>
            <p className="mt-1 font-bold text-ink">{t.services.laboratory}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
