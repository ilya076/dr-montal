import { CalendarPlus, CheckCircle2, MapPin } from 'lucide-react'

export default function BookingSuccess({ t, booking, date, slot, onClose }) {
  return (
    <div className="px-6 py-10 text-center sm:px-10">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 aria-hidden="true" className="size-8" />
      </span>
      <h3 className="mt-5 text-2xl font-bold text-ink">{t.successTitle}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">{t.successBody}</p>

      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-teal-100 bg-teal-50 p-5 text-left">
        <p className="font-bold capitalize text-ink">{date}</p>
        <p className="mt-1 text-lg font-bold text-teal-700">{slot}</p>
        <p className="mt-3 flex gap-2 text-sm leading-5 text-slate-600">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal-600" />
          {t.location}
        </p>
      </div>

      <a
        href={booking.calendarUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-teal-700 sm:w-auto"
      >
        <CalendarPlus aria-hidden="true" className="size-5" />
        {t.addToGoogle}
      </a>
      <button type="button" onClick={onClose} className="mt-3 block w-full text-sm font-semibold text-slate-500 hover:text-ink">
        {t.close}
      </button>
    </div>
  )
}
