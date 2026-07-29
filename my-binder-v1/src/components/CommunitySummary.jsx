import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserPreferencesContext } from "../context/UserPreferencesContext";

function CommunitySummary() {
  const { savedEvents, savedShops, followedCollectors } = useContext(
    UserPreferencesContext
  );

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
          <strong>{savedEvents.length}</strong>
        </div>

        <div>
          <span>Saved Shops</span>
          <strong>{savedShops.length}</strong>
        </div>

        <div>
          <span>Following</span>
          <strong>{followedCollectors.length}</strong>
        </div>
      </div>
    </section>
  );
}

export default CommunitySummary;