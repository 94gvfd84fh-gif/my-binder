import PageHeader from "../ui/PageHeader";

function Marketplace() {
  return (
    <div>
      <PageHeader
        label="POCKET DECK MARKETPLACE"
        title="Marketplace"
        description="Buy, sell, and trade features are coming soon to Pocket Deck."
      />

      <div className="marketplace-preview">
        <section className="marketplace-card">
          <p className="page-label">BUY</p>
          <h2>Find Cards</h2>
          <p>Discover cards from collectors and shops when marketplace listings go live.</p>
        </section>

        <section className="marketplace-card">
          <p className="page-label">SELL</p>
          <h2>List Cards</h2>
          <p>Turn cards from your collection into future listings with condition and value details.</p>
        </section>

        <section className="marketplace-card">
          <p className="page-label">TRADE</p>
          <h2>Match Trades</h2>
          <p>Use wishlists and trade binders to connect with collectors looking for the same cards.</p>
        </section>
      </div>
    </div>
  );
}

export default Marketplace;