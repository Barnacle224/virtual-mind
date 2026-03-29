import React from 'react'
import { PILLARS, BASELINE, getLatestScores, getVitality } from '../utils/storage'

function getColor(s) { return s >= 7 ? 'var(--success)' : s >= 4 ? 'var(--warning)' : 'var(--danger)' }

const TARGETS = ['Live trading with written strategy + risk rules', 'Gym minimum 4× per week', '1 book per month — fiction counts', 'Weed reduction with hard limits defined', 'Track every rupee spent', 'Speak first or give opinion daily', 'Sketch or paint at least once per week']
const RISKS = ['Trading avoidance despite capital ready', 'Weed during active trading sessions', 'Passive credits-only mindset at internship', 'No industry vertical chosen before Year 2', 'Last-moment avoidance in high-stakes moments']

export default function ProfilePanel() {
  const scores = getLatestScores()
  const vitality = getVitality(scores)
  const daysLeft = Math.max(0, Math.ceil((new Date('2026-07-01') - new Date()) / 86400000))

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 680 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 22, marginBottom: 3 }}>Sion Chakrabarti</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10 }}>MBA Data Analytics · SIMS Pune · Year 1 · Internship rebuild: Apr–Jun 2026</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          {['Data Scientist', 'Trader in training', 'Author', 'Builder'].map(t => <span key={t} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 99, border: '0.5px solid var(--border2)', color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{t}</span>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[{ label: 'Overall vitality', value: `${vitality}/10` }, { label: 'Self-awareness', value: '8.5/10' }, { label: 'Rebuild days left', value: daysLeft }].map(m => (
            <div key={m.label} style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '13px 15px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 5 }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500 }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 12 }}>Pillar scores</div>
          {PILLARS.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', minWidth: 150 }}>{p.label}</div>
              <div style={{ flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 2 }}>
                <div style={{ width: `${(scores[p.id] / 10) * 100}%`, height: '100%', background: getColor(scores[p.id]), borderRadius: 2, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: getColor(scores[p.id]), minWidth: 28, textAlign: 'right' }}>{scores[p.id]}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 36 }}>({BASELINE[p.id]})</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 10 }}>Rebuild targets · Apr–Jun 2026</div>
            {TARGETS.map(t => <div key={t} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><div style={{ width: 13, height: 13, borderRadius: 3, border: '0.5px solid var(--border2)', flexShrink: 0, marginTop: 1 }} /><div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.55 }}>{t}</div></div>)}
          </div>
          <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 10 }}>Critical risk watches</div>
            {RISKS.map(r => <div key={r} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0, marginTop: 4 }} /><div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.55 }}>{r}</div></div>)}
          </div>
        </div>
      </div>
    </div>
  )
}
