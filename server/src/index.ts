import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { sanityClient } from '@/sanityClient';
import type { RunnerPosition } from '@dhl-relay/shared';

// A runner can exist here before any GPS position arrives (locked in via 'start'),
// so most RunnerPosition fields are optional until the first position comes in.
interface ActiveRunner extends Partial<RunnerPosition> {
  runnerId: string;
  startedAt: number;
  lastSeenAt: number;
  hasGpsError?: boolean;
}

const activeRunners = new Map<string, ActiveRunner>();

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes without a position
const TIMEOUT_CHECK_INTERVAL_MS = 30 * 1000;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('User connected');

  const sendActiveRunners = () => {
    socket.emit('active-runners', Array.from(activeRunners.values()));
  };

  sendActiveRunners();
  socket.on('request-active-runners', sendActiveRunners);

  // Locks the runner in immediately, independent of whether GPS ever succeeds.
  socket.on('start', ({ runnerId }: { runnerId: string }) => {
    if (activeRunners.has(runnerId)) return; // already active - locked for others

    const now = Date.now();
    activeRunners.set(runnerId, { runnerId, startedAt: now, lastSeenAt: now });

    io.emit('active-runners', Array.from(activeRunners.values()));
  });

  socket.on('position', (data: RunnerPosition) => {
    const existing = activeRunners.get(data.runnerId);
    activeRunners.set(data.runnerId, {
      ...existing,
      ...data,
      startedAt: existing?.startedAt ?? Date.now(),
      lastSeenAt: Date.now(),
    });

    io.emit('update-runners', data);
  });

  socket.on(
    'gps-error',
    ({ runnerId, hasError }: { runnerId: string; hasError: boolean }) => {
      const existing = activeRunners.get(runnerId);
      if (!existing) return;

      activeRunners.set(runnerId, { ...existing, hasGpsError: hasError });
      io.emit('gps-error', { runnerId, hasError });
    },
  );

  socket.on('stop', async ({ runnerId }: { runnerId: string }) => {
    const runner = activeRunners.get(runnerId);
    activeRunners.delete(runnerId);

    io.emit('runner-stopped', { runnerId });

    if (runner) {
      const resultSeconds = Math.round((Date.now() - runner.startedAt) / 1000);

      // Deterministic ID avoids duplicate docs if an admin already created one
      const resultId = `result-${runnerId}-${new Date().getFullYear()}`;

      try {
        await sanityClient.createIfNotExists({
          _id: resultId,
          _type: 'result',
          runner: { _type: 'reference', _ref: runnerId },
          year: new Date().getFullYear(),
        });

        await sanityClient
          .patch(resultId)
          .set({ result: resultSeconds })
          .commit();

        console.log(`Saved result for ${runnerId}: ${resultSeconds} seconds`);
      } catch (err) {
        console.error('Could not save result in Sanity:', err);
      }
    }
  });

  // No disconnect cleanup - dropped connections shouldn't remove a runner, only 'stop' should
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Removes runners who've gone silent (crashed app, dead battery, forgot to
// press stop) without writing a result - admin fills that in manually in
// Sanity Studio, per SRS-13 (fallback).
setInterval(() => {
  const now = Date.now();

  for (const [runnerId, runner] of activeRunners) {
    if (now - runner.lastSeenAt > TIMEOUT_MS) {
      activeRunners.delete(runnerId);
      io.emit('runner-timed-out', { runnerId });
      console.warn(
        `Runner ${runnerId} timed out - needs manual result entry in Sanity`,
      );
    }
  }
}, TIMEOUT_CHECK_INTERVAL_MS);

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
