import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="vault-logo">V</div>

        <h1>
          <span>Vaulted</span>
        </h1>

        <p>SECURE YOUR COLLECTION</p>
      </div>

      <nav>
        <NavLink to="/">🏠 Dashboard</NavLink>
        <NavLink to="/collection">🃏 Collection</NavLink>
        <NavLink to="/binder">📚 Binders</NavLink>
        <NavLink to="/marketplace">💰 Marketplace</NavLink>
        <NavLink to="/profile">⚙️ Profile</NavLink>
      </nav>

      <div className="sidebar-footer">
        <small>Vaulted v0.4</small>
        <p>Your collection. Protected.</p>
      </div>
    </aside>
  );
}

export default Sidebar;