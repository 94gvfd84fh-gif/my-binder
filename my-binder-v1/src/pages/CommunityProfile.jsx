import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../ui/PageHeader";
import CommunityCard from "../ui/CommunityCard";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { getPublicProfile } from "../services/profileService";
import { getPublicStoreEventsByStore } from "../services/storeEventService";
import "../styles/collectorProfile.css";

function toProfileView(profile) {
  const accountType = profile.account_type || "Collector";
  const isStore = accountType === "Store";

  return {
    id: profile.id,
    accountType,
    isStore,
    name: profile.username || (isStore ? "Beacon Store" : "Beacon Collector"),
    favoriteTcg: profile.favorite_tcg || "Cards",
    favoriteSet: profile.favorite_set || "Not set yet",
    location: profile.location || "Online",
    collectorSince: profile.collector_since || "Not set yet",
    bio: profile.bio || "This Beacon profile is still being filled out.",
    avatar: profile.avatar || "",
    featuredCard: profile.favorite_set || "Featured card not set yet",
    profileTheme: profile.profile_theme || "Beacon Dark",
    profileAccentColor: profile.profile_accent_color || "#2563EB",
    profileBanner: profile.profile_banner || "",
    profileLayout: profile.profile_layout || "Classic",
    profileTagline: profile.profile_tagline || "",
  };
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
  };
}

function CommunityProfile() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [storeEvents, setStoreEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const {
    savedEvents,
    savedStores,
    toggleSavedEvent,
    toggleSavedStore,
  } = useContext(UserPreferencesContext);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      setMessage("");

      try {
        const publicProfile = await getPublicProfile(profileId);

        if (!publicProfile) {
          setMessage("This Beacon profile could not be found.");
          setIsLoading(false);
          return;
        }

        const profileView = toProfileView(publicProfile);
        setProfile(profileView);

        if (profileView.isStore) {
          const events = await getPublicStoreEventsByStore(profileId);
          setStoreEvents(events.map(normalizeStoreEvent));
        }
      } catch (error) {
        setMessage(error.message);
      }

      setIsLoading(false);
    }

    loadProfile();
  }, [profileId]);

  if (isLoading) {
    return (
      <div>
        <PageHeader
          label="BEACON COMMUNITY"
          title="Loading profile"
          description="Getting this public Beacon profile."
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <PageHeader
          label="BEACON COMMUNITY"
          title="Profile Not Found"
          description={message || "This public profile does not exist yet."}
        />

        <Link className="secondary-button" to="/community">
          Back to Community
        </Link>
      </div>
    );
  }

  const isStoreSaved = savedStores.includes(profile.id);
  const themeClass = profile.profileTheme.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const layoutClass = profile.profileLayout.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const communitySignals = profile.isStore
    ? [
        { label: "Events", value: storeEvents.length },
        { label: "Saved", value: isStoreSaved ? "Yes" : "Not Yet" },
        { label: "Location", value: profile.location },
      ]
    : [
        { label: "Collects", value: profile.favoriteTcg },
        { label: "Featured", value: profile.featuredCard },
        { label: "Location", value: profile.location },
      ];

  return (
    <div>
      <PageHeader
        label={profile.isStore ? "STORE PROFILE" : "COLLECTOR PROFILE"}
        title={profile.name}
        description={
          profile.isStore
            ? "View this shop's Beacon profile, public events, and community details."
            : "View this collector's Beacon profile, collecting style, and community details."
        }
      />

      {message && <p className="auth-message">{message}</p>}

      <section
        className={`collector-detail-card community-profile-card theme-${themeClass} layout-${layoutClass}`}
        style={{ "--profile-accent": profile.profileAccentColor }}
      >
        {profile.profileBanner && (
          <div
            className="community-profile-banner"
            style={{ backgroundImage: `url(${profile.profileBanner})` }}
          >
            <img src={profile.profileBanner} alt="Profile banner" />
          </div>
        )}

        <div className="collector-detail-hero">
          <div className="collector-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <span>{profile.name.charAt(0)}</span>
            )}
          </div>

          <div>
            <p className="page-label">
              {profile.isStore
                ? "BEACON STORE"
                : profile.favoriteTcg + " COLLECTOR"}
            </p>
            <h2>{profile.name}</h2>
            {profile.profileTagline && (
              <p className="community-profile-tagline">{profile.profileTagline}</p>
            )}
            <p>{profile.bio}</p>
          </div>
        </div>

        <div className="community-signal-strip">
          {communitySignals.map((signal) => (
            <div key={signal.label}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
            </div>
          ))}
        </div>

        <div className="collector-detail-stats">
          <div>
            <span>{profile.isStore ? "Shop Type" : "Favorite TCG"}</span>
            <strong>{profile.favoriteTcg}</strong>
          </div>

          <div>
            <span>{profile.isStore ? "Store Since" : "Collector Since"}</span>
            <strong>{profile.collectorSince}</strong>
          </div>

          <div>
            <span>Location</span>
            <strong>{profile.location}</strong>
          </div>
        </div>

        <div className="collector-detail-stats community-profile-wide-stats">
          <div>
            <span>{profile.isStore ? "Known For" : "Featured"}</span>
            <strong>{profile.featuredCard}</strong>
          </div>

          <div>
            <span>Account Type</span>
            <strong>{profile.accountType}</strong>
          </div>

          {profile.isStore && (
            <div>
              <span>Posted Events</span>
              <strong>{storeEvents.length}</strong>
            </div>
          )}
        </div>

        <div className="collector-detail-actions">
          <button
            className={isStoreSaved ? "secondary-button" : "primary-button"}
            type="button"
            onClick={() => toggleSavedStore(profile.id)}
          >
            {profile.isStore
              ? isStoreSaved
                ? "Saved Shop"
                : "Save Shop"
              : "Follow Collector"}
          </button>

          {profile.isStore && storeEvents.length > 0 && (
            <a className="secondary-button" href="#store-events">
              View Events
            </a>
          )}

          <Link className="secondary-button" to="/community">
            Back to Community
          </Link>
        </div>
      </section>

      {profile.isStore && (
        <section className="community-events-section" id="store-events">
          <div className="section-header">
            <div>
              <h2>Public Events</h2>
              <p>Card shows, trade nights, and shop events posted by this store.</p>
            </div>
          </div>

          {storeEvents.length > 0 ? (
            <div className="community-events-grid">
              {storeEvents.map((event) => {
                const isSaved = savedEvents.includes(event.id);

                return (
                  <CommunityCard
                    key={event.id}
                    label={"STORE " + event.type}
                    title={event.title}
                    details={[event.date, event.time, event.location]}
                    description={event.details}
                    image={event.flyer}
                    imageAlt={`${event.title} flyer`}
                    buttonText={isSaved ? "Saved" : "Save Event"}
                    buttonClassName={isSaved ? "saved-event-button" : ""}
                    onButtonClick={() => toggleSavedEvent(event.id)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="profile-empty-note">
              <p>No public events yet.</p>
              <span>This store has not posted any events.</span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default CommunityProfile;