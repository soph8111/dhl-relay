import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';
import { BackButton } from '@/components/BackButton';

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function RunningPage() {
  const {
    selectedRunnerId,
    runners,
    isRunning,
    hasGpsError,
    startedAt,
    start,
    stop,
    cancel,
  } = useRunSession();
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);

  const runner = runners.find((r) => r._id === selectedRunnerId);
  const name = runner
    ? runner.firstName && runner.lastName
      ? `${runner.firstName} ${runner.lastName}`
      : runner.alias
    : '';

  useEffect(() => {
    if (!startedAt) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  const handleStop = () => {
    stop();
    void navigate('/finished');
  };

  return (
    <div className="p-4 flex flex-col items-center gap-6 text-center">
      <h1 className="text-2xl font-semibold text-surface-content">{name}</h1>

      <div className="text-6xl font-bold text-accent tabular-nums">
        {formatElapsed(elapsed)}
      </div>

      {!isRunning ? (
        <button
          onClick={start}
          className="bg-accent text-accent-content rounded-xl px-8 py-4 text-lg font-semibold"
        >
          Start
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="bg-surface text-surface-content rounded-xl px-8 py-4 text-lg font-semibold"
        >
          Stop
        </button>
      )}

      <BackButton
        to="/select-team"
        confirmMessage={
          isRunning ? 'Are you sure you want to quit this run?' : undefined
        }
        confirmLabel={'Quit run'}
        cancelLabel={'Keep running'}
        onConfirmAction={cancel}
      />

      {hasGpsError && (
        <div className="bg-yellow-100 text-yellow-900 rounded-xl px-4 py-3 text-sm">
          GPS signal lost – your time is still running
        </div>
      )}
    </div>
  );
}
