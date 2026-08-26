import {
  CALENDAR_ID,
  SERVICES,
  TIME_ZONE,
  cleanText,
  getBusyWindows,
  getCalendar,
  isExactBookableSlot,
  isValidEmail,
  slotEventId,
} from './_lib/booking.js'

function parseBody(req) {
  if (typeof req.body === 'string') return JSON.parse(req.body)
  return req.body || {}
}

function validate(payload) {
  const data = {
    name: cleanText(payload.name, 80),
    email: cleanText(payload.email, 120).toLowerCase(),
    phone: cleanText(payload.phone, 30),
    service: cleanText(payload.service, 40),
    locale: ['ca', 'es', 'en'].includes(payload.locale) ? payload.locale : 'ca',
    start: cleanText(payload.start, 80),
    privacyAccepted: payload.privacyAccepted === true,
    website: cleanText(payload.website, 120),
  }

  if (data.website) return { error: 'INVALID_REQUEST' }
  if (data.name.length < 2) return { error: 'INVALID_NAME' }
  if (!isValidEmail(data.email)) return { error: 'INVALID_EMAIL' }
  if (data.phone.replace(/\D/g, '').length < 7) return { error: 'INVALID_PHONE' }
  if (!SERVICES.has(data.service)) return { error: 'INVALID_SERVICE' }
  if (!data.privacyAccepted) return { error: 'PRIVACY_REQUIRED' }

  const slot = isExactBookableSlot(data.start)
  if (!slot) return { error: 'INVALID_SLOT' }
  return { data, slot }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  if (Number(req.headers['content-length'] || 0) > 10_000) {
    return res.status(413).json({ error: 'INVALID_REQUEST' })
  }

  const origin = req.headers.origin
  const host = req.headers.host
  if (origin && host && new URL(origin).host !== host) {
    return res.status(403).json({ error: 'INVALID_REQUEST' })
  }

  try {
    const validation = validate(parseBody(req))
    if (validation.error) return res.status(400).json({ error: validation.error })

    const { data, slot } = validation
    const calendar = getCalendar()
    const busy = await getBusyWindows(calendar, slot.start, slot.end)
    if (busy.length) return res.status(409).json({ error: 'SLOT_TAKEN' })

    const eventId = slotEventId(slot.start.toUTC().toISO())
    await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: {
        id: eventId,
        summary: 'Cita — Centre Mèdic la Garriga',
        description: [
          `Nom: ${data.name}`,
          `Servei: ${data.service}`,
          `Telèfon: ${data.phone}`,
          `Email: ${data.email}`,
          `Idioma: ${data.locale}`,
          'Reserva creada des del web.',
        ].join('\n'),
        location: 'Carrer Calàbria, 17, Bajos, 08530 La Garriga, Barcelona',
        start: { dateTime: slot.start.toISO(), timeZone: TIME_ZONE },
        end: { dateTime: slot.end.toISO(), timeZone: TIME_ZONE },
        visibility: 'private',
        reminders: {
          useDefault: false,
          overrides: [{ method: 'popup', minutes: 60 }],
        },
        extendedProperties: {
          private: { source: 'dr-montal-web', patientEmail: data.email },
        },
      },
    })

    return res.status(201).json({
      bookingId: eventId,
      start: slot.start.toISO(),
      end: slot.end.toISO(),
      calendarUrl: buildPatientCalendarUrl(slot.start, slot.end),
    })
  } catch (error) {
    if (error?.code === 409) return res.status(409).json({ error: 'SLOT_TAKEN' })
    console.error('booking_error', { code: error.code, message: error.message })
    const status = error.code === 'CALENDAR_NOT_CONFIGURED' ? 503 : 502
    return res.status(status).json({ error: error.code || 'BOOKING_FAILED' })
  }
}

function buildPatientCalendarUrl(start, end) {
  const format = (date) => date.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Cita — Centre Mèdic la Garriga',
    dates: `${format(start)}/${format(end)}`,
    location: 'Carrer Calàbria, 17, Bajos, 08530 La Garriga, Barcelona',
    details: 'Reserva confirmada amb Centre Mèdic la Garriga — Dr. Montal.',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
