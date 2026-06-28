import { useState } from "react";

const notifications = [
  {
    id: 1,
    type: "TRADE",
    icon: "🔁",
    title: "Trade request sent",
    message: "Your trade request preview was created successfully.",
    time: "Just now",
    unread: true,
  },
  {
    id: 2,
    type: "SOCIAL",
    icon: "👤",
    title: "Collector followed",
    message: "You followed a collector from Discover Collectors.",
    time: "Today",
    unread: true,
  },
  {
    id: 3,
    type: "EVENT",
    icon: "📍",
    title: "Saved event",
    message: "Saved community events will appear on your dashboard.",
    time: "Today",
    unread: false,
  },
];

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((notification) => {
    return notification.unread;
  }).length;

  return (
    <div className="notification-dropdown">
      <button
        type="button"
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="notification-bell">🔔</span>
        <span>Notifications</span>

        {unreadCount > 0 && (
          <strong className="notification-badge">{unreadCount}</strong>
        )}
      </button>

      {isOpen && (
        <div className="notification-menu">
          <div className="notification-menu-header">
            <div>
              <p className="page-label">ACTIVITY</p>
              <h3>Notifications</h3>
            </div>

            <span>{unreadCount} unread</span>
          </div>

          <div className="notification-list">
            {notifications.map((notification) => (
              <article
                className={
                  notification.unread
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

                {notification.unread && (
                  <span
                    className="notification-unread-dot"
                    aria-label="Unread"
                  ></span>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;