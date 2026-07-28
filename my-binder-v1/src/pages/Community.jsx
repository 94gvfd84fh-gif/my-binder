import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../ui/PageHeader";
import CommunityCard from "../ui/CommunityCard";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { getPublicProfiles } from "../services/profileService";
import { getPublicStoreEvents } from "../services/storeEventService";
import {
  collectors,
  communityFeatures,
  localShops,
  upcomingEvents,
} from "../data/communityData";

const communityFilters = ["All", "Collectors", "Stores", "Events", "Trade Nights"];

function getFeatureTarget(feature) {
  if (feature.label === "LOCAL SHOPS") return "#stores";
  if (feature.label === "COLLECTORS") return "#collectors";
  if (feature.label === "MARKETPLACE") return "/trade-list";

  return "#events";
}

function normalizeStoreEvent(event) {
  return {
    id: "store-event-" + event.id,
    type: event.event_type || "Store Event",
    title: event.title || "Store Event",
    date: event.event_date || "",
    time: event.event_time || "",
    location: event.location || "",
    details: event.details || "",
    flyer: event.event_flyer || "",
    isStorePosted: true,
  };
}

function normalizeProfile(profile) {
  const accountType = profile.account_type || "Collector";
  const isStore = accountType === "Store";

  return {
    id: "profile-" + profile.id,
    profileId: profile.id,
    accountType,
    username: profile.username || (isStore ? "Beacon Store" : "Beacon Collector"),
    favoriteTcg: profile.favorite_tcg || "Cards",
    favoriteSet: profile.favorite_set || "",
    location: profile.location || "Online",
    collectorSince: profile.collector_since || "",
    bio: profile.bio || "Beacon Collect profile",
    featuredCard: profile.favorite_set || "Featured card not set yet",
    isSupabaseProfile: true,
  };
}

function profileToCollector(profile) {
  return {
    id: profile.id,
    username: profile.username,
    favoriteTcg: profile.favoriteTcg,
    style: profile.bio,
    publicBinders: "Public",
    tradeStatus: profile.location
      ? "Located in " + profile.location
      : "Open to connect",
    featuredCard: profile.featuredCard,
    isSupabaseProfile: true,
    linkTo: "/community/profile/" + profile.profileId,
  };
}

function profileToStore(profile) {
  return {
    id: profile.id,
    name: profile.username,
    area: profile.location,
    distance: "Beacon store profile",
    specialties: profile.bio,
    eventType: "Posts card shows, trade nights, and shop events",
    isSupabaseProfile: true,
    linkTo: "/community/profile/" + profile.profileId,
  };
}

function normalizeMockCollector(collector) {
  return {
    ...collector,
    linkTo: "/community/collector/" + collector.id,
  };
}

function textIncludes(value, searchText) {
  return String(value || "").toLowerCase().includes(searchText);
}

function matchesSearch(fields, searchText) {
  if (!searchText) return true;

  return fields.some((field) => textIncludes(field, searchText));
}

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

function Community() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [storeEvents, setStoreEvents] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [communityMessage, setCommunityMessage] = useState("");

  const [savedEvents, setSavedEvents] = useState(() =>
    getSavedItems(STORAGE_KEYS.savedEvents)
  );

  const [savedStores, setSavedStores] = useState(() =>
    getSavedItems(STORAGE_KEYS.savedShops)
  );

  const [followedCollectors, setFollowedCollectors] = useState(() =>
    getSavedItems(STORAGE_KEYS.followedCollectors)
  );

  useEffect(() => {
    async function loadCommunityDiscovery() {
      setCommunityMessage("");

      try {
        const [publicEvents, profiles] = await Promise.all([
          getPublicStoreEvents(),
          getPublicProfiles(),
        ]);

        setStoreEvents(publicEvents.map(normalizeStoreEvent));
        setPublicProfiles(profiles.map(normalizeProfile));
      } catch {
        setCommunityMessage(
          "Community discovery is available. Some sample results are included while more collectors and stores join Beacon."
        );
      }
    }

    loadCommunityDiscovery();
  }, []);

  const searchText = search.trim().toLowerCase();

  const liveCollectors = publicProfiles
    .filter((profile) => profile.accountType !== "Store")
    .map(profileToCollector);

  const liveStores = publicProfiles
    .filter((profile) => profile.accountType === "Store")
    .map(profileToStore);

  const allEvents = [...storeEvents, ...upcomingEvents];
  const allStores = [...liveStores, ...localShops];
  const allCollectors = [
    ...liveCollectors,
    ...collectors.map(normalizeMockCollector),
  ];

  const showAll = activeFilter === "All";
  const showCollectors = showAll || activeFilter === "Collectors";
  const showStores = showAll || activeFilter === "Stores";
  const showEvents =
    showAll || activeFilter === "Events" || activeFilter === "Trade Nights";

  const filteredEvents = allEvents.filter((event) => {
    const matchesFilter =
      activeFilter !== "Trade Nights" || textIncludes(event.type, "trade night");

    return (
      matchesFilter &&
      matchesSearch(
        [event.title, event.type, event.location, event.details, event.date],
        searchText
      )
    );
  });

  const filteredStores = allStores.filter((store) => {
    return matchesSearch(
      [store.name, store.area, store.distance, store.eventType, store.specialties],
      searchText
    );
  });

  const filteredCollectors = allCollectors.filter((collector) => {
    return matchesSearch(
      [
        collector.username,
        collector.favoriteTcg,
        collector.style,
        collector.tradeStatus,
        collector.featuredCard,
      ],
      searchText
    );
  });

  const visibleResultCount =
    (showEvents ? filteredEvents.length : 0) +
    (showStores ? filteredStores.length : 0) +
    (showCollectors ? filteredCollectors.length : 0);

  const savedEventDetails = allEvents.filter((event) => {
    return savedEvents.includes(event.id);
  });

  const savedStoreDetails = allStores.filter((store) => {
    return savedStores.includes(store.id);
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

  function toggleSavedStore(storeId) {
    const updatedSavedStores = savedStores.includes(storeId)
      ? savedStores.filter((savedStoreId) => savedStoreId !== storeId)
      : [...savedStores, storeId];

    setSavedStores(updatedSavedStores);
    localStorage.setItem(
      STORAGE_KEYS.savedShops,
      JSON.stringify(updatedSavedStores)
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
        description="Search collectors, stores, card shows, trade nights, and local hobby events."
      />

      <section className="community-search-card">
        <p className="page-label">DISCOVER</p>
        <h2>Find collectors, stores, and events</h2>
        <p>
          Search by username, store name, city, card type, event type, or trade
          night.
        </p>

        <input
          type="search"
          placeholder="Search Sacramento, trade night, Pokemon, shops, collectors..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="community-filter-pills" aria-label="Community filters">
          {communityFilters.map((filter) => (
            <button
              className={activeFilter === filter ? "active-community-filter" : ""}
              type="button"
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="community-result-summary">
          <span>{visibleResultCount} results</span>
          <span>{liveCollectors.length} live collectors</span>
          <span>{liveStores.length} store profiles</span>
          <span>{storeEvents.length} store events</span>
        </div>
      </section>

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

      {showEvents && (
        <section className="community-events-section" id="events">
          <div className="section-header">
            <div>
              <h2>
                {activeFilter === "Trade Nights"
                  ? "Trade Nights"
                  : "Upcoming Events"}
              </h2>
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
                      event.isStorePosted ? "STORE " + event.type : event.type
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
              <span>Try searching a different city, event type, or store.</span>
            </div>
          )}
        </section>
      )}

      {savedStoreDetails.length > 0 && (
        <section className="community-events-section saved-events-section">
          <div className="section-header">
            <div>
              <h2>Saved Stores</h2>
              <p>Stores and shops you want to revisit.</p>
            </div>
          </div>

          <div className="community-events-grid">
            {savedStoreDetails.map((store) => (
              <CommunityCard
                key={store.id}
                label={store.isSupabaseProfile ? "BEACON STORE" : "LOCAL SHOP"}
                title={store.name}
                details={[store.area, store.distance, store.eventType]}
                description={store.specialties}
                linkTo={store.linkTo}
                linkText="View Store"
                buttonText="Remove Saved"
                buttonClassName="saved-event-button"
                onButtonClick={() => toggleSavedStore(store.id)}
              />
            ))}
          </div>
        </section>
      )}

      {showStores && (
        <section className="community-events-section" id="stores">
          <div className="section-header">
            <div>
              <h2>Stores & Shops</h2>
              <p>Find Beacon store profiles and collector-friendly shops.</p>
            </div>
          </div>

          {filteredStores.length > 0 ? (
            <div className="community-events-grid">
              {filteredStores.map((store) => {
                const isSaved = savedStores.includes(store.id);

                return (
                  <CommunityCard
                    key={store.id}
                    label={store.isSupabaseProfile ? "BEACON STORE" : "LOCAL SHOP"}
                    title={store.name}
                    details={[store.area, store.distance, store.eventType]}
                    description={store.specialties}
                    linkTo={store.linkTo}
                    linkText="View Store"
                    buttonText={isSaved ? "Saved" : "Save Store"}
                    buttonClassName={isSaved ? "saved-event-button" : ""}
                    onButtonClick={() => toggleSavedStore(store.id)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="profile-empty-note">
              <p>No matching stores found.</p>
              <span>Try searching by city, area, or store name.</span>
            </div>
          )}
        </section>
      )}

      {showCollectors && (
        <section className="community-events-section" id="collectors">
          <div className="section-header">
            <div>
              <h2>Discover Collectors</h2>
              <p>Search collector profiles, trade signals, and public binders.</p>
            </div>
          </div>

          {filteredCollectors.length > 0 ? (
            <div className="community-events-grid">
              {filteredCollectors.map((collector) => {
                const isFollowing = followedCollectors.includes(collector.id);

                return (
                  <CommunityCard
                    key={collector.id}
                    label={
                      collector.isSupabaseProfile
                        ? "LIVE " + collector.favoriteTcg + " COLLECTOR"
                        : collector.favoriteTcg + " COLLECTOR"
                    }
                    title={collector.username}
                    details={[
                      collector.style,
                      String(collector.publicBinders) + " public binders",
                      collector.tradeStatus,
                      "Featured: " + collector.featuredCard,
                    ]}
                    linkTo={collector.linkTo}
                    linkText="View Profile"
                    buttonText={
                      isFollowing
                        ? "Following"
                        : collector.isSupabaseProfile
                          ? "Follow"
                          : "Follow Preview"
                    }
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
      )}

      <div className="marketplace-note">
        <p className="page-label">COMMUNITY FOUNDATION</p>
        <h3>A home for collectors</h3>
        <p>
          Beacon Collect is becoming the place collectors use to connect, trade,
          discover events, support shops, and build reputation.
        </p>
      </div>
    </div>
  );
}

export default Community;