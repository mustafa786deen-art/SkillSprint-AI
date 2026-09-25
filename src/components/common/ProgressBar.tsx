import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  height?: string;
  colorClass?: string;
  showText?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 'h-2',
  colorClass = 'bg-indigo-500',
  showText = false,
  label
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(showText || label) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          {label && <span className="font-medium text-slate-300">{label}</span>}
          {showText && <span className="font-semibold text-indigo-400">{clampedValue.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

interface ProgressRingProps {
  value: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
  target?: string;
  color?: 'emerald' | 'amber' | 'indigo' | 'rose' | 'cyan';
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 110,
  strokeWidth = 9,
  label,
  sublabel,
  target,
  color = 'emerald'
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const colorMap = {
    emerald: { stroke: '#10b981', text: 'text-emerald-400', glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' },
    amber: { stroke: '#f59e0b', text: 'text-amber-400', glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' },
    indigo: { stroke: '#6366f1', text: 'text-indigo-400', glow: 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' },
    rose: { stroke: '#f43f5e', text: 'text-rose-400', glow: 'drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' },
    cyan: { stroke: '#06b6d4', text: 'text-cyan-400', glow: 'drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' },
  }[color];

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colorMap.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className={`transition-all duration-1000 ease-out ${colorMap.glow}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-bold tracking-tight ${colorMap.text}`}>
            {value.toFixed(1)}%
          </span>
          {target && <span className="text-[10px] text-slate-400">Target {target}</span>}
        </div>
      </div>
      <span className="mt-2 text-xs font-semibold text-slate-200 text-center">{label}</span>
      {sublabel && <span className="text-[11px] text-slate-400 text-center mt-0.5">{sublabel}</span>}
    </div>
  );
};
