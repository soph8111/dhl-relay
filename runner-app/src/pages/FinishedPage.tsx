import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';

function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function FinishedPage() {
  const { finalResultSeconds, reset } = useRunSession();
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col items-center gap-6 text-center">
      <h1 className="text-3xl font-bold text-surface-content">
        🎉 Congratulations!
      </h1>

      {finalResultSeconds != null && (
        <p className="text-5xl font-bold text-accent tabular-nums">
          {formatSeconds(finalResultSeconds)}
        </p>
      )}

      <button
        onClick={() => {
          reset();
          void navigate('/');
        }}
        className="bg-accent text-accent-content rounded-xl px-8 py-4 text-lg font-semibold"
      >
        Done
      </button>
    </div>
  );
}
