import { useContext } from "react";
import { CardContext } from "../context/CardContext";

function RecentCards() {
  const { cards } = useContext(CardContext);

  const recentCards = [...cards]
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  const mostValuable = [...cards].sort(
    (a, b) => b.value - a.value
  )[0];

  return (
    <>
      {mostValuable && (
        <section className="recent-cards">
          <div className="section-header">
            <h2>Most Valuable Card</h2>
          </div>

          <div className="recent-card">
            <div className="card-image-placeholder">
              {mostValuable.image ? (
                <img
                  src={mostValuable.image}
                  alt={mostValuable.name}
                />
              ) : (
                mostValuable.name
              )}
            </div>

            <h3>{mostValuable.name}</h3>
            <p>{mostValuable.set}</p>

            <h2 style={{ color: "var(--accent)", marginTop: "12px" }}>
              ${mostValuable.value.toLocaleString()}
            </h2>
          </div>
        </section>
      )}

      <section className="recent-cards">
        <div className="section-header">
          <h2>Recent Additions</h2>
        </div>

        <div className="recent-grid">
          {recentCards.map((card) => (
            <div className="recent-card" key={card.id}>
              <div className="card-image-placeholder">
                {card.image ? (
                  <img src={card.image} alt={card.name} />
                ) : (
                  card.name
                )}
              </div>

              <h3>{card.name}</h3>

              <p>{card.set}</p>

              <strong>${card.value}</strong>

              <span style={{ color: "var(--accent)" }}>
                {card.favorite ? "★ Favorite" : ""}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default RecentCards;