import { useState, useEffect } from "react";

export default function NotificationBell({
  notifications = [],
  onNotificationsClick,
  icon: DisplayIcon,
}) {
  const [newNotifications, setNewNotifications] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setNewNotifications(true);
    } else {
      setNewNotifications(false);
    }
  }, [notifications]);

  const totalNotifications = notifications.reduce(
    (acc, count) => acc + count,
    0
  );
  return (
    <div className="relative flex items-center">
      <button
        onClick={onNotificationsClick}
        className="relative inline-flex items-center justify-center p-2 rounded-full"
      >
        {DisplayIcon && <DisplayIcon height={30} className="icon" />}
        {newNotifications && (
          <span className="absolute top-0 right-0 block h-4 w-4 transform translate-x-1/6 -translate-y-1/6 rounded-full bg-container-light dark:bg-container-dark  ring-2 ring-btnDelete-light dark:ring-btnDelete-dark">
            <p className="flex items-center justify-center text-xs text-black dark:text-white">
              {totalNotifications}
            </p>
          </span>
        )}
      </button>
    </div>
  );
}
