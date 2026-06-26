import Sidebar from "../components/Sidebar";

function Dashboard() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <h1>My Binder</h1>
        <p>Version 1.0 dashboard rebuild</p>
      </main>
    </div>
  );
}

export default Dashboard;