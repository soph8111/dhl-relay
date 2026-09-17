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
  const [elapsed, setElapsed] = useState(() => {
    if (!startedAt) return 0;
    return Math.floor((Date.now() - startedAt) / 1000);
  });

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
    <div className="items-center flex flex-col h-[52vh] justify-between">
      <>
        <RunnerProfileCard
          name={name}
          imageUrl={runner?.imageUrl}
          age={runner?.age}
          gender={runner?.gender}
          teamName={selectedTeam?.teamName}
        />

        <p className="text-5xl font-bold tabular-nums text-surface-content my-3">
          {formatElapsed(elapsed)}
        </p>

        {!isRunning ? (
          <CtaButton label="Start timer" onClick={start} variant="start" />
        ) : (
          <CtaButton label="Stop timer" onClick={handleStop} variant="stop" />
        )}
      </>
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
        <div className="fixed top-5 md:top-10 left-1/2 -translate-x-1/2 z-1100 w-full md:w-lg px-4 pointer-events-none">
          <div
            className="relative bg-red text-accent-content rounded-xl shadow-lg px-4 py-3 text-sm pointer-events-auto
        transition-all duration-300 ease-out
        starting:opacity-0 starting:-translate-y-4"
          >
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red border border-white flex items-center justify-center text-white font-bold leading-none">
              !
            </div>
            GPS signal lost – your time is still running
          </div>
        </div>
      )}
    </div>
  );
}
