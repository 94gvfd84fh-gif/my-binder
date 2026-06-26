function QuickActions() {
  return (
    <section className="quick-actions">
      <h2>Quick Actions</h2>

      <div className="action-grid">
        <button className="action-card">
          <h3>➕ Add Card</h3>
          <p>Add a new card to your collection.</p>
        </button>

        <button className="action-card">
          <h3>📖 Open Binder</h3>
          <p>View your digital binder.</p>
        </button>

        <button className="action-card">
          <h3>🔍 Search</h3>
          <p>Find cards in your collection.</p>
        </button>

        <button className="action-card">
          <h3>🛒 Marketplace</h3>
          <p>Buy, sell, or trade cards.</p>
        </button>
      </div>
    </section>
  );
}

export default QuickActions;