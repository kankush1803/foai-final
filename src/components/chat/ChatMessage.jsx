export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-cyan-500/20 text-cyan-100 rounded-br-md'
            : 'bg-white/5 text-neutral-300 rounded-bl-md border border-white/5'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
