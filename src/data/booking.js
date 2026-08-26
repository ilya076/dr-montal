const TIME_ZONE = 'Europe/Madrid'
const MAX_DAYS_AHEAD = 60
const MIN_LEAD_HOURS = 4

function dateParts(date) {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value]),
  )
}

export function toClinicDateInput(date = new Date()) {
  const { year, month, day } = dateParts(date)
  return `${year}-${month}-${day}`
}

export function addDays(dateIso, amount) {
  const date = new Date(`${dateIso}T12:00:00`)
  date.setDate(date.getDate() + amount)
  return toClinicDateInput(date)
}

export function bookingDateLimits() {
  const min = toClinicDateInput()
  return { min, max: addDays(min, MAX_DAYS_AHEAD) }
}

export function isClinicOpenDate(dateIso) {
  const weekday = new Date(`${dateIso}T12:00:00`).getDay()
  return weekday >= 1 && weekday <= 5
}

export function nextOpenDate() {
  const { min } = bookingDateLimits()
  for (let offset = 0; offset <= MAX_DAYS_AHEAD; offset += 1) {
    const candidate = addDays(min, offset)
    if (isClinicOpenDate(candidate)) return candidate
  }
  return min
}

export function previewSlots(dateIso) {
  if (!isClinicOpenDate(dateIso)) return []
  const weekday = new Date(`${dateIso}T12:00:00`).getDay()
  const windows = weekday === 5 ? [['09:00', '13:00']] : [['07:30', '13:00'], ['16:00', '19:30']]
  const earliest = Date.now() + MIN_LEAD_HOURS * 60 * 60 * 1000
  const slots = []

  windows.forEach(([from, to]) => {
    const [fromHour, fromMinute] = from.split(':').map(Number)
    const [toHour, toMinute] = to.split(':').map(Number)
    const cursor = new Date(`${dateIso}T00:00:00`)
    cursor.setHours(fromHour, fromMinute, 0, 0)
    const end = new Date(`${dateIso}T00:00:00`)
    end.setHours(toHour, toMinute, 0, 0)

    while (cursor.getTime() + 30 * 60 * 1000 <= end.getTime()) {
      const slotEnd = new Date(cursor.getTime() + 30 * 60 * 1000)
      if (cursor.getTime() >= earliest) {
        slots.push({
          start: cursor.toISOString(),
          end: slotEnd.toISOString(),
          label: cursor.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
        })
      }
      cursor.setMinutes(cursor.getMinutes() + 30)
    }
  })

  return slots
}

export function formatBookingDate(dateIso, language) {
  return new Intl.DateTimeFormat(language, {
    timeZone: TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${dateIso}T12:00:00`))
}
