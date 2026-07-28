import { Link } from "react-router-dom";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { upcomingEvents } from "../data/communityData";

function getSavedItems(key) {
  const saved = localStorage.getItem(key);

  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function SavedEventsSummary() {
  const savedEventIds = getSavedItems(STORAGE_KEYS.savedEvents);

  const savedEvents = upcomingEvents.filter((event) => {
    return savedEventIds.includes(event.id);
  });

  if (savedEvents.length === 0) {
    return (
      <section className="saved-events-summary">
        <div className="section-header">
          <div>
            <p className="page-label">COMMUNITY</p>
            <h2>Saved Events</h2>
            <p>Save card shows, trade nights, and shop events from Community.</p>
          </div>

          <Link className="secondary-button" to="/community">
            Find Events
          </Link>
        </div>

        <div className="profile-empty-note">
          <p>No saved events yet.</p>
          <span>Events you save will appear here.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="saved-events-summary">
      <div className="section-header">
        <div>
          <p className="page-label">COMMUNITY</p>
          <h2>Saved Events</h2>
          <p>Your upcoming collector events.</p>
        </div>

        <Link className="secondary-button" to="/community">
          View Community
        </Link>
      </div>

      <div className="saved-events-list">
        {savedEvents.slice(0, 3).map((event) => (
          <Link className="saved-event-row" to="/community" key={event.id}>
            <div>
              <strong>{event.title}</strong>
              <span>{event.location}</span>
            </div>

            <small>
              {event.date} · {event.time}
            </small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SavedEventsSummary;