import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';
import { useReferenceRunner } from '@dhl-relay/ui';
import { calculateTargetSeconds } from '@dhl-relay/shared';
import { sanityClientFresh } from '../sanityClient';
import { CtaButton } from '@/components/CtaButton';
import { RunnerProfileCard } from '@/components/RunnerProfileCard';

function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function FinishedPage() {
  const {
    selectedRunnerId,
    teams,
    selectedTeamId,
    runners,
    finalResultSeconds,
    reset,
  } = useRunSession();
  const navigate = useNavigate();
  const reference = useReferenceRunner(sanityClientFresh);

  const runner = runners.find((r) => r._id === selectedRunnerId);
  const name = runner
    ? runner.firstName && runner.lastName
      ? `${runner.firstName} ${runner.lastName}`
      : (runner.alias ?? '')
    : '';
  const selectedTeam = teams.find((team) => team._id === selectedTeamId);

  const calculatedSeconds =
    runner && reference?.resultSeconds != null && finalResultSeconds != null
      ? calculateTargetSeconds(
          runner.age,
          runner.gender,
          reference.resultSeconds,
          reference.age,
          reference.gender,
        )
      : null;

  return (
    <div className="flex flex-col items-center text-center min-h-[58vh] justify-between">
      <RunnerProfileCard
        name={name}
        imageUrl={runner?.imageUrl}
        age={runner?.age}
        gender={runner?.gender}
        teamName={selectedTeam?.teamName}
      >
        <div className="flex flex-col gap-2 pt-4 border-t border-surface-content/10">
          <div className="flex justify-between">
            <span className="text-surface-content-muted">Final time</span>
            <span className="text-surface-content font-semibold tabular-nums">
              {finalResultSeconds != null
                ? formatSeconds(finalResultSeconds)
                : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-content-muted">Calculated time</span>
            <span className="text-surface-content font-semibold tabular-nums">
              {calculatedSeconds != null
                ? formatSeconds(calculatedSeconds)
                : '—'}
            </span>
          </div>
        </div>
      </RunnerProfileCard>

      <CtaButton
        label="Start a new run"
        onClick={() => {
          reset();
          void navigate('/');
        }}
        variant="accent"
      />
    </div>
  );
}
