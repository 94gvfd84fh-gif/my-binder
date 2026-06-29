import PageHeader from "../ui/PageHeader";

function Marketplace() {
  return (
    <div>
      <PageHeader
        label="POCKET DECK MARKETPLACE"
        title="Marketplace"
        description="A future place for collectors to buy, sell, trade, and connect through their collections."
      />

      <div className="marketplace-preview">
        <section className="marketplace-card">
          <p className="page-label">MARKETPLACE</p>
          <h2>Buy & Sell Cards</h2>
          <p>
            Turn sale-ready cards into future listings with asking prices,
            condition, grading, and card details already attached.
          </p>
        </section>

        <section className="marketplace-card">
          <p className="page-label">TRADES</p>
          <h2>Match With Collectors</h2>
          <p>
            Use trade lists, public binders, and wishlists to find collectors
            who are chasing what you have.
          </p>
        </section>

        <section className="marketplace-card">
          <p className="page-label">EVENTS</p>
          <h2>Card Shows & Trade Nights</h2>
          <p>
            Discover nearby card shows, shop events, conventions, and local
            trade nights built around your collecting interests.
          </p>
        </section>

        <section className="marketplace-card">
          <p className="page-label">LOCAL SHOPS</p>
          <h2>Support Card Shops</h2>
          <p>
            Find local game stores, card shops, grading drop-off locations, and
            collector-friendly places near you.
          </p>
        </section>

        <section className="marketplace-card">
          <p className="page-label">COLLECTORS</p>
          <h2>Discover Profiles</h2>
          <p>
            Browse public collector profiles, featured cards, public binders,
            and future reputation signals.
          </p>
        </section>
      </div>

      <div className="marketplace-note">
        <p className="page-label">FOUNDATION READY</p>
        <h3>The marketplace layer is taking shape</h3>
        <p>
          Public profiles, public binders, trade lists, wishlists, sale prices,
          and card types are now structured so Pocket Deck can grow into a full
          collector marketplace and community.
        </p>
      </div>
    </div>
  );
}

export default Marketplace;