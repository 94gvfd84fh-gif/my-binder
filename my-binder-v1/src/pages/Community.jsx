import PageHeader from "../ui/PageHeader";

const communityFeatures = [
  {
    label: "EVENTS",
    title: "Card Shows",
    description:
      "Discover nearby card shows, conventions, and collector meetups.",
  },
  {
    label: "TRADE NIGHTS",
    title: "Local Trade Nights",
    description:
      "Find shop-hosted trade nights and collector events in your area.",
  },
  {
    label: "LOCAL SHOPS",
    title: "Card Shops",
    description:
      "Support local game stores, card shops, and hobby shops near you.",
  },
  {
    label: "COLLECTORS",
    title: "Discover Collectors",
    description:
      "Browse public profiles, binders, featured cards, and future reputation signals.",
  },
  {
    label: "MARKETPLACE",
    title: "Buy & Sell",
    description:
      "Prepare sale-ready cards and future listings powered by your collection.",
  },
];

function Community() {
  return (
    <div>
      <PageHeader
        label="POCKET DECK COMMUNITY"
        title="Community"
        description="Find collectors, events, shops, trades, and marketplace opportunities around the hobby."
      />

      <div className="marketplace-preview">
        {communityFeatures.map((feature) => (
          <section className="marketplace-card" key={feature.title}>
            <p className="page-label">{feature.label}</p>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </section>
        ))}
      </div>

      <div className="marketplace-note">
        <p className="page-label">V0.9 DIRECTION</p>
        <h3>A home for collectors</h3>
        <p>
          Pocket Deck is growing beyond collection management into the place
          collectors use to connect, trade, discover events, support shops, and
          build reputation.
        </p>
      </div>
    </div>
  );
}

export default Community;