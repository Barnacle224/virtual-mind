import React, { useState } from 'react'

export default function ImportPanel({ sessionLogs, addSession, removeSession }) {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const handleImport = () => {
    if (!content.trim()) { showToast('Paste a session log first'); return }
    const t = title.trim() || `Session ${sessionLogs.length + 1}`
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    addSession({ title: t, content: content.trim(), date })
    setContent(''); setTitle('')
    showToast(`"${t}" absorbed`)
  }

  const exportCtx = () => {
    const blob = new Blob([JSON.stringify({ sessionLogs, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'vm-context.json'; a.click(); URL.revokeObjectURL(url)
    showToast('Exported')
  }

  const importFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { try { const d = JSON.parse(ev.target.result); if (d.sessionLogs) { d.sessionLogs.forEach(s => addSession(s)); showToast(`${d.sessionLogs.length} sessions restored`) } } catch { showToast('Invalid file') } }
    reader.readAsText(file); e.target.value = ''
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 600 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--text)', marginBottom: 4 }}>Import session</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>Paste the compressed import summary from your Master Coach session. The Virtual Mind absorbs it and grows sharper.</div>

        <Card>
          <Label>Session log</Label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your compressed session summary here..." style={{ ...iStyle, height: 140, marginTop: 8, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder={`Session title (e.g. Session ${sessionLogs.length + 1} · ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`} style={{ ...iStyle, flex: 1 }} />
            <button onClick={handleImport} style={{ padding: '8px 16px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius)', fontSize: 12, fontFamily: 'var(--sans)', color: 'var(--bg)', cursor: 'pointer', fontWeight: 500, flexShrink: 0 }}>Absorb</button>
          </div>
        </Card>

        <Card>
          <Label>Imported sessions ({sessionLogs.length})</Label>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sessionLogs.length === 0 && <div style={{ fontSize: 12, color: 'var(--text3)', padding: '6px 0' }}>No sessions yet.</div>}
            {sessionLogs.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{s.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 1 }}>{s.date} · {s.content.split(' ').length} words</div>
                </div>
                <button onClick={() => removeSession(i)} style={{ fontSize: 11, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', padding: '4px 8px' }}>Remove</button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Label>Backup and restore</Label>
          <div style={{ fontSize: 12, color: 'var(--text2)', margin: '6px 0 10px', lineHeight: 1.6 }}>Export your session logs as JSON. Import to restore on any device.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={exportCtx}>Export</Btn>
            <Btn onClick={() => document.getElementById('imp-file').click()}>Import</Btn>
            <input type="file" id="imp-file" accept=".json" style={{ display: 'none' }} onChange={importFile} />
          </div>
        </Card>
      </div>
      {toast && <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--text)', color: 'var(--bg)', padding: '7px 16px', borderRadius: 99, fontSize: 12, zIndex: 200, whiteSpace: 'nowrap' }}>{toast}</div>}
    </div>
  )
}

const iStyle = { width: '100%', background: 'var(--bg)', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', padding: '8px 11px', fontSize: 12, fontFamily: 'var(--sans)', color: 'var(--text)', outline: 'none', lineHeight: 1.5 }
function Card({ children }) { return <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', marginBottom: 12 }}>{children}</div> }
function Label({ children }) { return <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>{children}</div> }
function Btn({ onClick, children }) { return <button onClick={onClick} style={{ padding: '7px 14px', background: 'transparent', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', fontSize: 12, fontFamily: 'var(--sans)', color: 'var(--text)', cursor: 'pointer' }}>{children}</button> }
