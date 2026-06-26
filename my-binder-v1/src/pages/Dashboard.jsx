import Stats from "../components/Stats";
import QuickActions from "../components/QuickActions";
import RecentCards from "../components/RecentCards";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Stats />
      <QuickActions />
      <RecentCards />
    </div>
  );
}

export default Dashboard;