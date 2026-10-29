import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { cn, FadeUp, MIcon } from './primitives';

type Message = { role: 'assistant' | 'user'; text: string };
const seed: Message[] = [
  { role: 'assistant', text: "Welcome to the Vibe Design course! I'll guide you through building stunning websites with AI. What would you like to learn first?" },
  { role: 'user', text: 'I want to learn how to build a hero section with a cinematic video background using AI.' },
  { role: 'assistant', text: "Great choice! In this course, you'll learn how to create full-screen looping videos, liquid glass nav bars, email signups, and manifesto buttons — all with AI assistance. Let's dive in!" },
];
export function ChatPanel({ initialScroll = 'bottom', animateMessagesIn = false }: { initialScroll?: 'top' | 'bottom'; animateMessagesIn?: boolean }) {
  const [messages, setMessages] = useState(seed);
  const [draft, setDraft] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const area = messagesRef.current;
    if (area && (initialScroll === 'bottom' || messages.length > seed.length)) area.scrollTop = area.scrollHeight;
  }, [messages, initialScroll]);
  function send(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages(current => [...current, { role: 'user', text }, { role: 'assistant', text: "Let's build it together! Start with a clear prompt describing your layout, mood, and typography. Then add a looping video background and refine your design one step at a time." }]);
    setDraft('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    textareaRef.current?.focus();
  }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); }
  }
  return <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10" style={{ background: 'rgba(8,8,10,0.6)', backdropFilter: 'blur(24px)' }}>
    <header className="flex shrink-0 items-center gap-2 border-b border-white/5 px-4 py-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5"><MIcon name="auto_awesome" size={14} /></span>
      <div><p className="text-sm font-medium text-white">Vibe Design course</p><p className="mt-0.5 text-[11px] text-white/40">Learn how to build website with AI</p></div>
    </header>
    <div ref={messagesRef} aria-label="Course conversation" aria-live="polite" className="scrollbar-hide min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
      {messages.map((message, i) => {
        const bubble = <div className={cn('max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed', message.role === 'user' ? 'ml-auto bg-white/15 text-white/90' : 'border border-white/5 bg-white/5 text-white/70')}>{message.text}</div>;
        return animateMessagesIn ? <FadeUp key={i} delay={i < 3 ? i * 0.12 : 0} y={16}>{bubble}</FadeUp> : <div key={i}>{bubble}</div>;
      })}
    </div>
    <form onSubmit={send} className="liquid-glass m-3 flex shrink-0 items-end gap-2 rounded-2xl p-2">
      <textarea ref={textareaRef} aria-label="Ask about the course" rows={1} value={draft} onKeyDown={onKeyDown} onChange={event => { setDraft(event.target.value); event.target.style.height = 'auto'; event.target.style.height = `${Math.min(event.target.scrollHeight, 96)}px`; }} placeholder="Ask about the course..." className="min-w-0 flex-1 resize-none bg-transparent px-1 py-2 text-[11px] leading-4 text-white placeholder:text-white/40" />
      <button type="submit" aria-label="Send message" className="flex shrink-0 items-center justify-center rounded-xl bg-white p-2 text-black transition-colors hover:bg-white/80"><MIcon name="arrow_upward" size={16} /></button>
    </form>
  </div>;
}
