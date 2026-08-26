import { createHash } from 'node:crypto'
import { google } from 'googleapis'
import { DateTime, Interval } from 'luxon'

export const TIME_ZONE = 'Europe/Madrid'
export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'ilyauauaua2@gmail.com'
export const SLOT_MINUTES = 30
export const MIN_LEAD_HOURS = 4
export const MAX_DAYS_AHEAD = 60

export const SERVICES = new Set([
  'family-medicine',
  'medical-specialties',
  'nutrition',
  'certificates',
])

const WORKING_WINDOWS = {
  1: [['07:30', '13:00'], ['16:00', '19:30']],
  2: [['07:30', '13:00'], ['16:00', '19:30']],
  3: [['07:30', '13:00'], ['16:00', '19:30']],
  4: [['07:30', '13:00'], ['16:00', '19:30']],
  5: [['09:00', '13:00']],
}

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_PRIVATE_KEY

  if (!email || !rawKey) {
    const error = new Error('Google Calendar is not configured')
    error.code = 'CALENDAR_NOT_CONFIGURED'
    throw error
  }

  return new google.auth.JWT({
    email,
    key: rawKey.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
}

export function getCalendar() {
  return google.calendar({ version: 'v3', auth: getAuth() })
}

export function getDateBounds(now = DateTime.now().setZone(TIME_ZONE)) {
  return {
    min: now.startOf('day'),
    max: now.plus({ days: MAX_DAYS_AHEAD }).endOf('day'),
    earliest: now.plus({ hours: MIN_LEAD_HOURS }),
  }
}

export function getSlotsForDate(dateIso, now = DateTime.now().setZone(TIME_ZONE)) {
  const day = DateTime.fromISO(dateIso, { zone: TIME_ZONE })
  const { min, max, earliest } = getDateBounds(now)

  if (!day.isValid || day.toISODate() !== dateIso || day < min || day > max) return []

  const windows = WORKING_WINDOWS[day.weekday] || []
  const slots = []

  for (const [startTime, endTime] of windows) {
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    let cursor = day.set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 })
    const windowEnd = day.set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 })

    while (cursor.plus({ minutes: SLOT_MINUTES }) <= windowEnd) {
      const end = cursor.plus({ minutes: SLOT_MINUTES })
      if (cursor >= earliest) slots.push({ start: cursor, end })
      cursor = end
    }
  }

  return slots
}

export function isExactBookableSlot(startIso, now = DateTime.now().setZone(TIME_ZONE)) {
  const requested = DateTime.fromISO(startIso, { setZone: true }).setZone(TIME_ZONE)
  if (!requested.isValid) return null

  return getSlotsForDate(requested.toISODate(), now).find(
    ({ start }) => start.toMillis() === requested.toMillis(),
  ) || null
}

export async function getBusyWindows(calendar, timeMin, timeMax) {
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toUTC().toISO(),
      timeMax: timeMax.toUTC().toISO(),
      timeZone: TIME_ZONE,
      items: [{ id: CALENDAR_ID }],
    },
  })

  const calendarResult = response.data.calendars?.[CALENDAR_ID]
  if (calendarResult?.errors?.length) {
    const error = new Error('Calendar is not accessible')
    error.code = 'CALENDAR_ACCESS_DENIED'
    throw error
  }

  return (calendarResult?.busy || []).map(({ start, end }) =>
    Interval.fromDateTimes(DateTime.fromISO(start), DateTime.fromISO(end)),
  )
}

export function removeBusySlots(slots, busyWindows) {
  return slots.filter(({ start, end }) => {
    const slotInterval = Interval.fromDateTimes(start, end)
    return !busyWindows.some((busy) => busy.overlaps(slotInterval))
  })
}

export function serializeSlot({ start, end }) {
  return {
    start: start.toISO(),
    end: end.toISO(),
    label: start.toFormat('HH:mm'),
  }
}

export function slotEventId(startIso) {
  const digest = createHash('sha256').update(`${CALENDAR_ID}:${startIso}`).digest('hex')
  return `clinic${digest.slice(0, 46)}`
}

export function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : ''
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
