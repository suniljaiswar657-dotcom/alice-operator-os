"use client";

import { FormEvent, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };
const departments = [
  { name: "General", icon: "✦", detail: "Your all-purpose operator" },
  { name: "Research", icon: "⌕", detail: "Understand topics and evidence" },
  { name: "Strategy", icon: "◈", detail: "Plans, decisions and growth" },
  { name: "Developer", icon: "</>", detail: "Code, debug and build" },
  { name: "Business", icon: "▥", detail: "Offers, operations and revenue" },
  { name: "Automation", icon: "⟳", detail: "Workflows and repeatable tasks" },
  { name: "QA", icon: "✓", detail: "Test, review and improve" },
  { name: "Launch", icon: "↗", detail: "Ship and publish projects" }
];

export default function Home() {
  const [department, setDepartment] = useState("General");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = prompt.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setPrompt("");
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, department })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setMessages([...next, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark">A</span><span>ALICE<span className="brand-sub">OPERATOR OS</span></span></a>
        <div className="side-label">WORKSPACE</div>
        <button className="new-chat" onClick={() => { setMessages([]); setError(""); }}>＋ <span>New session</span></button>
        <div className="side-label department-label">DEPARTMENTS</div>
        <nav className="departments">
          {departments.map((item) => (
            <button key={item.name} className={department === item.name ? "department active" : "department"} onClick={() => setDepartment(item.name)}>
              <span className="dept-icon">{item.icon}</span><span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom"><span className="status-dot" /> Operator core <span className="version">V0.1</span></div>
      </aside>

      <section className="main-panel">
        <header className="topbar"><div className="mobile-brand"><span className="brand-mark">A</span> ALICE</div><div className="top-context">WORKSPACE <span>/</span> {department.toUpperCase()}</div><div className="secure"><span className="status-dot" /> PRIVATE SESSION</div></header>
        <div className="content">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR AI OPERATING SYSTEM</div>
          <h1>Make work move<br /><span>at the speed of thought.</span></h1>
          <p className="intro">One intelligent workspace for research, strategy, building and execution.</p>

          {messages.length === 0 ? (
            <>
              <div className="section-heading"><span>CHOOSE A DEPARTMENT</span><span className="section-rule" /></div>
              <div className="department-grid">
                {departments.map((item) => (
                  <button key={item.name} className={department === item.name ? "department-card selected" : "department-card"} onClick={() => setDepartment(item.name)}>
                    <span className="card-icon">{item.icon}</span><span className="card-name">{item.name}</span><span className="card-detail">{item.detail}</span><span className="card-arrow">↗</span>
                  </button>
                ))}
              </div>
              <div className="suggestion-row"><span>TRY</span><button onClick={() => setPrompt("Create a practical step-by-step plan for my next project.")}>Plan a new project</button><button onClick={() => setPrompt("Review this idea and identify its biggest risks and opportunities.")}>Evaluate an idea</button><button onClick={() => setPrompt("Help me build and test a simple MVP.")}>Build an MVP</button></div>
            </>
          ) : (
            <div className="conversation">
              {messages.map((message, index) => <div key={index} className={message.role === "user" ? "message user-message" : "message assistant-message"}><div className="message-role">{message.role === "user" ? "YOU" : "ALICE"}</div><div className="message-content">{message.content}</div></div>)}
              {busy && <div className="message assistant-message"><div className="message-role">ALICE</div><div className="typing"><i /><i /><i /></div></div>}
              <div className="conversation-end" />
            </div>
          )}

          <form className="composer" onSubmit={sendMessage}>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }} placeholder={`Tell Alice what you want to accomplish in ${department}...`} rows={2} />
            <div className="composer-footer"><span><span className="composer-dot" /> ALICE CORE <span className="composer-divider">·</span> {department.toUpperCase()}</span><button type="submit" disabled={busy || !prompt.trim()}>{busy ? "THINKING…" : "SEND"} <span>↗</span></button></div>
          </form>
          {error && <div className="error-message">{error}</div>}
          <div className="disclaimer">Alice can reason and draft. External actions require connected tools and your approval.</div>
        </div>
        <footer className="footer"><span>ALICE OPERATOR OS</span><span>BUILT FOR MOMENTUM <b>●</b></span></footer>
      </section>
    </main>
  );
}