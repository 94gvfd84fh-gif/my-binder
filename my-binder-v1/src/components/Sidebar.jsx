import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo beacon-brand-lockup">
        <div className="beacon-logo-mark" aria-hidden="true">
          <span className="beacon-logo-letter">B</span>
          <span className="beacon-lighthouse"></span>
          <span className="beacon-beam beacon-beam-one"></span>
          <span className="beacon-beam beacon-beam-two"></span>
        </div>

        <h1>
          <span>Beacon Collect</span>
        </h1>

        <p>A Home for Collectors.</p>
      </div>

      <nav>
        <NavLink to="/">🏠 Dashboard</NavLink>
        <NavLink to="/collection">🃏 Collection</NavLink>
        <NavLink to="/binder">📚 Binders</NavLink>
        <NavLink to="/trade-list">🔁 Trade & Sale</NavLink>
        <NavLink to="/community">🌐 Community</NavLink>
        <NavLink to="/profile">⚙️ Profile</NavLink>
        <NavLink to="/auth">🔐 Account</NavLink>
        <NavLink to="/u/collector">👤 Public Profile</NavLink>
        <NavLink to="/feedback">💬 Feedback</NavLink>
      </nav>

      <div className="sidebar-footer">
        <small>Beacon Collect v0.9</small>
        <p>Find. Track. Connect.</p>

        <div className="sidebar-legal-links">
          <NavLink to="/privacy">Privacy</NavLink>
          <NavLink to="/terms">Terms</NavLink>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
