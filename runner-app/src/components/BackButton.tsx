import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ArrowIcon from '@dhl-relay/ui/src/icons/ArrowIcon';
import { ConfirmDialog } from './ConfirmDialog';

interface BackButtonProps {
  to: string;
  confirmMessage?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirmAction?: () => void;
}

export function BackButton({
  to,
  confirmMessage,
  confirmLabel,
  cancelLabel,
  onConfirmAction,
}: BackButtonProps) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (confirmMessage) {
      setShowConfirm(true);
      return;
    }
    void navigate(to);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="text-surface-content text-sm px-4 pt-4 items-center fixed bottom-28 left-0 right-0 flex justify-center"
        aria-label="Go back"
      >
        <ArrowIcon className="w-6 h-6 inline-block mr-2" /> Go Back
      </button>

      {showConfirm && confirmMessage && (
        <ConfirmDialog
          message={confirmMessage}
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            onConfirmAction?.();
            void navigate(to);
          }}
          open={showConfirm}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
        />
      )}
    </>
  );
}
