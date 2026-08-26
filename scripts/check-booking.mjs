import assert from 'node:assert/strict'
import { DateTime, Interval } from 'luxon'
import {
  TIME_ZONE,
  getSlotsForDate,
  isExactBookableSlot,
  removeBusySlots,
  slotEventId,
} from '../api/_lib/booking.js'
import availabilityHandler from '../api/availability.js'
import bookingsHandler from '../api/bookings.js'

const now = DateTime.fromISO('2026-08-26T06:00:00', { zone: TIME_ZONE })
const monday = getSlotsForDate('2026-08-31', now)
const friday = getSlotsForDate('2026-08-28', now)

assert.equal(monday.length, 18, 'Monday–Thursday must expose 18 half-hour slots')
assert.equal(monday[0].start.toFormat('HH:mm'), '07:30')
assert.equal(monday.at(-1).start.toFormat('HH:mm'), '19:00')
assert.equal(friday.length, 8, 'Friday must expose 8 half-hour slots')
assert.equal(getSlotsForDate('2026-08-29', now).length, 0, 'Saturday must be closed')
assert.equal(getSlotsForDate('2026-08-25', now).length, 0, 'Past dates must be rejected')
assert.equal(isExactBookableSlot('2026-08-31T07:45:00+02:00', now), null, 'Off-grid times must be rejected')

const busy = [Interval.fromDateTimes(monday[1].start, monday[1].end)]
const free = removeBusySlots(monday, busy)
assert.equal(free.length, monday.length - 1, 'Busy slots must be removed')
assert(!free.some(({ start }) => start.equals(monday[1].start)))

assert.equal(slotEventId(monday[0].start.toISO()), slotEventId(monday[0].start.toISO()), 'Slot IDs must be deterministic')
assert.notEqual(slotEventId(monday[0].start.toISO()), slotEventId(monday[1].start.toISO()), 'Every slot must have a unique ID')

function responseCapture() {
  const result = { headers: {} }
  return {
    result,
    response: {
      setHeader(name, value) { result.headers[name] = value },
      status(code) { result.status = code; return this },
      json(payload) { result.payload = payload; return this },
    },
  }
}

const invalidRequest = responseCapture()
await bookingsHandler(
  { method: 'POST', headers: { host: 'localhost' }, body: { name: '' } },
  invalidRequest.response,
)
assert.equal(invalidRequest.result.status, 400, 'Invalid booking payloads must be rejected before calendar access')

const invalidDate = responseCapture()
await availabilityHandler(
  { method: 'GET', query: { date: '1999-01-01' } },
  invalidDate.response,
)
assert.equal(invalidDate.result.status, 200)
assert.deepEqual(invalidDate.result.payload.slots, [], 'Past dates must never return availability')

console.log('Booking schedule, validation, conflict filtering, and deduplication: PASS')
