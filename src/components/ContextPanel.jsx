import React from 'react'
import { getSystemPrompt } from '../utils/prompt'

export default function ContextPanel({ sessionLogs }) {
  const prompt = getSystemPrompt(sessionLogs)
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 660 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--text)', marginBottom: 4 }}>Context</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>The exact system prompt loaded into every coaching conversation. Full transparency.</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          {[{ label: 'Sessions', value: sessionLogs.length }, { label: 'Words', value: prompt.split(' ').length.toLocaleString() }, { label: 'Est. tokens', value: Math.round(prompt.length / 4).toLocaleString() }].map(m => (
            <div key={m.label} style={{ flex: 1, background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 13px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'var(--mono)', color: 'var(--text)' }}>{m.value}</div>
            </div>
          ))}
        </div>
        <textarea readOnly value={prompt} style={{ width: '100%', height: 460, resize: 'vertical', background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '13px 15px', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', outline: 'none', lineHeight: 1.7 }} />
      </div>
    </div>
  )
}
