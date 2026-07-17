import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import NotificationCenter from "./components/NotificationCenter";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import Binder from "./pages/Binder";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import TradeList from "./pages/TradeList";
import CardDetails from "./pages/CardDetails";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import CollectorProfile from "./pages/CollectorProfile";
import CommunityProfile from "./pages/CommunityProfile";
import PublicBinder from "./pages/PublicBinder";
import PublicCardDetails from "./pages/PublicCardDetails";
import Auth from "./pages/Auth";
import Feedback from "./pages/Feedback";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <div className="app-auth-shell">
        <div className="auth-card">
          <p className="page-label">BEACON COLLECT</p>
          <h2>Loading your account</h2>
          <p>Checking your Beacon Collect session.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-auth-shell">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="content">
        <div className="app-topbar">
          <NotificationCenter />
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/:id" element={<CardDetails />} />
          <Route path="/binder" element={<Binder />} />
          <Route path="/trade-list" element={<TradeList />} />

          <Route path="/community" element={<Community />} />
          <Route
            path="/community/profile/:profileId"
            element={<CommunityProfile />}
          />
          <Route
            path="/community/collector/:collectorId"
            element={<CollectorProfile />}
          />
          <Route
            path="/community/collector/:collectorId/binder"
            element={<PublicBinder />}
          />
          <Route
            path="/community/collector/:collectorId/card/:cardId"
            element={<PublicCardDetails />}
          />

          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/u/collector" element={<PublicProfile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;