import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { upcomingEvents } from "../data/communityData";
import { getPublicStoreEvents } from "../services/storeEventService";

function normalizeStoreEvent(event) {
  return {
    id: "store-event-" + event.id,
    title: event.title || "Store Event",
    date: event.event_date || "",
    time: event.event_time || "",
    location: event.location || "",
    type: event.event_type || "Store Event",
  };
}

function SavedEventsSummary() {
  const [storeEvents, setStoreEvents] = useState([]);
  const { savedEvents: savedEventIds } = useContext(UserPreferencesContext);

  useEffect(() => {
    async function loadStoreEvents() {
      try {
        const publicEvents = await getPublicStoreEvents();
        setStoreEvents(publicEvents.map(normalizeStoreEvent));
      } catch {
        setStoreEvents([]);
      }
    }

    loadStoreEvents();
  }, []);

  const allEvents = [...storeEvents, ...upcomingEvents];

  const savedEvents = allEvents.filter((event) => {
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
              <span>{event.location || "Location not set"}</span>
            </div>

            <small>
              {event.date || "Date not set"} · {event.time || "Time not set"}
            </small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SavedEventsSummary;