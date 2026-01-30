// components/UI/ProgressBar.js
export default function ProgressBar({ value = 0, max = 100, color = 'primary', showLabel = true, animated = true }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };
  const c = colors[color] || colors.primary;

  return (
    <div className="w-full">
      <div
        className="h-2 rounded-full overflow-hidden bg-white/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            backgroundColor: c,
            transition: animated ? 'width 0.3s ease' : 'none',
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-white/70 mt-1 block">{pct}%</span>
      )}
    </div>
  );
}
