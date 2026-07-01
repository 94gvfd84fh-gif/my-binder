import { useState } from "react";

const NOTIFICATION_READ_KEY = "pocket-deck-read-notifications";

const notifications = [
  {
    id: "trade-request-preview",
    type: "TRADE",
    icon: "🔁",
    title: "Trade request sent",
    message: "Your trade request preview was created successfully.",
    time: "Just now",
  },
  {
    id: "collector-followed",
    type: "SOCIAL",
    icon: "👤",
    title: "Collector followed",
    message: "You followed a collector from Discover Collectors.",
    time: "Today",
  },
  {
    id: "saved-event",
    type: "EVENT",
    icon: "📍",
    title: "Saved event",
    message: "Saved community events will appear on your dashboard.",
    time: "Today",
  },
];

function getReadNotifications() {
  const saved = localStorage.getItem(NOTIFICATION_READ_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState(getReadNotifications);

  const unreadNotifications = notifications.filter((notification) => {
    return !readNotifications.includes(notification.id);
  });

  const unreadCount = unreadNotifications.length;

  function markAllAsRead() {
    const allNotificationIds = notifications.map((notification) => notification.id);

    setReadNotifications(allNotificationIds);
    localStorage.setItem(
      NOTIFICATION_READ_KEY,
      JSON.stringify(allNotificationIds)
    );
  }

  function toggleNotifications() {
    const nextOpenState = !isOpen;

    setIsOpen(nextOpenState);

    if (nextOpenState) {
      markAllAsRead();
    }
  }

  return (
    <div className="notification-dropdown">
      <button
        className="notification-trigger"
        type="button"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <span className="notification-bell">🔔</span>
        <span>Notifications</span>

        {unreadCount > 0 && (
          <span className="notification-bubble">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-menu">
          <div className="notification-menu-header">
            <div>
              <p className="page-label">ACTIVITY</p>
              <h3>Notifications</h3>
            </div>

            <span>{unreadCount > 0 ? `${unreadCount} new` : "All caught up"}</span>
          </div>

          <div className="notification-list">
            {notifications.map((notification) => {
              const isUnread = !readNotifications.includes(notification.id);

              return (
                <article
                  className={
                    isUnread
                      ? "notification-card unread-notification"
                      : "notification-card"
                  }
                  key={notification.id}
                >
                  <div className="notification-icon" aria-hidden="true">
                    {notification.icon}
                  </div>

                  <div className="notification-content">
                    <div className="notification-top-row">
                      <span className="notification-type">
                        {notification.type}
                      </span>
                      <span className="notification-time">
                        {notification.time}
                      </span>
                    </div>

                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                  </div>

                  {isUnread && (
                    <span
                      className="notification-unread-dot"
                      aria-label="Unread"
                    ></span>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;