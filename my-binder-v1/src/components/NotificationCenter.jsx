function NotificationCenter() {
  const notifications = [
    {
      id: 1,
      type: "TRADE REQUEST",
      title: "Trade request sent",
      message: "Your trade request preview was created successfully.",
      time: "Just now",
    },
    {
      id: 2,
      type: "COMMUNITY",
      title: "Collector followed",
      message: "You followed a collector from Discover.",
      time: "Today",
    },
    {
      id: 3,
      type: "EVENTS",
      title: "Saved event",
      message: "Your saved events will appear here soon.",
      time: "Today",
    },
  ];

  return (
    <section className="notification-center">
      <div className="section-header">
        <div>
          <h2>Notifications</h2>
          <p>Trade requests, follows, saved events, and community updates.</p>
        </div>
      </div>

      <div className="notification-list">
        {notifications.map((notification) => (
          <div className="notification-card" key={notification.id}>
            <p className="page-label">{notification.type}</p>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <span>{notification.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NotificationCenter;