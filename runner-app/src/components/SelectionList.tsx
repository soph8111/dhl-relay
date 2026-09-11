interface SelectionItem {
  id: string;
  label: string;
  disabled?: boolean;
  disabledLabel?: string;
}

interface SelectionListProps {
  title: string;
  items: SelectionItem[];
  loading?: boolean;
  emptyMessage?: string;
  onSelect: (id: string) => void;
}

export function SelectionList({
  title,
  items,
  loading,
  emptyMessage,
  onSelect,
}: SelectionListProps) {
  if (loading)
    return <p className="p-4 text-surface-content-muted">Loading...</p>;
  if (items.length === 0) {
    return (
      <p className="p-4 text-surface-content-muted">
        {emptyMessage ?? 'Nothing to show.'}
      </p>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      <h1 className="text-xl font-semibold text-surface-content mb-2">
        {title}
      </h1>
      {items.map((item) => (
        <button
          key={item.id}
          disabled={item.disabled}
          onClick={() => onSelect(item.id)}
          className={`rounded-xl px-4 py-3 text-left ${
            item.disabled
              ? 'bg-surface/50 text-surface-content-muted'
              : 'bg-surface text-surface-content'
          }`}
        >
          {item.label}
          {item.disabled && item.disabledLabel ? ` ${item.disabledLabel}` : ''}
        </button>
      ))}
    </div>
  );
}
