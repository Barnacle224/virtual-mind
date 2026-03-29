import React, { useState } from 'react'
import { getTrades, saveTrade, deleteTrade, today } from '../utils/storage'

const empty = () => ({ id: Date.now().toString(), date: today(), instrument: '', direction: 'Long', entry: '', exit: '', quantity: '', pnl: '', strategy: '', emotion: 'Neutral', followedPlan: true, notes: '' })

export default function TradingPanel() {
  const [trades, setTrades] = useState(getTrades)
  const [form, setForm] = useState(null)
  const [tab, setTab] = useState('log')

  const refresh = () => setTrades(getTrades())

  const handleSave = () => {
    if (!form.instrument) return
    const pnl = form.pnl || ((parseFloat(form.exit) - parseFloat(form.entry)) * (form.direction === 'Long' ? 1 : -1) * parseFloat(form.quantity) || 0)
    saveTrade({ ...form, pnl: parseFloat(pnl).toFixed(2) })
    refresh(); setForm(null)
  }

  const handleDelete = (id) => { deleteTrade(id); refresh() }

  const totalPnl = trades.reduce((s, t) => s + parseFloat(t.pnl || 0), 0)
  const winners = trades.filter(t => parseFloat(t.pnl) > 0).length
  const winRate = trades.length > 0 ? Math.round((winners / trades.length) * 100) : 0
  const planFollowed = trades.length > 0 ? Math.round((trades.filter(t => t.followedPlan).length / trades.length) * 100) : 0

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--text)' }}>Trading Journal</div>
          <button onClick={() => setForm(empty())} style={{ padding: '7px 14px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius)', fontSize: 12, fontFamily: 'var(--sans)', color: 'var(--bg)', cursor: 'pointer', fontWeight: 500 }}>+ Log trade</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Total P&L (₹)', value: (totalPnl >= 0 ? '+' : '') + totalPnl.toFixed(0), color: totalPnl >= 0 ? 'var(--success)' : 'var(--danger)' },
            { label: 'Total trades', value: trades.length, color: 'var(--text)' },
            { label: 'Win rate', value: `${winRate}%`, color: winRate >= 50 ? 'var(--success)' : 'var(--warning)' },
            { label: 'Plan followed', value: `${planFollowed}%`, color: planFollowed >= 70 ? 'var(--success)' : 'var(--danger)' },
          ].map(m => (
            <div key={m.label} style={{ background: 'var(--bg2)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 5 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: m.color, fontFamily: 'var(--mono)' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {form && (
          <div style={{ background: 'var(--bg2)', border: `0.5px solid var(--border2)`, borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 12 }}>New trade</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              {[
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'instrument', label: 'Instrument', placeholder: 'e.g. NIFTY, RELIANCE' },
                { key: 'entry', label: 'Entry price', type: 'number' },
                { key: 'exit', label: 'Exit price', type: 'number' },
                { key: 'quantity', label: 'Quantity', type: 'number' },
                { key: 'pnl', label: 'P&L (₹) — auto if blank', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{f.label}</div>
                  <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>Direction</div>
                <select value={form.direction} onChange={e => setForm(p => ({ ...p, direction: e.target.value }))} style={inputStyle}>
                  <option>Long</option><option>Short</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>Emotion</div>
                <select value={form.emotion} onChange={e => setForm(p => ({ ...p, emotion: e.target.value }))} style={inputStyle}>
                  {['Calm', 'Confident', 'Anxious', 'FOMO', 'Revenge', 'Neutral'].map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>Followed plan?</div>
                <select value={form.followedPlan ? 'Yes' : 'No'} onChange={e => setForm(p => ({ ...p, followedPlan: e.target.value === 'Yes' }))} style={inputStyle}>
                  <option>Yes</option><option>No</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>Strategy / notes</div>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="What was the setup? What happened?" style={{ ...inputStyle, height: 60, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSave} style={{ flex: 1, padding: '8px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius)', fontSize: 12, fontFamily: 'var(--sans)', color: 'var(--bg)', cursor: 'pointer', fontWeight: 500 }}>Save trade</button>
              <button onClick={() => setForm(null)} style={{ padding: '8px 16px', background: 'transparent', border: `0.5px solid var(--border2)`, borderRadius: 'var(--radius)', fontSize: 12, fontFamily: 'var(--sans)', color: 'var(--text2)', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {trades.length === 0 ? (
          <div style={{ background: 'var(--bg2)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>No trades logged yet.</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Your trading journal starts with your first live trade.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {trades.map(t => (
              <div key={t.id} style={{ background: 'var(--bg2)', border: `0.5px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{t.instrument}</div>
                    <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 99, background: t.direction === 'Long' ? 'rgba(92,173,122,0.12)' : 'rgba(224,92,92,0.12)', color: t.direction === 'Long' ? 'var(--success)' : 'var(--danger)', border: `0.5px solid ${t.direction === 'Long' ? 'var(--success)' : 'var(--danger)'}` }}>{t.direction}</span>
                    {!t.followedPlan && <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 99, background: 'rgba(212,149,74,0.12)', color: 'var(--warning)', border: '0.5px solid var(--warning)' }}>off-plan</span>}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                    {t.date} · {t.emotion} · entry {t.entry} → exit {t.exit}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 500, color: parseFloat(t.pnl) >= 0 ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--mono)' }}>
                    {parseFloat(t.pnl) >= 0 ? '+' : ''}₹{Math.abs(parseFloat(t.pnl)).toFixed(0)}
                  </div>
                  <button onClick={() => handleDelete(t.id)} style={{ fontSize: 10, color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', background: 'var(--bg)', border: `0.5px solid var(--border2)`, borderRadius: 'var(--radius)', padding: '7px 10px', fontSize: 12, fontFamily: 'var(--sans)', color: 'var(--text)', outline: 'none' }
