import { ArrowRight, Heart, ShieldCheck, Star } from 'lucide-react'
import PlaceholderImage from './PlaceholderImage'

export default function Hero({ t, onBook }) {
  return (
    <section id="home" className="scroll-mt-20 overflow-hidden bg-gradient-to-br from-white via-teal-50/70 to-slate-100 pt-20">
      <div className="page-shell grid min-h-[calc(100vh-5rem)] items-center gap-14 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-2xl text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-ink sm:text-6xl lg:text-7xl">
            {t.hero.title}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">{t.hero.body}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBook}
              aria-label={t.nav.bookAria}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-teal-600/15 transition hover:-translate-y-0.5 hover:bg-teal-700"
            >
              {t.hero.primaryCta}
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-6 py-4 text-sm font-bold text-ink transition hover:border-teal-300 hover:bg-white hover:text-teal-700"
            >
              {t.hero.secondaryCta}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-slate-200 pt-7">
            <div>
              <div className="flex items-center gap-1 text-amber-500" aria-label={t.hero.ratingAria}>
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} aria-hidden="true" className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-sm font-bold text-ink">{t.hero.rating}</p>
              <p className="text-xs text-slate-500">{t.hero.reviews}</p>
            </div>
            <span className="hidden h-10 w-px bg-slate-200 sm:block" />
            <div>
              <p className="text-sm font-bold text-ink">{t.clinic.doctor}</p>
              <p className="text-sm text-teal-700">{t.hero.category}</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <span className="absolute -right-16 -top-16 size-56 rounded-full bg-teal-200/40 blur-3xl" />
          <span className="absolute -bottom-16 -left-16 size-64 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="relative h-[29rem] sm:h-[36rem]">
            <PlaceholderImage label={t.hero.imageLabel} ariaLabel={t.hero.imageAria} className="shadow-card" />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 flex items-center gap-4 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur sm:left-8 sm:right-auto sm:max-w-xs sm:p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-700">
              <ShieldCheck aria-hidden="true" className="size-6" />
            </span>
            <div>
              <p className="font-bold text-ink">{t.hero.badgeTitle}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{t.hero.badgeBody}</p>
            </div>
            <Heart aria-hidden="true" className="ml-auto hidden size-5 text-teal-300 sm:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
