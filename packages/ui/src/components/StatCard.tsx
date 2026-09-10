interface StatCardProps {
  value: string;
  label: string;
  sublabel?: string;
  unit?: string;
  accent?: boolean;
  variant?: 'horizontal' | 'vertical' | 'modal';
  className?: string;
}

export function StatCard({
  value,
  label,
  sublabel,
  unit,
  accent = false,
  variant = 'vertical',
  className,
}: StatCardProps) {
  if (variant === 'horizontal') {
    return (
      <div className="flex gap-2 px-6 items-center 2xl:px-0 justify-center">
        <div
          className={`text-6xl font-medium text-right ${
            accent ? 'text-accent' : 'text-surface-content'
          }`}
        >
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

  if (variant === 'modal') {
    return (
      <div className="flex flex-col h-full justify-between">
        <div className="text-surface-content-muted">{label}</div>
        <div className={`flex items-end md:gap-1 ${className}`}>
          <span
            className={`text-4xl w-full md:text-6xl font-medium ${
              accent ? 'text-accent' : 'text-surface-content'
            }`}
          >
            {value}
          </span>
          {unit && <span className="text-surface-content-muted">{unit}</span>}
          {sublabel && (
            <div className="2xl:max-w-3/5">
              <div className="text-surface-content-muted text-2xl">
                {sublabel}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="text-surface-content-muted">{label}</div>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-6xl font-medium ${
            accent ? 'text-accent' : 'text-surface-content'
          }`}
        >
          {value}
        </span>
        {unit && <span className="text-surface-content-muted">{unit}</span>}
      </div>
      {sublabel && (
        <div className="text-surface-content-muted italic text-sm">
          {sublabel}
        </div>
      )}
    </div>
  );
}
