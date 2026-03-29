import React, { useState, useEffect } from 'react'
import { PILLARS, HABITS, getCheckins, saveCheckin, today, getLatestScores } from '../utils/storage'

export default function CheckinPanel() {
  const existing = getCheckins().find(c => c.date === today())
  const latest = getLatestScores()

  const [scores, setScores] = useState(existing?.scores || { ...latest })
  const [intention, setIntention] = useState(existing?.intention || '')
  const [habits, setHabits] = useState(existing?.habits || {})
  const [avoidance, setAvoidance] = useState(existing?.avoidance || false)
  const [avoidanceTrigger, setAvoidanceTrigger] = useState(existing?.avoidanceTrigger || '')
  const [avoidanceAction, setAvoidanceAction] = useState(existing?.avoidanceAction || '')
  const [note, setNote] = useState(existing?.note || '')
  const [saved, setSaved] = useState(false)

  function getColor(score) {
    if (score >= 7) return 'var(--success)'
    if (score >= 4) return 'var(--warning)'
    return 'var(--danger)'
  }

  const save = () => {
    saveCheckin({ date: today(), scores, intention, habits, avoidance, avoidanceTrigger, avoidanceAction, note, savedAt: new Date().toISOString() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 620 }}>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--text)', marginBottom: 3 }}>Daily check-in</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{today()}</div>
        </div>

        <Section title="Morning intention">
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>One thing. What matters most today?</div>
          <input value={intention} onChange={e => setIntention(e.target.value)} placeholder="e.g. Execute the trading plan without hesitation..." style={inputStyle} />
        </Section>

        <Section title="Pillar scores">
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12 }}>Be honest. These scores build your progress charts.</div>
          {PILLARS.map(p => (
            <div key={p.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{p.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: getColor(scores[p.id]), fontFamily: 'var(--mono)' }}>{scores[p.id]?.toFixed(1)}</div>
              </div>
              <input type="range" min="0" max="10" step="0.1" value={scores[p.id] || 0}
                onChange={e => setScores(s => ({ ...s, [p.id]: parseFloat(e.target.value) }))}
                style={{ accentColor: getColor(scores[p.id]) }}
              />
            </div>
          ))}
        </Section>

        <Section title="Habit check">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {HABITS.map(h => (
              <label key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <div onClick={() => setHabits(prev => ({ ...prev, [h.id]: !prev[h.id] }))} style={{ width: 16, height: 16, borderRadius: 4, border: `0.5px solid ${habits[h.id] ? 'var(--accent)' : 'var(--border2)'}`, background: habits[h.id] ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                  {habits[h.id] && <span style={{ color: 'var(--bg)', fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text)' }}>{h.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{h.target}</div>
                </div>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Avoidance tracker">
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>Did the escape loop activate today?</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {['No', 'Yes'].map(v => (
              <button key={v} onClick={() => setAvoidance(v === 'Yes')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius)', border: `0.5px solid ${(v === 'Yes') === avoidance ? (v === 'Yes' ? 'var(--danger)' : 'var(--success)') : 'var(--border2)'}`, background: (v === 'Yes') === avoidance ? (v === 'Yes' ? 'rgba(224,92,92,0.1)' : 'rgba(92,173,122,0.1)') : 'transparent', color: (v === 'Yes') === avoidance ? (v === 'Yes' ? 'var(--danger)' : 'var(--success)') : 'var(--text2)', fontSize: 12, fontFamily: 'var(--sans)', cursor: 'pointer' }}>{v}</button>
            ))}
          </div>
          {avoidance && (
            <>
              <input value={avoidanceTrigger} onChange={e => setAvoidanceTrigger(e.target.value)} placeholder="What triggered it?" style={{ ...inputStyle, marginBottom: 8 }} />
              <input value={avoidanceAction} onChange={e => setAvoidanceAction(e.target.value)} placeholder="What did you do instead of the hard thing?" style={inputStyle} />
            </>
          )}
        </Section>

        <Section title="Day note">
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Anything else worth noting about today..." style={{ ...inputStyle, height: 80, resize: 'vertical' }} />
        </Section>

        <button onClick={save} style={{ width: '100%', padding: '11px', background: saved ? 'var(--success)' : 'var(--accent)', border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--bg)', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }}>
          {saved ? 'Saved ✓' : 'Save check-in'}
        </button>

      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--bg2)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: '14px 16px', marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', letterSpacing: '0.05em', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

const inputStyle = { width: '100%', background: 'var(--bg)', border: `0.5px solid var(--border2)`, borderRadius: 'var(--radius)', padding: '8px 11px', fontSize: 12, fontFamily: 'var(--sans)', color: 'var(--text)', outline: 'none', lineHeight: 1.5 }
