function Topbar() {
  return (
    <div className="topbar">
      <input placeholder="Search cards, sets, or users..." />

      <div className="user-area">
        <span>🔔</span>
        <div className="avatar"></div>
        <strong>Adam</strong>
      </div>
    </div>
  );
}

export default Topbar;