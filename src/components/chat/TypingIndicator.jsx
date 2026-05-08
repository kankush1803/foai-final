export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
        <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
