function RecentCards() {
  const cards = [
    { id: 1, name: "Mega Greninja EX", set: "Chaos Rising", favorite: true },
    { id: 2, name: "Charizard", set: "Base Set", favorite: false },
    { id: 3, name: "Pikachu", set: "151", favorite: true },
  ];

  return (
    <section className="recent-cards">
      <div className="section-header">
        <h2>Recent Additions</h2>
        <button>View All</button>
      </div>

      <div className="recent-grid">
        {cards.map((card) => (
          <div className="recent-card" key={card.id}>
            <div className="card-image-placeholder">
              {card.name}
            </div>

            <h3>{card.name}</h3>
            <p>{card.set}</p>
            <span>{card.favorite ? "★" : "☆"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentCards;