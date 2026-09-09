import { useState } from 'react';

const MAX_NOTIFICATIONS = 3;
const NOTIFICATION_DURATION_MS = 6000;
const EXIT_ANIMATION_MS = 300;

export interface Notification {
  id: string;
  text: string;
  isExiting: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    // {
    //   id: 'dev-test',
    //   text: '🌟 Test Testesen slog chefen med en tid på 22:15!',
    //   isExiting: false,
    // },
  ]);

  const push = (text: string) => {
    const id = `${Date.now()}-${Math.random()}`;

    setNotifications((prev) => {
      const next = [...prev, { id, text, isExiting: false }];
      return next.length > MAX_NOTIFICATIONS
        ? next.slice(next.length - MAX_NOTIFICATIONS)
        : next;
    });

    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isExiting: true } : n)),
      );

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, EXIT_ANIMATION_MS);
    }, NOTIFICATION_DURATION_MS);
  };

  return { notifications, push };
}
