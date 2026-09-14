interface CtaButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'accent' | 'start' | 'stop';
}

export function CtaButton({ label, onClick, variant }: CtaButtonProps) {
  if (variant === 'accent') {
    return (
      <button
        onClick={onClick}
        className="rounded-full px-8 py-4 text-lg font-semibold w-full bg-accent text-accent-content uppercase"
      >
        {label}
      </button>
    );
  }

  if (variant === 'start') {
    return (
      <button
        onClick={onClick}
        className="rounded-full px-8 py-4 text-lg font-semibold w-full bg-green text-accent-content uppercase"
      >
        {label}
      </button>
    );
  }

  if (variant === 'stop') {
    return (
      <button
        onClick={onClick}
        className="rounded-full px-8 py-4 text-lg font-semibold w-full bg-orange text-accent-content uppercase"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="rounded-full px-8 py-4 text-lg font-semibold w-full bg-button-bg text-button-content uppercase"
    >
      {label}
    </button>
  );
}
