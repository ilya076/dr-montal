import SectionHeading from './SectionHeading'

export default function Insurance({ t }) {
  return (
    <section className="section-space border-y border-slate-200 bg-white">
      <div className="page-shell">
        <SectionHeading eyebrow={t.insurance.eyebrow} title={t.insurance.title} intro={t.insurance.intro} />

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {t.insuranceLogos.map((logo) => {
            const provider = logo.replace('[LOGO ', '').replace(']', '')
            return (
              <div
                key={logo}
                role="img"
                aria-label={`${t.insurance.logoAriaPrefix} ${provider}`}
                className="grid min-h-28 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 text-center text-xs font-bold tracking-wider text-slate-500 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                {logo}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
