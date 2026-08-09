import PlaceholderImage from './PlaceholderImage'
import SectionHeading from './SectionHeading'

export default function Team({ t }) {
  return (
    <section id="team" className="section-space scroll-mt-20 bg-mist">
      <div className="page-shell">
        <SectionHeading eyebrow={t.team.eyebrow} title={t.team.title} intro={t.team.subtitle} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.team.people.map(([name, specialty, description]) => (
            <article key={name} className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-card">
              <div className="h-64">
                <PlaceholderImage
                  label={t.team.photoLabel}
                  ariaLabel={`${t.team.photoAriaPrefix} ${name}`}
                  className="!rounded-[1.25rem]"
                  compact
                />
              </div>
              <div className="px-3 pb-4 pt-5">
                <h3 className="text-lg font-bold text-ink">{name}</h3>
                <p className="mt-1 text-sm font-semibold text-teal-700">{specialty}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
