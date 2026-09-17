import { createContext, useContext } from 'react';
import type { TeamRunner } from '@dhl-relay/ui';
interface Team {
  _id: string;
  teamName: string;
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
  start: () => Promise<void>;
  stop: () => Promise<void>;
  cancel: () => Promise<void>;
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
