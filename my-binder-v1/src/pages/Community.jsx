import { useState } from "react";
import PageHeader from "../ui/PageHeader";

const SAVED_EVENTS_KEY = "pocket-deck-saved-events";

const communityFeatures = [
  {
    label: "EVENTS",
    title: "Card Shows",
    description:
      "Discover nearby card shows, conventions, and collector meetups.",
  },
  {
    label: "TRADE NIGHTS",
    title: "Local Trade Nights",
    description:
      "Find shop-hosted trade nights and collector events in your area.",
  },
  {
    label: "LOCAL SHOPS",
    title: "Card Shops",
    description:
      "Support local game stores, card shops, and hobby shops near you.",
  },
  {
    label: "COLLECTORS",
    title: "Discover Collectors",
    description:
      "Browse public profiles, binders, featured cards, and future reputation signals.",
  },
  {
    label: "MARKETPLACE",
    title: "Buy & Sell",
    description:
      "Prepare sale-ready cards and future listings powered by your collection.",
  },
];

const upcomingEvents = [
  {
    id: "sacramento-card-show",
    type: "CARD SHOW",
    title: "Sacramento Card Show",
    date: "July 12, 2026",
    time: "10:00 AM",
    location: "Cal Expo · Sacramento, CA",
    details: "Vintage, modern, slabs, wax, and local collectors.",
  },
  {
    id: "friday-trade-night",
    type: "TRADE NIGHT",
    title: "Friday Trade Night",
    date: "July 17, 2026",
    time: "6:00 PM",
    location: "Golden Empire Card Shop",
    details: "Bring your trade binder and wishlist.",
  },
  {
    id: "collect-a-con",
    type: "CONVENTION",
    title: "Collect-A-Con",
    date: "August 8, 2026",
    time: "9:00 AM",
    location: "Anaheim Convention Center",
    details: "Cards, collectibles, creators, vendors, and grading booths.",
  },
  {
    id: "weekend-pack-battle",
    type: "LOCAL SHOP",
    title: "Weekend Pack Battle",
    date: "August 15, 2026",
    time: "1:00 PM",
    location: "Local Game Store",
    details: "Casual collector meetup with pack battles and trades.",
  },
];

function Community() {
  const [savedEvents, setSavedEvents] = useState(() => {
    const saved = localStorage.getItem(SAVED_EVENTS_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }

    return [];
  });

  const savedEventDetails = upcomingEvents.filter((event) => {
    return savedEvents.includes(event.id);
  });

  function toggleSavedEvent(eventId) {
    const updatedSavedEvents = savedEvents.includes(eventId)
      ? savedEvents.filter((savedEventId) => savedEventId !== eventId)
      : [...savedEvents, eventId];

    setSavedEvents(updatedSavedEvents);
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(updatedSavedEvents));
  }

  return (
    <div>
      <PageHeader
        label="POCKET DECK COMMUNITY"
        title="Community"
        description="Find collectors, events, shops, trades, and marketplace opportunities around the hobby."
      />

      <div className="marketplace-preview">
        {communityFeatures.map((feature) => (
          <section className="marketplace-card" key={feature.title}>
            <p className="page-label">{feature.label}</p>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </section>
        ))}
      </div>

      {savedEventDetails.length > 0 && (
        <section className="community-events-section saved-events-section">
          <div className="section-header">
            <div>
              <h2>Saved Events</h2>
              <p>Events you want to keep an eye on.</p>
            </div>
          </div>

          <div className="community-events-grid">
            {savedEventDetails.map((event) => (
              <article className="community-event-card saved-event-card" key={event.id}>
                <p className="page-label">{event.type}</p>
                <h3>{event.title}</h3>

                <div className="event-detail-list">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                  <span>{event.location}</span>
                </div>

                <p>{event.details}</p>

                <button
                  type="button"
                  className="saved-event-button"
                  onClick={() => toggleSavedEvent(event.id)}
                >
                  Remove Saved
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="community-events-section">
        <div className="section-header">
          <div>
            <h2>Upcoming Events</h2>
            <p>Preview local shows, trade nights, conventions, and shop events.</p>
          </div>
        </div>

        <div className="community-events-grid">
          {upcomingEvents.map((event) => {
            const isSaved = savedEvents.includes(event.id);

            return (
              <article className="community-event-card" key={event.id}>
                <p className="page-label">{event.type}</p>
                <h3>{event.title}</h3>

                <div className="event-detail-list">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                  <span>{event.location}</span>
                </div>

                <p>{event.details}</p>

                <button
                  type="button"
                  className={isSaved ? "saved-event-button" : ""}
                  onClick={() => toggleSavedEvent(event.id)}
                >
                  {isSaved ? "Saved" : "Save Event"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <div className="marketplace-note">
        <p className="page-label">V0.9 DIRECTION</p>
        <h3>A home for collectors</h3>
        <p>
          Pocket Deck is growing beyond collection management into the place
          collectors use to connect, trade, discover events, support shops, and
          build reputation.
        </p>
      </div>
    </div>
  );
}

export default Community;