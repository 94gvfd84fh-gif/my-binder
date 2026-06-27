import PageHeader from "../ui/PageHeader";

function Marketplace() {
  return (
    <div>
      <PageHeader
        label="COMING IN V0.9"
        title="Marketplace"
        description="Pocket Deck will use your collection, wishlist, and trade binder to power future buying, selling, and trading."
      />

      <div className="marketplace-preview">
        <section className="marketplace-card">
          <p className="page-label">BUY</p>
          <h2>Find Cards</h2>
          <p>Discover listings from collectors, shops, and local sellers when marketplace features go live.</p>
        </section>

        <section className="marketplace-card">
          <p className="page-label">SELL</p>
          <h2>List Cards</h2>
          <p>Turn owned cards into listings using condition, grading, binder, and value details.</p>
        </section>

        <section className="marketplace-card">
          <p className="page-label">TRADE</p>
          <h2>Match Trades</h2>
          <p>Use wishlists and trade binders to find collectors who are chasing what you have.</p>
        </section>
      </div>

      <div className="marketplace-note">
        <p className="page-label">FOUNDATION READY</p>
        <h3>v0.7 prepares the marketplace</h3>
        <p>
          Your trade binder, wishlist, custom binders, and card details are now structured
          so marketplace and trade features can build on top later.
        </p>
      </div>
    </div>
  );
}

export default Marketplace;