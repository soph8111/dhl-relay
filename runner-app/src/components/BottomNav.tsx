import { NavLink } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';

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
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-content/10 flex z-1000">
      <NavLink
        to="/live"
        className={({ isActive }) =>
          `flex-1 py-3 text-center text-sm font-medium ${isActive ? 'text-accent' : 'text-surface-content-muted'}`
        }
      >
        Live
      </NavLink>
      <NavLink
        to={getMyPagePath(session)}
        className={({ isActive }) =>
          `flex-1 py-3 text-center text-sm font-medium ${isActive ? 'text-accent' : 'text-surface-content-muted'}`
        }
      >
        My page
      </NavLink>
    </nav>
  );
}
