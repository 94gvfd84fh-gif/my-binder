import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import Binder from "./pages/Binder";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import CardDetails from "./pages/CardDetails";
import TradeList from "./pages/TradeList";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/binder" element={<Binder />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/:id" element={<CardDetails />} />
          <Route path="/trade-list" element={<TradeList />} />
          <Route path="/community" element={<Marketplace />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/u/collector" element={<PublicProfile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;