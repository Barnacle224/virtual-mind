export const PILLARS = [
  { id: 'body', label: 'Body + Health' },
  { id: 'mind', label: 'Mind + Creativity' },
  { id: 'social', label: 'Social + Belonging' },
  { id: 'career', label: 'Career + Academics' },
  { id: 'finance', label: 'Financial Habits' },
  { id: 'trading', label: 'Trading' },
  { id: 'awareness', label: 'Self-Awareness' },
]

export const BASELINE = { body: 1.8, mind: 3.0, social: 2.5, career: 4.8, finance: 2.2, trading: 3.5, awareness: 8.5 }

export const HABITS = [
  { id: 'gym', label: 'Gym session', target: 'Daily' },
  { id: 'trading', label: 'Trading session', target: 'Daily' },
  { id: 'reading', label: 'Read (any amount)', target: 'Daily' },
  { id: 'noWeed', label: 'Weed-free day', target: 'Daily' },
  { id: 'tracking', label: 'Tracked every rupee', target: 'Daily' },
  { id: 'spoke', label: 'Gave opinion or spoke first', target: 'Daily' },
  { id: 'creative', label: 'Sketch or paint', target: 'Weekly' },
]

export function get(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}

export function set(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function today() {
  return new Date().toISOString().split('T')[0]
}

export function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function getCheckins() { return get('vm_checkins', []) }
export function saveCheckin(entry) {
  const checkins = getCheckins().filter(c => c.date !== entry.date)
  set('vm_checkins', [...checkins, entry].sort((a, b) => a.date.localeCompare(b.date)))
}

export function getTrades() { return get('vm_trades', []) }
export function saveTrade(trade) {
  const trades = getTrades()
  const idx = trades.findIndex(t => t.id === trade.id)
  if (idx >= 0) trades[idx] = trade
  else trades.unshift(trade)
  set('vm_trades', trades)
}
export function deleteTrade(id) { set('vm_trades', getTrades().filter(t => t.id !== id)) }

export function getLatestScores() {
  const checkins = getCheckins()
  if (checkins.length === 0) return BASELINE
  return checkins[checkins.length - 1].scores
}

export function getVitality(scores) {
  const vals = Object.values(scores)
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
}
