import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  createStoreEvent,
  deleteStoreEvent,
  getStoreEvents,
  updateStoreEvent,
} from "../services/storeEventService";

const defaultEvent = {
  title: "",
  eventType: "Trade Night",
  eventDate: "",
  eventTime: "",
  location: "",
  details: "",
  eventFlyer: "",
};

function StoreEvents() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState(defaultEvent);
  const [editingEventId, setEditingEventId] = useState(null);
  const [selectedFlyer, setSelectedFlyer] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      if (!user) return;

      try {
        const storeEvents = await getStoreEvents(user.id);
        setEvents(storeEvents);
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadEvents();
  }, [user]);

  function updateField(field, value) {
    setEventForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function resetForm() {
    setEventForm(defaultEvent);
    setEditingEventId(null);
    setMessage("");
  }

  function handleFlyerUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      updateField("eventFlyer", reader.result);
    };

    reader.readAsDataURL(file);
  }

  function removeFlyer() {
    updateField("eventFlyer", "");
  }

  function startEditing(event) {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title || "",
      eventType: event.event_type || "Trade Night",
      eventDate: event.event_date || "",
      eventTime: event.event_time || "",
      location: event.location || "",
      details: event.details || "",
      eventFlyer: event.event_flyer || "",
    });
    setMessage("Editing event.");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setMessage("You need to be signed in.");
      return;
    }

    if (!eventForm.title.trim() || !eventForm.eventDate) {
      setMessage("Add an event title and date.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      if (editingEventId) {
        const updatedEvent = await updateStoreEvent(
          editingEventId,
          eventForm,
          user.id
        );

        setEvents((currentEvents) =>
          currentEvents.map((event) => {
            if (event.id === editingEventId) {
              return updatedEvent;
            }

            return event;
          })
        );

        setMessage("Event updated.");
      } else {
        const newEvent = await createStoreEvent(eventForm, user.id);
        setEvents((currentEvents) => [...currentEvents, newEvent]);
        setMessage("Event posted.");
      }

      setEventForm(defaultEvent);
      setEditingEventId(null);
    } catch (error) {
      setMessage(error.message);
    }

    setIsLoading(false);
  }

  async function handleDelete(eventId) {
    if (!user) return;

    const confirmDelete = confirm("Delete this event?");

    if (!confirmDelete) return;

    setIsLoading(true);
    setMessage("");

    try {
      await deleteStoreEvent(eventId, user.id);

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId)
      );

      if (editingEventId === eventId) {
        resetForm();
      }

      setMessage("Event deleted.");
    } catch (error) {
      setMessage(error.message);
    }

    setIsLoading(false);
  }

  return (
    <section className="store-events-card">
      {selectedFlyer && (
        <div
          className="flyer-modal-backdrop"
          role="button"
          tabIndex={0}
          onClick={() => setSelectedFlyer("")}
          onKeyDown={(event) => {
            if (event.key === "Escape" || event.key === "Enter") {
              setSelectedFlyer("");
            }
          }}
        >
          <div
            className="flyer-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="flyer-modal-close"
              type="button"
              onClick={() => setSelectedFlyer("")}
              aria-label="Close flyer"
            >
              ×
            </button>

            <img src={selectedFlyer} alt="Event flyer enlarged" />
          </div>
        </div>
      )}

      <div className="section-header">
        <div>
          <p className="page-label">STORE EVENTS</p>
          <h2>Post Store Events</h2>
          <p>
            Share trade nights, card shows, tournaments, release events, and
            shop meetups with collectors.
          </p>
        </div>
      </div>

      <form className="store-event-form" onSubmit={handleSubmit}>
        <div className="store-event-form-header">
          <div>
            <p className="page-label">
              {editingEventId ? "EDIT EVENT" : "NEW EVENT"}
            </p>
            <h3>{editingEventId ? "Update Event" : "Create Event"}</h3>
          </div>

          {editingEventId && (
            <button
              className="secondary-button"
              type="button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Event title"
          value={eventForm.title}
          onChange={(event) => updateField("title", event.target.value)}
        />

        <div className="store-event-form-grid">
          <select
            value={eventForm.eventType}
            onChange={(event) => updateField("eventType", event.target.value)}
          >
            <option>Trade Night</option>
            <option>Card Show</option>
            <option>Tournament</option>
            <option>Release Event</option>
            <option>Pack Battle</option>
            <option>Collector Meetup</option>
          </select>

          <input
            type="date"
            value={eventForm.eventDate}
            onChange={(event) => updateField("eventDate", event.target.value)}
          />

          <input
            type="text"
            placeholder="Time ex: 6:00 PM"
            value={eventForm.eventTime}
            onChange={(event) => updateField("eventTime", event.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={eventForm.location}
            onChange={(event) => updateField("location", event.target.value)}
          />
        </div>

        <textarea
          placeholder="Event details"
          value={eventForm.details}
          onChange={(event) => updateField("details", event.target.value)}
        />

        <div className="store-flyer-uploader">
          <div>
            <h3>Event Flyer</h3>
            <p>Add a flyer or promo image for this event.</p>
          </div>

          {eventForm.eventFlyer && (
            <div className="store-flyer-preview">
              <img src={eventForm.eventFlyer} alt="Event flyer preview" />
            </div>
          )}

          <div className="store-flyer-actions">
            <label className="secondary-button">
              Upload Flyer
              <input
                type="file"
                accept="image/*"
                onChange={handleFlyerUpload}
              />
            </label>

            {eventForm.eventFlyer && (
              <button
                className="secondary-button"
                type="button"
                onClick={removeFlyer}
              >
                Remove Flyer
              </button>
            )}
          </div>
        </div>

        <button className="primary-button" type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : editingEventId
              ? "Save Changes"
              : "Post Event"}
        </button>

        {message && <p className="auth-message">{message}</p>}
      </form>

      <div className="store-events-list">
        {events.length > 0 ? (
          events.map((event) => (
            <article className="store-event-card" key={event.id}>
              {event.event_flyer && (
                <div className="store-event-flyer">
                  <button
                    type="button"
                    onClick={() => setSelectedFlyer(event.event_flyer)}
                    aria-label={`Open flyer for ${event.title}`}
                  >
                    <img src={event.event_flyer} alt={event.title} />
                  </button>
                </div>
              )}

              <p className="page-label">{event.event_type}</p>
              <h3>{event.title}</h3>

              <div className="store-event-meta">
                <span>{event.event_date}</span>
                {event.event_time && <span>{event.event_time}</span>}
                {event.location && <span>{event.location}</span>}
              </div>

              {event.details && <p>{event.details}</p>}

              <div className="store-event-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => startEditing(event)}
                >
                  Edit Event
                </button>

                <button
                  className="delete-button"
                  type="button"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete Event
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="profile-empty-note">
            <p>No store events posted yet.</p>
            <span>Create your first event above.</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default StoreEvents;