import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import AddCardModal from "../components/AddCardModal";
import Stats from "../components/Stats";
import QuickActions from "../components/QuickActions";
import CommunitySummary from "../components/CommunitySummary";
import RecentCards from "../components/RecentCards";
import CollectionTimeline from "../components/CollectionTimeline";
import CollectionAnalytics from "../components/CollectionAnalytics";
import ValueAnalytics from "../components/ValueAnalytics";

function Dashboard() {
  const { cards, cardsLoading } = useContext(CardContext);
  const [showAddModal, setShowAddModal] = useState(false);

  if (cardsLoading) {
    return (
      <div>
        <div className="dashboard-hero">
          <p className="page-label">A HOME FOR COLLECTORS</p>
          <h1>Loading your Pocket Deck</h1>
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

        <section className="onboarding-empty-state">
          <p className="page-label">WELCOME TO POCKET DECK</p>
          <h1>Start building your collection</h1>
          <p>
            Add your first card to unlock your dashboard, binders, analytics,
            trade list, and collection timeline.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={() => setShowAddModal(true)}
          >
            Add Your First Card
          </button>
        </section>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-hero">
        <p className="page-label">A HOME FOR COLLECTORS</p>
        <h1>Dashboard</h1>
        <p>Track your cards, binders, wishlist, and collection activity.</p>
      </div>

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