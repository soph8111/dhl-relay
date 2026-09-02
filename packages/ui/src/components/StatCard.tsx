interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
  unit?: string;
  variant?: 'horizontal' | 'vertical';
}

export function StatCard({
  value,
  label,
  sublabel,
  unit,
  variant = 'vertical',
}: StatCardProps) {
  if (variant === 'horizontal') {
    return (
      <div className="bg-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="text-4xl font-bold text-white">{value}</div>
        <div>
          <div className="text-sm font-semibold text-white">{label}</div>
          {sublabel && <div className="text-xs text-gray-400">{sublabel}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl px-4 py-3">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}
