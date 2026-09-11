import { AnimatePresence, motion } from 'motion/react';
import ArrowIcon from '@dhl-relay/ui/src/icons/ArrowIcon';
import CloseIcon from '@dhl-relay/ui/src/icons/CloseIcon';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-2000">
          <motion.div
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 bg-background/70 backdrop-blur-xs"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className="absolute inset-x-0 bottom-0 bg-modal-background rounded-t-3xl px-10 pt-6 pb-8 h-1/2"
          >
            <CloseIcon
              className="absolute top-4 right-4 w-6 h-6 text-surface-content"
              onClick={onCancel}
            />
            <p className="text-surface-content text-2xl font-bold text-left w-2/3 my-10">
              {message}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onCancel}
                className="rounded-full uppercase p-4 bg-accent text-accent-content font-medium"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="text-surface-content text-sm px-4 pt-4 items-center fixed bottom-28 left-0 right-0 flex justify-center"
                aria-label="Cancel run"
              >
                <ArrowIcon className="w-6 h-6 inline-block mr-2" />{' '}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
