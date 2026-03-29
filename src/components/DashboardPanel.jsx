import React from 'react'
import { getLatestScores, getVitality, PILLARS, BASELINE, getCheckins, getTrades, today, formatDate, HABITS, get } from '../utils/storage'

function getColor(score) {
  if (score >= 7) return 'var(--success)'
  if (score >= 4) return 'var(--warning)'
  return 'var(--danger)'
}

function getStreak(habitId) {
  const checkins = getCheckins().slice().reverse()
  let streak = 0
  const t = today()
  for (let i = 0; i < checkins.length; i++) {
    const c = checkins[i]
    if (c.habits && c.habits[habitId]) streak++
    else break
  }
  return streak
}

export default function DashboardPanel({ setTab }) {
  const scores = getLatestScores()
  const vitality = getVitality(scores)
  const checkins = getCheckins()
  const trades = getTrades()
  const todayCheckin = checkins.find(c => c.date === today())
  const totalPnl = trades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0)
  const daysLeft = Math.max(0, Math.ceil((new Date('2026-07-01') - new Date()) / 86400000))
  const intention = todayCheckin?.intention || null

  const topHabits = HABITS.slice(0, 4).map(h => ({ ...h, streak: getStreak(h.id) }))

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 780 }}>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--text)', marginBottom: 3 }}>
            {getGreeting()}, Sion.
          </div>
          {intention
            ? <div style={{ fontSize: 13, color: 'var(--accent)', fontStyle: 'italic' }}>Today's intention: "{intention}"</div>
            : <div style={{ fontSize: 13, color: 'var(--text3)' }}>No intention set — <span onClick={() => setTab('checkin')} style={{ color: 'var(--accent)', cursor: 'pointer' }}>check in now</span></div>
          }
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Vitality', value: `${vitality}/10`, color: getColor(parseFloat(vitality)) },
            { label: 'Days in rebuild', value: Math.max(0, Math.ceil((new Date() - new Date('2026-04-01')) / 86400000)), color: 'var(--text)' },
            { label: 'Days remaining', value: daysLeft, color: daysLeft < 30 ? 'var(--danger)' : 'var(--text)' },
            { label: 'Total P&L (₹)', value: (totalPnl >= 0 ? '+' : '') + totalPnl.toFixed(0), color: totalPnl >= 0 ? 'var(--success)' : 'var(--danger)' },
          ].map(m => (
            <div key={m.label} style={{ background: 'var(--bg2)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 5 }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <Card title="Pillar scores">
            {PILLARS.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text2)', minWidth: 130 }}>{p.label}</div>
                <div style={{ flex: 1, height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${(scores[p.id] / 10) * 100}%`, height: '100%', background: getColor(scores[p.id]), borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: getColor(scores[p.id]), minWidth: 24, textAlign: 'right' }}>{scores[p.id]}</div>
              </div>
            ))}
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card title="Habit streaks">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                {topHabits.map(h => (
                  <div key={h.id} style={{ background: 'var(--bg)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius)', padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3, lineHeight: 1.4 }}>{h.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 500, color: h.streak > 0 ? 'var(--accent)' : 'var(--text3)', fontFamily: 'var(--mono)' }}>{h.streak}<span style={{ fontSize: 10, color: 'var(--text3)' }}>d</span></div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Recent trades">
              {trades.slice(0, 3).length === 0
                ? <div style={{ fontSize: 12, color: 'var(--text3)', padding: '8px 0' }}>No trades logged yet.</div>
                : trades.slice(0, 3).map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `0.5px solid var(--border)` }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>{t.instrument}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{formatDate(t.date)} · {t.direction}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: parseFloat(t.pnl) >= 0 ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--mono)' }}>
                      {parseFloat(t.pnl) >= 0 ? '+' : ''}{parseFloat(t.pnl).toFixed(0)}
                    </div>
                  </div>
                ))
              }
            </Card>
          </div>
        </div>

        {!todayCheckin && (
          <div onClick={() => setTab('checkin')} style={{ background: 'var(--bg2)', border: `0.5px solid var(--accent2)`, borderRadius: 'var(--radius-lg)', padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>Daily check-in pending</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Log your scores, set your intention, track habits.</div>
            </div>
            <div style={{ fontSize: 18, color: 'var(--accent)' }}>→</div>
          </div>
        )}

      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function Card({ title, children }) {
  return (
    <div style={{ background: 'var(--bg2)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', letterSpacing: '0.05em', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}
