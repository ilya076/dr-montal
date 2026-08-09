import PlaceholderImage from './PlaceholderImage'
import SectionHeading from './SectionHeading'

export default function Gallery({ t }) {
  return (
    <section className="section-space bg-mist">
      <div className="page-shell">
        <SectionHeading eyebrow={t.gallery.eyebrow} title={t.gallery.title} intro={t.gallery.intro} />

        <div className="mt-14 grid auto-rows-[16rem] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.gallery.captions.map((caption, index) => (
            <figure
              key={caption}
              className={`${index === 0 || index === 5 ? 'lg:col-span-2' : ''} relative overflow-hidden rounded-3xl`}
            >
              <PlaceholderImage
                label={t.gallery.imageLabel}
                ariaLabel={`${t.gallery.imageAriaPrefix} ${caption}`}
                className="!rounded-3xl"
                compact
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-ink shadow-sm backdrop-blur-sm">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
