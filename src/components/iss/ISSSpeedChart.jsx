import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function ISSSpeedChart({ speedHistory }) {
  const data = {
    labels: speedHistory.map((s) => s.time),
    datasets: [
      {
        label: 'ISS Speed (km/h)',
        data: speedHistory.map((s) => s.speed),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.06)',
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: 'transparent',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#64748b',
          font: { size: 11 },
          usePointStyle: true,
          pointStyleWidth: 8,
          boxWidth: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(220, 38, 38, 0.3)',
        borderWidth: 1,
        titleColor: '#94a3b8',
        bodyColor: '#e2e8f0',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { size: 9 }, maxRotation: 45, maxTicksLimit: 10 },
        grid: { color: 'rgba(148, 163, 184, 0.08)' },
      },
      y: {
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          callback: (v) => v.toLocaleString(),
        },
        grid: { color: 'rgba(148, 163, 184, 0.08)' },
      },
    },
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">
        ISS Speed Trend
      </h2>
      <div className="flex-1 min-h-[250px]">
        {speedHistory.length > 1 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-neutral-500 text-sm">
            Collecting speed data…
          </div>
        )}
      </div>
    </div>
  );
}
