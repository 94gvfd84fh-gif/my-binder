import { Link } from "react-router-dom";

const SAVED_EVENTS_KEY = "pocket-deck-saved-events";
const SAVED_SHOPS_KEY = "pocket-deck-saved-shops";
const FOLLOWED_COLLECTORS_KEY = "pocket-deck-followed-collectors";

function getSavedCount(key) {
  const saved = localStorage.getItem(key);

  if (!saved) {
    return 0;
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

function CommunitySummary() {
  const savedEvents = getSavedCount(SAVED_EVENTS_KEY);
  const savedShops = getSavedCount(SAVED_SHOPS_KEY);
  const followedCollectors = getSavedCount(FOLLOWED_COLLECTORS_KEY);

  return (
    <section className="community-summary">
      <div className="section-header">
        <div>
          <h2>Community</h2>
          <p>Your saved events, shops, and collector connections.</p>
        </div>

        <Link to="/community" className="secondary-button">
          Open Community
        </Link>
      </div>

      <div className="community-summary-grid">
        <div>
          <span>Saved Events</span>
          <strong>{savedEvents}</strong>
        </div>

        <div>
          <span>Saved Shops</span>
          <strong>{savedShops}</strong>
        </div>

        <div>
          <span>Following</span>
          <strong>{followedCollectors}</strong>
        </div>
      </div>
    </section>
  );
}

export default CommunitySummary;