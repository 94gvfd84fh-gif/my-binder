function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>MY <span>BINDER</span></h1>
        <p>COLLECT. SHOWCASE. TRADE.</p>
      </div>

      <nav>
        <button>🏠 Dashboard</button>
        <button>📖 Binder</button>
        <button>📚 Collection</button>
        <button>🛒 Marketplace</button>
        <button>👤 Profile</button>
      </nav>
    </aside>
  );
}

export default Sidebar;