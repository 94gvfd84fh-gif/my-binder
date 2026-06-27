import Stats from "../components/Stats";
import QuickActions from "../components/QuickActions";
import RecentCards from "../components/RecentCards";

function Dashboard() {
  return (
    <div>
      <header className="page-header">
        <div>
          <span className="page-label">POCKET DECK</span>
          <h1>Your Collection Hub</h1>
          <p>Track your cards, watch your collection grow, and keep your favorite pulls close.</p>
        </div>
      </header>

      <Stats />
      <QuickActions />
      <RecentCards />
    </div>
  );
}

export default Dashboard;