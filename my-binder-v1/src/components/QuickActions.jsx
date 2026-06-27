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
          <h3>Add or Search Cards</h3>
          <p>Add new cards, search your collection, and update card details.</p>
        </Link>

        <Link className="action-card" to="/binder">
          <h3>Manage Binders</h3>
          <p>Create custom binders, track goals, and organize cards.</p>
        </Link>

        <Link className="action-card" to="/binder?view=Wishlist">
          <h3>Wishlist</h3>
          <p>Review chase cards and mark them collected when you land them.</p>
        </Link>

        <Link className="action-card" to="/binder?view=Trade%20Binder">
          <h3>Trade Binder</h3>
          <p>Check which cards are ready for future trades.</p>
        </Link>
      </div>
    </section>
  );
}

export default QuickActions;