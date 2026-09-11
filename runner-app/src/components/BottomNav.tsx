import { NavLink } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';
import RunIcon from '@dhl-relay/ui/src/icons/RunIcon';
import StarFilled from '@dhl-relay/ui/src/icons/StarFilled';

// "My page" always jumps to whichever step of the flow the runner is
// currently on, not a fixed route - so the tab stays meaningful throughout.
function getMyPagePath(session: ReturnType<typeof useRunSession>) {
  if (!session.selectedTeamId) return '/select-team';
  if (!session.selectedRunnerId) return '/select-runner';
  if (session.finalResultSeconds != null) return '/finished';
  return '/running';
}

export function BottomNav() {
  const session = useRunSession();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-surface-content/10 flex z-2000">
      <NavLink
        to="/live"
        className={({ isActive }) =>
          `flex-1 py-3 text-center text-sm font-medium ${isActive ? 'text-accent' : 'text-surface-content-muted'}`
        }
      >
        <StarFilled className="mx-auto w-6 h-6 m-1" />
        <p>Leaderboard</p>
      </NavLink>
      <NavLink
        to={getMyPagePath(session)}
        className={({ isActive }) =>
          `flex-1 py-3 text-center text-sm font-medium ${isActive ? 'text-accent' : 'text-surface-content-muted'}`
        }
      >
        <RunIcon className="mx-auto w-6 h-6 m-1" />
        <p>My Race</p>
      </NavLink>
    </nav>
  );
}
