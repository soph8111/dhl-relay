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
      <div className="flex gap-2 px-6 items-center 2xl:px-0 justify-center">
        <div className="text-6xl font-semibold text-right text-surface-content">
          {value}
        </div>
        <div className=" 2xl:max-w-3/5">
          <div className="text-surface-content">{label}</div>
          {sublabel && (
            <div className="text-surface-content-muted">{sublabel}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 ">
      <div className="text-surface-content-muted">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-6xl font-semibold text-surface-content">
          {value}
        </span>
        {unit && <span className="text-surface-content-muted">{unit}</span>}
      </div>
    </div>
  );
}
