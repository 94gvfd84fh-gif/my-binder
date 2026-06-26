function StatsCard({ title, value }) {
  return (
    <div className="stats-card">
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

export default StatsCard;