import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>
          MY <span>BINDER</span>
        </h1>
        <p>COLLECT. SHOWCASE. TRADE.</p>
      </div>

      <nav>
        <NavLink to="/">🏠 Dashboard</NavLink>
        <NavLink to="/binder">📖 Binder</NavLink>
        <NavLink to="/collection">📚 Collection</NavLink>
        <NavLink to="/marketplace">🛒 Marketplace</NavLink>
        <NavLink to="/profile">👤 Profile</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;