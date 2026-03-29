import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { getCheckins, PILLARS, BASELINE, formatDate, getVitality } from '../utils/storage'

const COLORS = { body: '#e05c5c', mind: '#c9a96e', social: '#5cad7a', career: '#6e9bc9', finance: '#d4954a', trading: '#a96ec9', awareness: '#5cc9c0' }

export default function ProgressPanel() {
  const [active, setActive] = useState('vitality')
  const checkins = getCheckins()

  const chartData = checkins.map(c => ({
    date: formatDate(c.date),
    vitality: parseFloat(getVitality(c.scores)),
    ...Object.fromEntries(PILLARS.map(p => [p.id, c.scores[p.id]]))
  }))

  const tabs = [{ id: 'vitality', label: 'Vitality' }, ...PILLARS.map(p => ({ id: p.id, label: p.label.split(' ')[0] }))]

  const baselineVal = active === 'vitality'
    ? parseFloat(getVitality(BASELINE))
    : BASELINE[active]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 720 }}>

        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--text)', marginBottom: 16 }}>Progress</div>

        {checkins.length < 2 ? (
          <div style={{ background: 'var(--bg2)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>Check in for at least 2 days to see your progress charts.</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActive(t.id)} style={{ padding: '5px 12px', borderRadius: 99, border: `0.5px solid ${active === t.id ? 'var(--accent)' : 'var(--border2)'}`, background: active === t.id ? 'rgba(201,169,110,0.12)' : 'transparent', color: active === t.id ? 'var(--accent)' : 'var(--text2)', fontSize: 11, fontFamily: 'var(--sans)', cursor: 'pointer' }}>{t.label}</button>
              ))}
            </div>

            <div style={{ background: 'var(--bg2)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 12 }}>{tabs.find(t => t.id === active)?.label} over time</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: 'var(--text3)' }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip contentStyle={{ background: 'var(--bg3)', border: '0.5px solid var(--border2)', borderRadius: 8, fontSize: 12, color: 'var(--text)' }} />
                  <ReferenceLine y={baselineVal} stroke="var(--border2)" strokeDasharray="3 3" label={{ value: 'baseline', fontSize: 9, fill: 'var(--text3)', position: 'insideTopRight' }} />
                  <Line type="monotone" dataKey={active} stroke={active === 'vitality' ? 'var(--accent)' : COLORS[active]} strokeWidth={2} dot={{ r: 3, fill: active === 'vitality' ? 'var(--accent)' : COLORS[active] }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {PILLARS.map(p => {
                const latest = checkins[checkins.length - 1]?.scores[p.id]
                const first = checkins[0]?.scores[p.id]
                const delta = latest - first
                return (
                  <div key={p.id} onClick={() => setActive(p.id)} style={{ background: 'var(--bg2)', border: `0.5px solid ${active === p.id ? 'var(--accent2)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '10px 12px', cursor: 'pointer' }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>{p.label.split(' ')[0]}</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{latest?.toFixed(1)}</div>
                    <div style={{ fontSize: 10, color: delta > 0 ? 'var(--success)' : delta < 0 ? 'var(--danger)' : 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>
                      {delta > 0 ? '+' : ''}{delta?.toFixed(1)}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
