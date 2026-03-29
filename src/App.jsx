import React, { useState } from 'react'
import DashboardPanel from './components/DashboardPanel'
import CheckinPanel from './components/CheckinPanel'
import ProgressPanel from './components/ProgressPanel'
import HabitsPanel from './components/HabitsPanel'
import TradingPanel from './components/TradingPanel'
import CoachPanel from './components/CoachPanel'
import ImportPanel from './components/ImportPanel'
import ContextPanel from './components/ContextPanel'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'checkin', label: 'Check-in', icon: '◉' },
  { id: 'progress', label: 'Progress', icon: '◎' },
  { id: 'habits', label: 'Habits', icon: '◇' },
  { id: 'trading', label: 'Trading', icon: '◆' },
  { id: 'coach', label: 'Coach', icon: '◐' },
  { id: 'import', label: 'Import', icon: '◌' },
  { id: 'context', label: 'Context', icon: '○' },
]

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [sessionLogs, setSessionLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vm_sessions') || '[]') } catch { return [] }
  })

  const saveSessions = (logs) => { setSessionLogs(logs); localStorage.setItem('vm_sessions', JSON.stringify(logs)) }
  const addSession = (log) => saveSessions([...sessionLogs, log])
  const removeSession = (i) => saveSessions(sessionLogs.filter((_, idx) => idx !== i))

  const panels = { dashboard: <DashboardPanel setTab={setTab} />, checkin: <CheckinPanel />, progress: <ProgressPanel />, habits: <HabitsPanel />, trading: <TradingPanel />, coach: <CoachPanel sessionLogs={sessionLogs} />, import: <ImportPanel sessionLogs={sessionLogs} addSession={addSession} removeSession={removeSession} />, context: <ContextPanel sessionLogs={sessionLogs} /> }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside className="sidebar" style={{ width: 190, flexShrink: 0, borderRight: `0.5px solid var(--border)`, display: 'flex', flexDirection: 'column', padding: '20px 0', background: 'var(--bg2)' }}>
        <div style={{ padding: '0 18px 20px' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 17, color: 'var(--text)', lineHeight: 1.2 }}>Virtual<br />Mind</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, fontFamily: 'var(--mono)' }}>v3.0 · Sion C.</div>
        </div>
        <div style={{ padding: '0 10px', flex: 1, overflowY: 'auto' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{ width: '100%', textAlign: 'left', background: tab === n.id ? 'var(--bg3)' : 'transparent', border: tab === n.id ? `0.5px solid var(--border2)` : '0.5px solid transparent', borderRadius: 'var(--radius)', padding: '7px 10px', cursor: 'pointer', color: tab === n.id ? 'var(--text)' : 'var(--text2)', fontSize: 12, fontFamily: 'var(--sans)', marginBottom: 1, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: tab === n.id ? 'var(--accent)' : 'var(--text3)' }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '14px 18px 0', borderTop: `0.5px solid var(--border)` }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{sessionLogs.length} sessions loaded</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </aside>

      <main className="main-content" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {panels[tab]}
      </main>

      <nav className="mobile-nav" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg2)', borderTop: `0.5px solid var(--border)`, zIndex: 100, overflowX: 'auto' }}>
        <div style={{ display: 'flex', minWidth: 'max-content', padding: '0 4px' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: tab === n.id ? 'var(--accent)' : 'var(--text3)', fontSize: 9, fontFamily: 'var(--sans)', minWidth: 56 }}>
              <span style={{ fontSize: 14 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
