interface CtaButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'accent';
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

  return (
    <button
      onClick={onClick}
      className="rounded-full px-8 py-4 text-lg font-semibold w-full bg-surface text-surface-content uppercase"
    >
      {label}
    </button>
  );
}
