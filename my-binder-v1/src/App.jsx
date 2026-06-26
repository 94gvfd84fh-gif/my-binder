import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import QuickActions from "./components/QuickActions";
import RecentCards from "./components/RecentCards";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="content">
        <Topbar />
        <Hero />
        <Stats />
        <QuickActions />
        <RecentCards />
      </main>
    </div>
  );
}

export default App;