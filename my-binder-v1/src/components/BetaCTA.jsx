import { Link } from "react-router-dom";

function BetaCTA() {
  return (
    <section className="beta-demo-cta">
      <div>
        <p className="page-label">GET STARTED</p>
        <h2>Build your collection with Beacon Collect</h2>
        <p>
          Track cards, organize binders, save wishlist cards, and discover
          collector activity in one place.
        </p>
      </div>

      <div className="beta-demo-actions">
        <Link className="primary-button" to="/collection">
          Open Collection
        </Link>

        <Link className="secondary-button" to="/community">
          Explore Community
        </Link>
      </div>
    </section>
  );
}

export default BetaCTA;
