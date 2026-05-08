import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import Header from './components/shared/Header';
import ISSMap from './components/iss/ISSMap';
import ISSStats from './components/iss/ISSStats';
import AstronautList from './components/iss/AstronautList';
import ISSSpeedChart from './components/iss/ISSSpeedChart';
import NewsSection from './components/news/NewsSection';
import NewsDoughnut from './components/news/NewsDoughnut';
import ChatWidget from './components/chat/ChatWidget';
import { useTheme } from './hooks/useTheme';
import { useISS } from './hooks/useISS';
import { useNews } from './hooks/useNews';
import { useChat } from './hooks/useChat';

export default function App() {
  const { dark, toggle: toggleTheme } = useTheme();

  const iss = useISS();
  const news = useNews();
  const chat = useChat(iss, news);

  const handleISSRefresh = () => {
    iss.refresh();
    toast.success('ISS data refreshed');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header
          dark={dark}
          toggleTheme={toggleTheme}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* ── ISS Section ── */}
          <section id="iss-section" className="glass-card p-5 space-y-4">
            {/* Title row with refresh + auto-refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                ISS Live Tracking
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleISSRefresh}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-neutral-600 text-sm font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
                  id="iss-refresh-btn"
                >
                  Refresh Now
                </button>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                  Auto-Refresh: ON
                </span>
              </div>
            </div>

            {/* Stats row */}
            <ISSStats
              currentPos={iss.currentPos}
              speed={iss.speed}
              location={iss.location}
              positions={iss.positions}
              loading={iss.loading}
              error={iss.error}
              onRefresh={handleISSRefresh}
            />

            {/* Map + Speed Chart side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                <ErrorBoundary>
                  <ISSMap
                    positions={iss.positions}
                    currentPos={iss.currentPos}
                    speed={iss.speed}
                  />
                </ErrorBoundary>
              </div>
              <div className="lg:col-span-2">
                <ErrorBoundary>
                  <div className="glass-card p-4 h-full">
                    <ISSSpeedChart speedHistory={iss.speedHistory} />
                  </div>
                </ErrorBoundary>
              </div>
            </div>
          </section>

          {/* ── Astronauts + News Distribution Row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AstronautList
              astronauts={iss.astronauts}
              count={iss.astronautCount}
            />
            <ErrorBoundary>
              <NewsDoughnut
                categories={news.categories}
                categoryCounts={news.categoryCounts}
                setActiveCategory={news.setActiveCategory}
              />
            </ErrorBoundary>
          </div>

          {/* ── News Section ── */}
          <section id="news-section" className="glass-card p-5">
            <ErrorBoundary>
              <NewsSection
                categories={news.categories}
                activeCategory={news.activeCategory}
                setActiveCategory={news.setActiveCategory}
                articles={news.articles}
                searchQuery={news.searchQuery}
                setSearchQuery={news.setSearchQuery}
                sortBy={news.sortBy}
                setSortBy={news.setSortBy}
                loading={news.loading}
                errors={news.errors}
                refreshCategory={(cat) => {
                  news.refreshCategory(cat);
                  toast.success(`${cat} news refreshed`);
                }}
              />
            </ErrorBoundary>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer className="text-center text-[11px] text-slate-400 dark:text-neutral-600 py-4 border-t border-black/5 dark:border-white/5">
          Orbital Command Dashboard — Data from Open Notify, NewsAPI & Hugging Face
        </footer>

        {/* ── Chat Widget ── */}
        <ChatWidget
          messages={chat.messages}
          typing={chat.typing}
          onSend={chat.sendMessage}
          onClear={chat.clearChat}
        />

        {/* ── Toast Notifications ── */}
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: dark ? 'rgba(15, 23, 42, 0.95)' : '#ffffff',
              color: dark ? '#e2e8f0' : '#1e293b',
              border: dark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0,0,0,0.08)',
              borderRadius: '12px',
              fontSize: '13px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            success: {
              iconTheme: { primary: '#16a34a', secondary: dark ? '#0f172a' : '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: dark ? '#0f172a' : '#ffffff' },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
