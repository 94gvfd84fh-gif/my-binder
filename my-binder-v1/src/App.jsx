import { Routes, Route } from "react-router-dom";
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
import PublicBinder from "./pages/PublicBinder";
import PublicCardDetails from "./pages/PublicCardDetails";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="content">
        <div className="app-topbar">
          <NotificationCenter />
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/:id" element={<CardDetails />} />
          <Route path="/binder" element={<Binder />} />

          <Route path="/trade-list" element={<TradeList />} />

          <Route path="/community" element={<Community />} />
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