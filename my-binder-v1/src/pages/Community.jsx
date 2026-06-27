import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../ui/PageHeader";
import CommunityCard from "../ui/CommunityCard";
import { STORAGE_KEYS } from "../constants/storageKeys";
import {
  collectors,
  communityFeatures,
  localShops,
  upcomingEvents,
} from "../data/communityData";

function getFeatureTarget(feature) {
  if (feature.label === "LOCAL SHOPS") {
    return "#local-shops";
  }

  if (feature.label === "COLLECTORS") {
    return "#discover-collectors";
  }

  if (feature.label === "MARKETPLACE") {
    return "/trade-list";
  }

  return "#upcoming-events";
}

function Community() {
  const [savedEvents, setSavedEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.savedEvents);

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
    const saved = localStorage.getItem(STORAGE_KEYS.savedShops);

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
    const saved = localStorage.getItem(STORAGE_KEYS.followedCollectors);

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
    localStorage.setItem(
      STORAGE_KEYS.savedEvents,
      JSON.stringify(updatedSavedEvents)
    );
  }

  function toggleSavedShop(shopId) {
    const updatedSavedShops = savedShops.includes(shopId)
      ? savedShops.filter((savedShopId) => savedShopId !== shopId)
      : [...savedShops, shopId];

    setSavedShops(updatedSavedShops);
    localStorage.setItem(
      STORAGE_KEYS.savedShops,
      JSON.stringify(updatedSavedShops)
    );
  }

  function toggleFollowCollector(collectorId) {
    const updatedFollowedCollectors = followedCollectors.includes(collectorId)
      ? followedCollectors.filter((followedId) => followedId !== collectorId)
      : [...followedCollectors, collectorId];

    setFollowedCollectors(updatedFollowedCollectors);
    localStorage.setItem(
      STORAGE_KEYS.followedCollectors,
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
        {communityFeatures.map((feature) => {
          const target = getFeatureTarget(feature);
          const isRouteLink = target.startsWith("/");

          if (isRouteLink) {
            return (
              <Link
                className="marketplace-card community-feature-link"
                to={target}
                key={feature.title}
              >
                <p className="page-label">{feature.label}</p>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
                <span>Open</span>
              </Link>
            );
          }

          return (
            <a
              className="marketplace-card community-feature-link"
              href={target}
              key={feature.title}
            >
              <p className="page-label">{feature.label}</p>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
              <span>Jump to section</span>
            </a>
          );
        })}
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
              <CommunityCard
                key={event.id}
                label={event.type}
                title={event.title}
                details={[event.date, event.time, event.location]}
                description={event.details}
                buttonText="Remove Saved"
                buttonClassName="saved-event-button"
                onButtonClick={() => toggleSavedEvent(event.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="community-events-section" id="upcoming-events">
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
              <CommunityCard
                key={event.id}
                label={event.type}
                title={event.title}
                details={[event.date, event.time, event.location]}
                description={event.details}
                buttonText={isSaved ? "Saved" : "Save Event"}
                buttonClassName={isSaved ? "saved-event-button" : ""}
                onButtonClick={() => toggleSavedEvent(event.id)}
              />
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
              <CommunityCard
                key={shop.id}
                label="LOCAL SHOP"
                title={shop.name}
                details={[shop.area, shop.distance, shop.eventType]}
                description={shop.specialties}
                buttonText="Remove Saved"
                buttonClassName="saved-event-button"
                onButtonClick={() => toggleSavedShop(shop.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="community-events-section" id="local-shops">
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
              <CommunityCard
                key={shop.id}
                label="LOCAL SHOP"
                title={shop.name}
                details={[shop.area, shop.distance, shop.eventType]}
                description={shop.specialties}
                buttonText={isSaved ? "Saved" : "Save Shop"}
                buttonClassName={isSaved ? "saved-event-button" : ""}
                onButtonClick={() => toggleSavedShop(shop.id)}
              />
            );
          })}
        </div>
      </section>

      <section className="community-events-section" id="discover-collectors">
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
              <CommunityCard
                key={collector.id}
                label={`${collector.favoriteTcg} COLLECTOR`}
                title={collector.username}
                details={[
                  collector.style,
                  `${collector.publicBinders} public binders`,
                  collector.tradeStatus,
                  `Featured: ${collector.featuredCard}`,
                ]}
                buttonText={isFollowing ? "Following" : "Follow Preview"}
                buttonClassName={isFollowing ? "saved-event-button" : ""}
                onButtonClick={() => toggleFollowCollector(collector.id)}
              />
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