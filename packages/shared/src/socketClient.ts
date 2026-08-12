import { io, type Socket } from 'socket.io-client';

export function createSocket(serverUrl: string): Socket {
  return io(serverUrl);
}
