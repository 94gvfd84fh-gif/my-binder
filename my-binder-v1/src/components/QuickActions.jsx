import { Link } from "react-router-dom";

function QuickActions() {
  return (
    <section className="quick-actions">
      <div className="section-header">
        <div>
          <h2>Quick Actions</h2>
          <p>Jump back into the parts of your collection that matter most.</p>
        </div>
      </div>

      <div className="action-grid">
        <Link className="action-card" to="/collection">
          <h3>Add Card</h3>
          <p>Add a new pull, favorite, or graded card to your collection.</p>
        </Link>

        <Link className="action-card" to="/binder">
          <h3>Open Binder</h3>
          <p>Flip through your binders and organize your cards.</p>
        </Link>

        <Link className="action-card" to="/collection">
          <h3>Search Collection</h3>
          <p>Find cards by name, set, status, condition, or binder.</p>
        </Link>

        <Link className="action-card" to="/marketplace">
          <h3>Marketplace</h3>
          <p>Prepare your collection for future buying, selling, and trading.</p>
        </Link>
      </div>
    </section>
  );
}

export default QuickActions;