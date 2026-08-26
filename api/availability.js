import {
  getBusyWindows,
  getCalendar,
  getSlotsForDate,
  removeBusySlots,
  serializeSlot,
} from './_lib/booking.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  try {
    const slots = getSlotsForDate(String(req.query.date || ''))
    if (!slots.length) return res.status(200).json({ slots: [] })

    const calendar = getCalendar()
    const busy = await getBusyWindows(calendar, slots[0].start, slots.at(-1).end)
    return res.status(200).json({ slots: removeBusySlots(slots, busy).map(serializeSlot) })
  } catch (error) {
    console.error('availability_error', { code: error.code, message: error.message })
    const status = error.code === 'CALENDAR_NOT_CONFIGURED' ? 503 : 502
    return res.status(status).json({ error: error.code || 'CALENDAR_UNAVAILABLE' })
  }
}
