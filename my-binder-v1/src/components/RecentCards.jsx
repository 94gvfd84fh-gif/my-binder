import { useContext } from "react";
import { CardContext } from "../context/CardContext";

function RecentCards() {
  const { cards } = useContext(CardContext);

  const recentCards = cards.slice(0, 3);

  return (
    <section className="recent-cards">
      <div className="section-header">
        <h2>Recent Additions</h2>
        <button>View All</button>
      </div>

      <div className="recent-grid">
        {recentCards.map((card) => (
          <div className="recent-card" key={card.id}>
            <div className="card-image-placeholder">{card.name}</div>

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