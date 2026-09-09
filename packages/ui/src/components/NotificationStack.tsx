import type { Notification } from '../hooks/useNotifications';

interface NotificationStackProps {
  notifications: Notification[];
}

export function NotificationStack({ notifications }: NotificationStackProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 fixed top-5 md:top-10 left-1/2 -translate-x-1/2 z-1100 w-full md:w-lg px-4 pointer-events-none">
      {notifications.map((n) => (
        <NotificationItem key={n.id} text={n.text} isExiting={n.isExiting} />
      ))}
    </div>
  );
}

function NotificationItem({
  text,
  isExiting,
}: {
  text: string;
  isExiting: boolean;
}) {
  return (
    <div
      className={`bg-accent text-accent-content rounded-xl shadow-lg px-4 py-3 text-sm pointer-events-auto
        transition-all duration-300 ease-out
        starting:opacity-0 starting:-translate-y-4
        ${isExiting ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
    >
      {text}
    </div>
  );
}
