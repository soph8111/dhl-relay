interface SelectionItem {
  id: string;
  label: string;
  sublabel?: string;
  imageUrl?: string;
  disabled?: boolean;
}

interface SelectionListProps {
  title?: string;
  items: SelectionItem[];
  variant: 'team' | 'runner';
  loading?: boolean;
  onSelect: (id: string) => void;
}

export function SelectionList({
  title,
  items,
  variant,
  loading,
  onSelect,
}: SelectionListProps) {
  if (loading) return <p className="text-surface-content-muted">Loading...</p>;

  if (variant === 'team')
    return (
      <>
        {title && <h2 className="text-sm text-surface-content">{title}</h2>}

        <div className="relative">
          <div className="flex flex-col gap-2 max-h-[62vh] overflow-y-auto pb-12">
            {items.map((item) => (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => onSelect(item.id)}
                className={`flex justify-between rounded-xl px-4 py-3 text-left ${
                  item.disabled
                    ? 'bg-surface/50 text-surface-content-muted'
                    : 'bg-surface text-surface-content'
                }`}
              >
                {item.label}
                {item.sublabel && (
                  <p className="text-sm text-surface-content-muted">
                    {item.sublabel}
                  </p>
                )}
              </button>
            ))}
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent" />
        </div>
      </>
    );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm text-surface-content">{title}</h2>
      {items.map((item) => (
        <button
          key={item.id}
          disabled={item.disabled}
          onClick={() => onSelect(item.id)}
          className={`flex rounded-xl px-4 py-3 items-center gap-2 ${
            item.disabled
              ? 'bg-surface/50 text-surface-content-muted'
              : 'bg-surface text-surface-content'
          }`}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-surface-content-muted/30 shrink-0" />
          )}
          <span className="flex justify-between w-full items-center">
            {item.label}
            {item.sublabel && (
              <p className="text-xs text-surface-content-muted">
                {item.sublabel}
              </p>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
