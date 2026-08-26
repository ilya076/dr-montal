import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Clock3, LoaderCircle, ShieldCheck, X } from 'lucide-react'
import BookingSuccess from './BookingSuccess'
import { bookingDateLimits, formatBookingDate, isClinicOpenDate, nextOpenDate, previewSlots } from '../data/booking'

const INITIAL_FORM = { name: '', email: '', phone: '', privacyAccepted: false, website: '' }

export default function BookingModal({ open, onClose, t, language }) {
  const [service, setService] = useState('family-medicine')
  const [date, setDate] = useState(nextOpenDate)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [state, setState] = useState({ kind: 'idle', code: '' })
  const [booking, setBooking] = useState(null)
  const [availabilityVersion, setAvailabilityVersion] = useState(0)
  const [limits] = useState(bookingDateLimits)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    setBooking(null)
    setForm(INITIAL_FORM)
    setSelectedSlot(null)
    window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    document.body.style.overflow = 'hidden'
    const handleKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open || !date) return undefined
    const controller = new AbortController()
    setSelectedSlot(null)
    setState({ kind: 'loading', code: '' })

    fetch(`/api/availability?date=${encodeURIComponent(date)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'CALENDAR_UNAVAILABLE')
        return payload.slots
      })
      .then((available) => {
        setSlots(available)
        setState({ kind: 'idle', code: '' })
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        if (import.meta.env.DEV) {
          setSlots(previewSlots(date))
          setState({ kind: 'preview', code: '' })
          return
        }
        setSlots([])
        setState({ kind: 'error', code: error.message })
      })

    return () => controller.abort()
  }, [availabilityVersion, date, open])

  if (!open) return null
  const selectedService = t.services.find(({ value }) => value === service)
  const formattedDate = formatBookingDate(date, language)

  async function submit(event) {
    event.preventDefault()
    if (!selectedSlot) return
    setState({ kind: 'submitting', code: '' })

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service, start: selectedSlot.start, locale: language }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'BOOKING_FAILED')
      setBooking(payload)
      setState({ kind: 'success', code: '' })
    } catch (error) {
      setState({ kind: 'error', code: error.message })
      if (error.message === 'SLOT_TAKEN') setSelectedSlot(null)
    }
  }

  const errorText = t.errors[state.code] || t.errors.BOOKING_FAILED

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/65 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="booking-title" className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur sm:px-8">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id="booking-title" className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{t.title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label={t.closeAria} className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        {booking ? (
          <BookingSuccess t={t} booking={booking} date={formattedDate} slot={selectedSlot.label} onClose={onClose} />
        ) : (
          <form onSubmit={submit} className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <label className="block text-sm font-bold text-ink" htmlFor="booking-service">{t.serviceLabel}</label>
              <select id="booking-service" value={service} onChange={(event) => setService(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink">
                {t.services.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>

              <label className="mt-5 block text-sm font-bold text-ink" htmlFor="booking-date">{t.dateLabel}</label>
              <input id="booking-date" type="date" min={limits.min} max={limits.max} value={date} onChange={(event) => setDate(event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-ink" />
              {!isClinicOpenDate(date) && <p className="mt-2 text-sm font-semibold text-amber-700">{t.closedDay}</p>}

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-ink">{t.timeLabel}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Clock3 aria-hidden="true" className="size-4" />{t.duration}</span>
              </div>
              {state.kind === 'loading' ? (
                <p role="status" className="mt-4 flex items-center gap-2 text-sm text-slate-500"><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />{t.loading}</p>
              ) : slots.length ? (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((slot) => <button key={slot.start} type="button" onClick={() => setSelectedSlot(slot)} aria-pressed={selectedSlot?.start === slot.start} className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition ${selectedSlot?.start === slot.start ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-200 text-ink hover:border-teal-300 hover:bg-teal-50'}`}>{slot.label}</button>)}
                </div>
              ) : state.kind !== 'error' ? <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{t.noSlots}</p> : null}

              <div className="mt-6 grid gap-2 rounded-2xl bg-teal-50 p-4 text-xs leading-5 text-teal-800">
                <p className="flex gap-2"><CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{t.smartHours}</p>
                <p className="flex gap-2"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{t.smartConflict}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
              <h3 className="text-lg font-bold text-ink">{t.detailsTitle}</h3>
              <p className="mt-1 text-sm leading-5 text-slate-500">{selectedService?.label} · <span className="capitalize">{formattedDate}</span>{selectedSlot ? ` · ${selectedSlot.label}` : ''}</p>
              <div className="mt-5 grid gap-4">
                {[['name', t.nameLabel, 'text'], ['email', t.emailLabel, 'email'], ['phone', t.phoneLabel, 'tel']].map(([field, label, type]) => (
                  <label key={field} className="text-sm font-bold text-ink">{label}<input type={type} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} required autoComplete={field === 'phone' ? 'tel' : field} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-ink" /></label>
                ))}
                <input type="text" name="website" value={form.website} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />
                <label className="flex gap-3 text-xs font-normal leading-5 text-slate-600"><input type="checkbox" checked={form.privacyAccepted} onChange={(event) => setForm((current) => ({ ...current, privacyAccepted: event.target.checked }))} required className="mt-1 size-4 rounded border-slate-300 text-teal-600" />{t.privacy}</label>
              </div>

              {state.kind === 'preview' && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">{t.previewNotice}</p>}
              {state.kind === 'error' && <div role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"><p>{errorText}</p>{state.code === 'SLOT_TAKEN' && <button type="button" onClick={() => setAvailabilityVersion((current) => current + 1)} className="mt-2 font-bold underline">{t.refreshSlots}</button>}</div>}

              <button type="submit" disabled={!selectedSlot || state.kind === 'submitting' || state.kind === 'preview'} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                {state.kind === 'submitting' && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}{state.kind === 'submitting' ? t.submitting : t.confirm}
              </button>
              <a href={`tel:${t.phoneHref}`} className="mt-3 block text-center text-xs font-semibold text-slate-500 hover:text-teal-700">{t.phoneFallback}</a>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
