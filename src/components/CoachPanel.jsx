import React, { useState, useRef, useEffect } from 'react'
import { getSystemPrompt } from '../utils/prompt'

export default function CoachPanel({ sessionLogs }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: `You're here. That already counts.\n\nI have your full profile loaded — scores, targets, risk watches, the 4-year pattern. ${sessionLogs.length > 0 ? `${sessionLogs.length} session log${sessionLogs.length > 1 ? 's' : ''} absorbed from the Master Coach.` : 'Import session logs to deepen my understanding.'}\n\nWhat do you want to work on?` }])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (thinking || !input.trim()) return
    const text = input.trim(); setInput('')
    if (textareaRef.current) textareaRef.current.style.height = '40px'
    const userMsg = { role: 'user', content: text }
    setMessages(p => [...p, { role: 'user', content: text }])
    const newHistory = [...history, userMsg]; setHistory(newHistory); setThinking(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, system: getSystemPrompt(sessionLogs), messages: newHistory }) })
      const data = await res.json()
      const reply = data.error ? `Error: ${data.error.message || data.error}` : (data.content?.[0]?.text || 'Something went wrong.')
      setMessages(p => [...p, { role: 'assistant', content: reply }])
      setHistory(p => [...p, { role: 'assistant', content: reply }])
    } catch { setMessages(p => [...p, { role: 'assistant', content: 'Connection error. Try again.' }]) }
    setThinking(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <div style={{ padding: '12px 20px', borderBottom: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Coach</div>
        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{sessionLogs.length} sessions · haiku</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, maxWidth: '82%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: 'var(--bg3)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 500, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>{m.role === 'user' ? 'SC' : 'VM'}</div>
            <div style={{ padding: '9px 13px', borderRadius: 'var(--radius-lg)', background: m.role === 'user' ? 'var(--bg3)' : 'var(--bg2)', border: '0.5px solid var(--border)', fontSize: 13, lineHeight: 1.65, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{m.content}</div>
          </div>
        ))}
        {thinking && (
          <div style={{ display: 'flex', gap: 10, alignSelf: 'flex-start' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg3)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>VM</div>
            <div style={{ padding: '9px 14px', borderRadius: 'var(--radius-lg)', background: 'var(--bg2)', border: '0.5px solid var(--border)', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text3)', display: 'inline-block', animation: 'pulse 1.2s infinite', animationDelay: `${d}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '10px 16px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
        <textarea ref={textareaRef} value={input} onChange={e => { setInput(e.target.value); e.target.style.height = '40px'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Talk to your coach..." style={{ flex: 1, resize: 'none', height: 40, maxHeight: 120, background: 'var(--bg2)', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', padding: '10px 13px', fontSize: 13, fontFamily: 'var(--sans)', color: 'var(--text)', outline: 'none', lineHeight: 1.5 }} />
        <button onClick={send} disabled={thinking || !input.trim()} style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: thinking || !input.trim() ? 'var(--bg3)' : 'var(--accent)', border: '0.5px solid var(--border)', cursor: thinking || !input.trim() ? 'default' : 'pointer', color: thinking || !input.trim() ? 'var(--text3)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <style>{`@keyframes pulse{0%,80%,100%{opacity:0.2}40%{opacity:1}}`}</style>
    </div>
  )
}
