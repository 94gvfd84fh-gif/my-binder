import { useState } from "react";
import PageHeader from "../ui/PageHeader";
import {
  collectors,
  communityFeatures,
  localShops,
  upcomingEvents,
} from "../data/communityData";

const SAVED_EVENTS_KEY = "pocket-deck-saved-events";
const SAVED_SHOPS_KEY = "pocket-deck-saved-shops";
const FOLLOWED_COLLECTORS_KEY = "pocket-deck-followed-collectors";

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

  const [savedShops, setSavedShops] = useState(() => {
    const saved = localStorage.getItem(SAVED_SHOPS_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }

    return [];
  });

  const [followedCollectors, setFollowedCollectors] = useState(() => {
    const saved = localStorage.getItem(FOLLOWED_COLLECTORS_KEY);

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

  const savedShopDetails = localShops.filter((shop) => {
    return savedShops.includes(shop.id);
  });

  function toggleSavedEvent(eventId) {
    const updatedSavedEvents = savedEvents.includes(eventId)
      ? savedEvents.filter((savedEventId) => savedEventId !== eventId)
      : [...savedEvents, eventId];

    setSavedEvents(updatedSavedEvents);
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(updatedSavedEvents));
  }

  function toggleSavedShop(shopId) {
    const updatedSavedShops = savedShops.includes(shopId)
      ? savedShops.filter((savedShopId) => savedShopId !== shopId)
      : [...savedShops, shopId];

    setSavedShops(updatedSavedShops);
    localStorage.setItem(SAVED_SHOPS_KEY, JSON.stringify(updatedSavedShops));
  }

  function toggleFollowCollector(collectorId) {
    const updatedFollowedCollectors = followedCollectors.includes(collectorId)
      ? followedCollectors.filter((followedId) => followedId !== collectorId)
      : [...followedCollectors, collectorId];

    setFollowedCollectors(updatedFollowedCollectors);
    localStorage.setItem(
      FOLLOWED_COLLECTORS_KEY,
      JSON.stringify(updatedFollowedCollectors)
    );
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
              <article
                className="community-event-card saved-event-card"
                key={event.id}
              >
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

      {savedShopDetails.length > 0 && (
        <section className="community-events-section saved-events-section">
          <div className="section-header">
            <div>
              <h2>Saved Shops</h2>
              <p>Local shops you want to revisit.</p>
            </div>
          </div>

          <div className="community-events-grid">
            {savedShopDetails.map((shop) => (
              <article
                className="community-event-card saved-event-card"
                key={shop.id}
              >
                <p className="page-label">LOCAL SHOP</p>
                <h3>{shop.name}</h3>

                <div className="event-detail-list">
                  <span>{shop.area}</span>
                  <span>{shop.distance}</span>
                  <span>{shop.eventType}</span>
                </div>

                <p>{shop.specialties}</p>

                <button
                  type="button"
                  className="saved-event-button"
                  onClick={() => toggleSavedShop(shop.id)}
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
            <h2>Local Shops</h2>
            <p>Support collector-friendly shops near you.</p>
          </div>
        </div>

        <div className="community-events-grid">
          {localShops.map((shop) => {
            const isSaved = savedShops.includes(shop.id);

            return (
              <article className="community-event-card" key={shop.id}>
                <p className="page-label">LOCAL SHOP</p>
                <h3>{shop.name}</h3>

                <div className="event-detail-list">
                  <span>{shop.area}</span>
                  <span>{shop.distance}</span>
                  <span>{shop.eventType}</span>
                </div>

                <p>{shop.specialties}</p>

                <button
                  type="button"
                  className={isSaved ? "saved-event-button" : ""}
                  onClick={() => toggleSavedShop(shop.id)}
                >
                  {isSaved ? "Saved" : "Save Shop"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="community-events-section">
        <div className="section-header">
          <div>
            <h2>Discover Collectors</h2>
            <p>Preview collector profiles, trade signals, and public binders.</p>
          </div>
        </div>

        <div className="community-events-grid">
          {collectors.map((collector) => {
            const isFollowing = followedCollectors.includes(collector.id);

            return (
              <article className="community-event-card" key={collector.id}>
                <p className="page-label">{collector.favoriteTcg} COLLECTOR</p>
                <h3>{collector.username}</h3>

                <div className="event-detail-list">
                  <span>{collector.style}</span>
                  <span>{collector.publicBinders} public binders</span>
                  <span>{collector.tradeStatus}</span>
                  <span>Featured: {collector.featuredCard}</span>
                </div>

                <button
                  type="button"
                  className={isFollowing ? "saved-event-button" : ""}
                  onClick={() => toggleFollowCollector(collector.id)}
                >
                  {isFollowing ? "Following" : "Follow Preview"}
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