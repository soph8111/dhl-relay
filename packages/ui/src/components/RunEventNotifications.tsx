import { useEffect, useMemo, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import type { SanityClient } from '@sanity/client';
import {
  calculateTargetSeconds,
  beatsReference,
  formatSeconds,
} from '@dhl-relay/shared';
import { useRunners } from '../hooks/useRunners';
import { useReferenceRunner } from '../hooks/useReferenceRunner';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationStack } from './NotificationStack';

interface RunEventNotificationsProps {
  client: SanityClient;
  socket: Socket;
}

export function RunEventNotifications({
  client,
  socket,
}: RunEventNotificationsProps) {
  const { notifications, push } = useNotifications();
  const reference = useReferenceRunner(client);
  const { runners } = useRunners(client);

  const runnerMap = useMemo(() => {
    return Object.fromEntries(runners.map((runner) => [runner._id, runner]));
  }, [runners]);

  const runnerMapRef = useRef(runnerMap);
  useEffect(() => {
    runnerMapRef.current = runnerMap;
  }, [runnerMap]);

  function getRunnerName(runnerId: string) {
    const runner = runnerMapRef.current[runnerId];
    return runner
      ? runner.firstName && runner.lastName
        ? `${runner.firstName} ${runner.lastName}`
        : runner.alias
      : 'A runner';
  }

  function getReferenceName() {
    if (!reference) return 'the boss';
    return reference.firstName
      ? `${reference.firstName}`
      : reference.alias || 'the boss';
  }

  useEffect(() => {
    const handleGpsError = ({
      runnerId,
      hasError,
    }: {
      runnerId: string;
      hasError: boolean;
      isError: boolean;
    }) => {
      if (hasError)
        push(`${getRunnerName(runnerId)} lost GPS signal`, { isError: true });
    };

    const handleFinished = ({
      runnerId,
      resultSeconds,
    }: {
      runnerId: string;
      resultSeconds: number;
    }) => {
      const name = getRunnerName(runnerId);
      const runner = runnerMapRef.current[runnerId];

      let message = `${name} crossed the finish line with a time of ${formatSeconds(resultSeconds)} 🏁 `;

      if (runner && reference?.resultSeconds != null) {
        const targetSeconds = calculateTargetSeconds(
          runner.age,
          runner.gender,
          reference.resultSeconds,
          reference.age,
          reference.gender,
        );

        if (beatsReference(resultSeconds, targetSeconds)) {
          message = `${name} beat ${getReferenceName()} with a time of ${formatSeconds(resultSeconds)}! 🔥🔥🔥`;
        }
      }

      push(message);
    };

    const handleTimedOut = ({ runnerId }: { runnerId: string }) => {
      push(`${getRunnerName(runnerId)} lost connection`);
    };

    socket.on('gps-error', handleGpsError);
    socket.on('runner-finished', handleFinished);
    socket.on('runner-timed-out', handleTimedOut);

    return () => {
      socket.off('gps-error', handleGpsError);
      socket.off('runner-finished', handleFinished);
      socket.off('runner-timed-out', handleTimedOut);
    };
  }, [socket, reference]);

  return <NotificationStack notifications={notifications} />;
}
