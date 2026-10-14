import { useState } from 'react';

const MAX_NOTIFICATIONS = 3;
const NOTIFICATION_DURATION_MS = 6000;
const EXIT_ANIMATION_MS = 300;

export interface Notification {
  id: string;
  text: string;
  isExiting: boolean;
  isError?: boolean;
}

// Custom hook to manage notifications in the application
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    // {
    //   id: 'dev-test',
    //   text: '🌟 Test Testesen slog chefen med en tid på 22:15!',
    //   isExiting: false,
    // },
  ]);

  // Function to add a new notification to the state
  const push = (text: string, options?: { isError?: boolean }) => {
    // Generate a unique ID for the notification
    const id = `${Date.now()}-${Math.random()}`;

    // Add the new notification to the state (maximum of 3)
    setNotifications((prev) => {
      const next = [
        ...prev,
        { id, text, isExiting: false, isError: options?.isError },
      ];
      return next.length > MAX_NOTIFICATIONS
        ? next.slice(next.length - MAX_NOTIFICATIONS)
        : next;
    });

    // Set a timeout to mark the notification as exiting and remove it after the duration
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
