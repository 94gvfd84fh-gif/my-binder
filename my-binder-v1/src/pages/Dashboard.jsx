import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import AddCardModal from "../components/AddCardModal";
import Stats from "../components/Stats";
import QuickActions from "../components/QuickActions";
import CommunitySummary from "../components/CommunitySummary";
import RecentCards from "../components/RecentCards";
import CollectionTimeline from "../components/CollectionTimeline";
import CollectionAnalytics from "../components/CollectionAnalytics";
import ValueAnalytics from "../components/ValueAnalytics";
import BetaCTA from "../components/BetaCTA";
import BetaMission from "../components/BetaMission";

const beaconFeatures = [
  {
    title: "Track Your Collection",
    description: "Organize cards, binders, wishlists, and values.",
  },
  {
    title: "Discover Events",
    description: "Find card shows, trade nights, shops, and collector meetups.",
  },
  {
    title: "Connect With Collectors",
    description: "Build a profile, share your collection, and join the community.",
  },
  {
    title: "Understand Your Value",
    description: "View collection analytics, trends, and portfolio insights.",
  },
];

function Dashboard() {
  const { cards, cardsLoading } = useContext(CardContext);
  const [showAddModal, setShowAddModal] = useState(false);

  if (cardsLoading) {
    return (
      <div>
        <div className="dashboard-hero beacon-hero">
          <p className="page-label">A HOME FOR COLLECTORS.</p>
          <h1>Loading Beacon Collect</h1>
          <p>Getting your collection ready.</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div>
        {showAddModal && (
          <AddCardModal onClose={() => setShowAddModal(false)} />
        )}

        <BetaMission />

        <section className="onboarding-empty-state beacon-onboarding">
          <div className="beacon-logo-mark beacon-logo-large" aria-hidden="true">
            <span className="beacon-logo-letter">B</span>
            <span className="beacon-lighthouse"></span>
            <span className="beacon-beam beacon-beam-one"></span>
            <span className="beacon-beam beacon-beam-two"></span>
          </div>

          <p className="page-label">WELCOME TO BEACON COLLECT</p>
          <h1>Start building your collection</h1>
          <p>
            Track your collection, discover local events, connect with
            collectors, and keep your hobby organized in one place.
          </p>

          <div className="beacon-hero-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => setShowAddModal(true)}
            >
              Start Collecting
            </button>

            <Link className="secondary-button" to="/community">
              Explore Features
            </Link>

          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-hero beacon-hero">
        <div>
          <p className="page-label">A HOME FOR COLLECTORS.</p>
          <h1>Beacon Collect</h1>
          <p>
            Track your collection, discover local events, connect with
            collectors, and keep your hobby organized in one place.
          </p>

          <div className="beacon-hero-actions">
            <Link className="primary-button" to="/collection">
              Start Collecting
            </Link>

            <Link className="secondary-button" to="/community">
              Explore Features
            </Link>
          </div>
        </div>

        <div className="beacon-hero-mark" aria-hidden="true">
          <div className="beacon-logo-mark beacon-logo-hero">
            <span className="beacon-logo-letter">B</span>
            <span className="beacon-lighthouse"></span>
            <span className="beacon-beam beacon-beam-one"></span>
            <span className="beacon-beam beacon-beam-two"></span>
          </div>
        </div>
      </div>

      <BetaMission />

      <BetaCTA />

      <section className="beacon-feature-grid" id="features">
        {beaconFeatures.map((feature) => (
          <article className="beacon-feature-card" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <Stats />
      <QuickActions />
      <CommunitySummary />
      <CollectionAnalytics />
      <ValueAnalytics />
      <RecentCards />
      <CollectionTimeline />
    </div>
  );
}

export default Dashboard;
