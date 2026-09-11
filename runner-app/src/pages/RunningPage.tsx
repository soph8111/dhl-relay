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
    teams,
    selectedTeamId,
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

  useEffect(() => {
    if (!selectedRunnerId) {
      void navigate('/select-team');
    }
  }, [selectedRunnerId, navigate]);

  useEffect(() => {
    if (!startedAt) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  if (!selectedRunnerId) {
    return null;
  }

  const runner = runners.find((r) => r._id === selectedRunnerId);
  const name = runner
    ? runner.firstName && runner.lastName
      ? `${runner.firstName} ${runner.lastName}`
      : runner.alias
    : '';
  const selectedTeam = teams.find((team) => team._id === selectedTeamId);

  const handleStop = () => {
    stop();
    void navigate('/finished');
  };

  return (
    <div className="items-center flex flex-col gap-6">
      <div className="flex flex-col gap-6 text-center bg-surface rounded-3xl w-full p-8">
        <div>
          {runner?.imageUrl ? (
            <img
              src={runner.imageUrl}
              alt=""
              className="block w-20 h-20 rounded-full object-cover mx-auto mb-3"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-surface-content-muted/30 mx-auto mb-3" />
          )}

          <h1 className="text-2xl font-semibold text-surface-content">
            {name}
          </h1>

          {runner && (
            <p className="text-surface-content-muted">
              Age {runner.age} • {runner.gender}
            </p>
          )}
          {selectedTeam && <p> {selectedTeam.teamName}</p>}
        </div>
      </div>
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
        to="/select-runner"
        confirmMessage={
          isRunning ? 'Are you sure you want to cancel this run?' : undefined
        }
        confirmLabel="Cancel run"
        cancelLabel="Keep running"
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
