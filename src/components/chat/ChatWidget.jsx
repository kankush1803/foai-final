import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import toast from 'react-hot-toast';

export default function ChatWidget({ messages, typing, onSend, onClear }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    onClear();
    toast.success('Chat cleared');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          open
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25'
        }`}
        id="chat-toggle-btn"
        aria-label="Toggle chat"
      >
        <span className="text-xl text-white">{open ? '✕' : '💬'}</span>
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-22 right-5 z-50 w-[340px] sm:w-[380px] h-[480px] flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-neutral-900/95 backdrop-blur-xl shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-neutral-200">
                  Dashboard AI
                </div>
                <div className="text-[10px] text-emerald-500 dark:text-emerald-400">
                  Powered by Llama
                </div>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="text-xs text-neutral-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
              id="chat-clear-btn"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
            {messages.length === 0 && !typing && (
              <div className="text-center text-neutral-500 text-xs mt-8">
                <div className="text-3xl mb-2">🛰️</div>
                Ask me anything about the dashboard data!
              </div>
            )}
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {typing && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about ISS or news…"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500/30 transition-colors"
                id="chat-input"
              />
              <button
                onClick={handleSend}
                disabled={typing || !input.trim()}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                id="chat-send-btn"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
