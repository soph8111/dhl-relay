import { createContext, useContext } from 'react';

interface Team {
  _id: string;
  teamName: string;
}

interface TeamRunner {
  _id: string;
  firstName: string;
  lastName: string;
  imgUrl?: string;
  alias?: string;
  resultCount: number;
}

export interface RunSessionContextValue {
  teams: Team[];
  teamsLoading: boolean;
  selectedTeamId: string | null;
  selectTeam: (id: string) => void;

  runners: TeamRunner[];
  runnersLoading: boolean;
  selectedRunnerId: string | null;
  selectRunner: (id: string) => void;
  takenRunnerIds: Set<string>;

  isRunning: boolean;
  hasGpsError: boolean;
  startedAt: number | null;
  finalResultSeconds: number | null;
  start: () => void;
  stop: () => void;
  cancel: () => void;
  reset: () => void;
}

export const RunSessionContext = createContext<
  RunSessionContextValue | undefined
>(undefined);

export function useRunSession() {
  const context = useContext(RunSessionContext);
  if (!context) {
    throw new Error('useRunSession must be used within a RunSessionProvider');
  }
  return context;
}
