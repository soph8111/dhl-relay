import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { sanityClient } from '@/sanityClient';
import type { RunnerPosition } from '@dhl-relay/shared';

// extend the RunnerPosition interface to include the startedAt timestamp
interface ActiveRunner extends RunnerPosition {
  startedAt: number;
}

// Map to keep track of active runners and their positions (in-memory)
const activeRunners = new Map<string, ActiveRunner>();

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

  socket.on('position', (data: RunnerPosition) => {
    const existing = activeRunners.get(data.runnerId);
    activeRunners.set(data.runnerId, {
      ...data,
      startedAt: existing?.startedAt ?? Date.now(),
    });

    io.emit('update-runners', data);
  });

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

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
