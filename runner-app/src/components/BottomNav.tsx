import { NavLink, useLocation } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';
import RunIcon from '@dhl-relay/ui/src/icons/RunIcon';
import StarFilled from '@dhl-relay/ui/src/icons/StarFilled';

const MY_RACE_ROUTES = [
  '/select-team',
  '/select-runner',
  '/running',
  '/finished',
];

function getMyPagePath(session: ReturnType<typeof useRunSession>) {
  if (!session.selectedTeamId) return '/select-team';
  if (!session.selectedRunnerId) return '/select-runner';
  if (session.finalResultSeconds != null) return '/finished';
  return '/running';
}

export function BottomNav() {
  const session = useRunSession();
  const location = useLocation();

  const isLiveActive = location.pathname === '/live';
  const isMyRaceActive = MY_RACE_ROUTES.includes(location.pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-surface-content/10 flex z-2000">
      <NavLink
        to="/live"
        className={`flex-1 py-3 text-center text-sm font-medium ${isLiveActive ? 'text-accent' : 'text-surface-content-muted'}`}
      >
        <StarFilled className="mx-auto w-5 h-5 m-1" />
        <p>Leaderboard</p>
      </NavLink>
      <NavLink
        to={getMyPagePath(session)}
        className={`flex-1 py-3 text-center text-sm font-medium ${isMyRaceActive ? 'text-accent' : 'text-surface-content-muted'}`}
      >
        <RunIcon className="mx-auto w-5 h-5 m-1" />
        <p>My Race</p>
      </NavLink>
    </nav>
  );
}
