import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="pocket-deck-logo" aria-hidden="true">
          <span className="logo-card logo-card-back"></span>
          <span className="logo-card logo-card-front">P</span>
        </div>

        <h1>
          <span>Pocket Deck</span>
        </h1>

        <p>A Home for Collectors</p>
      </div>

      <nav>
        <NavLink to="/">🏠 Dashboard</NavLink>
        <NavLink to="/collection">🃏 Collection</NavLink>
        <NavLink to="/binder">📚 Binders</NavLink>
        <NavLink to="/trade-list">🔁 Trade & Sale</NavLink>
        <NavLink to="/trade-list">🔁 Trade & Sale</NavLink>
        <NavLink to="/community">🌐 Community</NavLink>
        <NavLink to="/profile">⚙️ Profile</NavLink>
        <NavLink to="/u/collector">👤 Public Profile</NavLink>
      </nav>

      <div className="sidebar-footer">
        <small>Pocket Deck v0.8</small>
        <p>Collect. Connect. Trade.</p>
      </div>
    </aside>
  );
}

export default Sidebar;