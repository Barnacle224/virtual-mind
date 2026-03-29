import React from 'react'
import { HABITS, getCheckins, today } from '../utils/storage'

function getStreak(habitId, checkins) {
  const sorted = checkins.slice().sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  for (const c of sorted) {
    if (c.habits?.[habitId]) streak++
    else break
  }
  return streak
}

function getLast30(habitId, checkins) {
  const last30 = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const checkin = checkins.find(c => c.date === dateStr)
    last30.push({ date: dateStr, done: checkin?.habits?.[habitId] || false })
  }
  return last30
}

function getBest(habitId, checkins) {
  const sorted = checkins.slice().sort((a, b) => a.date.localeCompare(b.date))
  let best = 0, current = 0
  for (const c of sorted) {
    if (c.habits?.[habitId]) { current++; best = Math.max(best, current) }
    else current = 0
  }
  return best
}

export default function HabitsPanel() {
  const checkins = getCheckins()
  const todayCheckin = checkins.find(c => c.date === today())

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 680 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--text)', marginBottom: 4 }}>Habits</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 18 }}>Log habits in the daily check-in. This tracks your streaks.</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HABITS.map(h => {
            const streak = getStreak(h.id, checkins)
            const best = getBest(h.id, checkins)
            const last30 = getLast30(h.id, checkins)
            const todayDone = todayCheckin?.habits?.[h.id] || false
            const completionRate = checkins.length > 0
              ? Math.round((checkins.filter(c => c.habits?.[h.id]).length / checkins.length) * 100)
              : 0

            return (
              <div key={h.id} style={{ background: 'var(--bg2)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {h.label}
                      {todayDone && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'rgba(92,173,122,0.15)', color: 'var(--success)', border: '0.5px solid var(--success)' }}>done today</span>}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>{h.target}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: streak > 0 ? 'var(--accent)' : 'var(--text3)', fontFamily: 'var(--mono)', lineHeight: 1 }}>{streak}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>day streak</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                  {last30.map((day, i) => (
                    <div key={i} style={{ flex: 1, height: 6, borderRadius: 1, background: day.done ? 'var(--accent)' : 'var(--bg3)', opacity: day.date === today() ? 1 : 0.7 }} title={day.date} />
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>best: <span style={{ color: 'var(--text2)' }}>{best}d</span></div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>completion: <span style={{ color: 'var(--text2)' }}>{completionRate}%</span></div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>total: <span style={{ color: 'var(--text2)' }}>{checkins.filter(c => c.habits?.[h.id]).length}d</span></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
