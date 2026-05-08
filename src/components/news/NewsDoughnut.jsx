import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  'rgba(217, 119, 6, 0.8)',   // amber - technology
  'rgba(168, 85, 247, 0.8)',  // purple - sports
  'rgba(59, 130, 246, 0.8)',  // blue - business
  'rgba(34, 197, 94, 0.8)',   // green - health
  'rgba(220, 38, 38, 0.8)',   // red - science
];

const BORDER_COLORS = [
  'rgba(217, 119, 6, 1)',
  'rgba(168, 85, 247, 1)',
  'rgba(59, 130, 246, 1)',
  'rgba(34, 197, 94, 1)',
  'rgba(220, 38, 38, 1)',
];

export default function NewsDoughnut({ categories, categoryCounts, setActiveCategory }) {
  const data = {
    labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [
      {
        data: categoryCounts,
        backgroundColor: COLORS,
        borderColor: BORDER_COLORS,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          padding: 12,
          font: { size: 11 },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(217, 119, 6, 0.3)',
        borderWidth: 1,
        titleColor: '#94a3b8',
        bodyColor: '#e2e8f0',
        padding: 10,
        cornerRadius: 8,
      },
    },
    onClick: (_event, elements) => {
      if (elements.length > 0) {
        const idx = elements[0].index;
        setActiveCategory(categories[idx]);
      }
    },
  };

  const hasData = categoryCounts.some((c) => c > 0);

  return (
    <div className="glass-card p-5">
      <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">
        📊 News Distribution
      </h2>
      <div className="h-[220px]">
        {hasData ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-neutral-500 text-sm">
            Loading chart data…
          </div>
        )}
      </div>
    </div>
  );
}
