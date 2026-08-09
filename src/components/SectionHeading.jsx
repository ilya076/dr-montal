export default function SectionHeading({ eyebrow, title, intro, align = 'center', inverse = false }) {
  const center = align === 'center'

  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
      <p className={`eyebrow ${inverse ? '!text-teal-200' : ''}`}>{eyebrow}</p>
      <h2 className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${inverse ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 text-base leading-7 sm:text-lg ${inverse ? 'text-teal-50/80' : 'text-slate-600'}`}>
          {intro}
        </p>
      )}
    </div>
  )
}
