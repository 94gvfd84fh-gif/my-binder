import Stats from "../components/Stats";
import QuickActions from "../components/QuickActions";
import CommunitySummary from "../components/CommunitySummary";
import RecentCards from "../components/RecentCards";
import CollectionTimeline from "../components/CollectionTimeline";
import CollectionAnalytics from "../components/CollectionAnalytics";
import ValueAnalytics from "../components/ValueAnalytics";
import NotificationCenter from "../components/NotificationCenter";
function Dashboard() {
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
      <NotificationCenter />
    </div>
  );
}

export default Dashboard;