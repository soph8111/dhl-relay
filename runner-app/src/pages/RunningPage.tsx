import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';
import { RunnerProfileCard } from '@/components/RunnerProfileCard';
import { BackButton } from '@/components/BackButton';
import { CtaButton } from '@/components/CtaButton';

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
      : (runner.alias ?? '')
    : '';
  const selectedTeam = teams.find((team) => team._id === selectedTeamId);

  const handleStop = () => {
    stop();
    void navigate('/finished');
  };

  return (
    <div className="items-center flex flex-col gap-6">
      <RunnerProfileCard
        name={name}
        imageUrl={runner?.imageUrl}
        age={runner?.age}
        gender={runner?.gender}
        teamName={selectedTeam?.teamName}
      />
      <div className="text-6xl font-bold text-accent tabular-nums">
        {formatElapsed(elapsed)}
      </div>

      {!isRunning ? (
        <CtaButton label="Start" onClick={start} variant="accent" />
      ) : (
        <CtaButton label="Stop" onClick={handleStop} />
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
