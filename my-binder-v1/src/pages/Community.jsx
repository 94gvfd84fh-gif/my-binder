import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../ui/PageHeader";
import CommunityCard from "../ui/CommunityCard";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { getPublicStoreEvents } from "../services/storeEventService";
import {
  collectors,
  communityFeatures,
  localShops,
  upcomingEvents,
} from "../data/communityData";

function getFeatureTarget(feature) {
  if (feature.label === "LOCAL SHOPS") return "#local-shops";
  if (feature.label === "COLLECTORS") return "#discover-collectors";
  if (feature.label === "MARKETPLACE") return "/trade-list";

  return "#upcoming-events";
}

function normalizeStoreEvent(event) {
  return {
    id: `store-${event.id}`,
    type: event.event_type || "STORE EVENT",
    title: event.title || "Store Event",
    date: event.event_date || "",
    time: event.event_time || "",
    location: event.location || "",
    details: event.details || "",
    flyer: event.event_flyer || "",
    isStorePosted: true,
  };
}

function textIncludes(value, searchText) {
  return String(value || "").toLowerCase().includes(searchText);
}

function Community() {
  const [search, setSearch] = useState("");
  const [storeEvents, setStoreEvents] = useState([]);
  const [communityMessage, setCommunityMessage] = useState("");

  const [savedEvents, setSavedEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.savedEvents);
    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [savedShops, setSavedShops] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.savedShops);
    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [followedCollectors, setFollowedCollectors] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.followedCollectors);
    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function loadStoreEvents() {
      try {
        const publicEvents = await getPublicStoreEvents();
        setStoreEvents(publicEvents.map(normalizeStoreEvent));
      } catch (error) {
        setCommunityMessage(error.message);
      }
    }

    loadStoreEvents();
  }, []);

  const searchText = search.trim().toLowerCase();

  const allEvents = [...storeEvents, ...upcomingEvents];

  const filteredEvents = allEvents.filter((event) => {
    if (!searchText) return true;

    return (
      textIncludes(event.title, searchText) ||
      textIncludes(event.type, searchText) ||
      textIncludes(event.location, searchText) ||
      textIncludes(event.details, searchText)
    );
  });

  const filteredShops = localShops.filter((shop) => {
    if (!searchText) return true;

    return (
      textIncludes(shop.name, searchText) ||
      textIncludes(shop.area, searchText) ||
      textIncludes(shop.distance, searchText) ||
      textIncludes(shop.eventType, searchText) ||
      textIncludes(shop.specialties, searchText)
    );
  });

  const filteredCollectors = collectors.filter((collector) => {
    if (!searchText) return true;

    return (
      textIncludes(collector.username, searchText) ||
      textIncludes(collector.favoriteTcg, searchText) ||
      textIncludes(collector.style, searchText) ||
      textIncludes(collector.tradeStatus, searchText) ||
      textIncludes(collector.featuredCard, searchText)
    );
  });

  const savedEventDetails = allEvents.filter((event) => {
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
        label="BEACON COLLECT COMMUNITY"
        title="Community"
        description="Find collectors, events, shops, trades, and marketplace opportunities around the hobby."
      />

      <div className="community-search-card">
        <p className="page-label">DISCOVER</p>
        <h2>Find collectors, shops, and events</h2>
        <input
          type="search"
          placeholder="Search events, shops, collectors, city, or state..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {communityMessage && <p className="auth-message">{communityMessage}</p>}

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
            <p>
              Store-posted events, local shows, trade nights, conventions, and
              shop events.
            </p>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="community-events-grid">
            {filteredEvents.map((event) => {
              const isSaved = savedEvents.includes(event.id);

              return (
                <CommunityCard
                  key={event.id}
                  label={
                    event.isStorePosted ? `STORE ${event.type}` : event.type
                  }
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
        ) : (
          <div className="profile-empty-note">
            <p>No matching events found.</p>
            <span>Try searching a different city, event type, or shop.</span>
          </div>
        )}
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

        {filteredShops.length > 0 ? (
          <div className="community-events-grid">
            {filteredShops.map((shop) => {
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
        ) : (
          <div className="profile-empty-note">
            <p>No matching shops found.</p>
            <span>Try searching by city, area, or shop name.</span>
          </div>
        )}
      </section>

      <section className="community-events-section" id="discover-collectors">
        <div className="section-header">
          <div>
            <h2>Discover Collectors</h2>
            <p>Preview collector profiles, trade signals, and public binders.</p>
          </div>
        </div>

        {filteredCollectors.length > 0 ? (
          <div className="community-events-grid">
            {filteredCollectors.map((collector) => {
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
                  linkTo={`/community/collector/${collector.id}`}
                  linkText="View Profile"
                  buttonText={isFollowing ? "Following" : "Follow Preview"}
                  buttonClassName={isFollowing ? "saved-event-button" : ""}
                  onButtonClick={() => toggleFollowCollector(collector.id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="profile-empty-note">
            <p>No matching collectors found.</p>
            <span>Try searching by name, TCG, trade status, or style.</span>
          </div>
        )}
      </section>

      <div className="marketplace-note">
        <p className="page-label">COMMUNITY FOUNDATION</p>
        <h3>A home for collectors</h3>
        <p>
          Beacon Collect is growing beyond collection management into the place
          collectors use to connect, trade, discover events, support shops, and
          build reputation.
        </p>
      </div>
    </div>
  );
}

export default Community;