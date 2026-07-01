import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const OLD_NOTIFICATION_KEYS = [
  "pocket-deck-read-notifications",
  "beacon-collect-notifications-guest",
  "beacon-collect-read-notifications-guest",
];

function getNotificationsKey(userId) {
  return `beacon-collect-notifications-${userId}`;
}

function getReadNotificationsKey(userId) {
  return `beacon-collect-read-notifications-${userId}`;
}

function getSavedArray(key) {
  const saved = localStorage.getItem(key);

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
  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);

  const notificationsKey = user ? getNotificationsKey(user.id) : "";
  const readNotificationsKey = user ? getReadNotificationsKey(user.id) : "";

  useEffect(() => {
    OLD_NOTIFICATION_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setReadNotifications([]);
      return;
    }

    setNotifications(getSavedArray(getNotificationsKey(user.id)));
    setReadNotifications(getSavedArray(getReadNotificationsKey(user.id)));
  }, [user]);

  const unreadNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      return !readNotifications.includes(notification.id);
    });
  }, [notifications, readNotifications]);

  const unreadCount = unreadNotifications.length;

  function markAllAsRead() {
    if (!user) return;

    const allNotificationIds = notifications.map((notification) => {
      return notification.id;
    });

    setReadNotifications(allNotificationIds);
    localStorage.setItem(readNotificationsKey, JSON.stringify(allNotificationIds));
  }

  function clearNotifications() {
    if (!user) return;

    setNotifications([]);
    setReadNotifications([]);

    localStorage.setItem(notificationsKey, JSON.stringify([]));
    localStorage.setItem(readNotificationsKey, JSON.stringify([]));
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

          {notifications.length > 0 ? (
            <>
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
                        {notification.icon || "🔔"}
                      </div>

                      <div className="notification-content">
                        <div className="notification-top-row">
                          <span className="notification-type">
                            {notification.type || "UPDATE"}
                          </span>
                          <span className="notification-time">
                            {notification.time || "New"}
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

              <button
                className="secondary-button"
                type="button"
                onClick={clearNotifications}
              >
                Clear Notifications
              </button>
            </>
          ) : (
            <div className="notification-empty-state">
              <h3>No notifications yet</h3>
              <p>
                Trade requests, follows, saved events, and community updates
                will appear here when there is something new.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;