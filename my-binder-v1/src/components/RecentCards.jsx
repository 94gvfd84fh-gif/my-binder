import { useContext } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";

function RecentCards() {
  const { cards } = useContext(CardContext);

  const recentCards = [...cards]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 3);

  const mostValuable = [...cards]
    .filter((card) => Number(card.value || 0) > 0)
    .sort((a, b) => Number(b.value || 0) - Number(a.value || 0))[0];

  if (cards.length === 0) {
    return (
      <section className="recent-cards">
        <div className="section-header">
          <div>
            <h2>Start Your Collection</h2>
            <p>Add your first card and Pocket Deck will build your dashboard around it.</p>
          </div>
        </div>

        <Link className="recent-card empty-state-card" to="/collection">
          <h3>Add your first card</h3>
          <p>Track name, set, condition, value, binders, grading details, and notes.</p>
          <strong>Go to Collection</strong>
        </Link>
      </section>
    );
  }

  return (
    <>
      {mostValuable && (
        <section className="recent-cards">
          <div className="section-header">
            <div>
              <h2>Top Card</h2>
              <p>Your highest estimated value right now.</p>
            </div>
          </div>

          <Link className="top-card-clean" to={`/collection/${mostValuable.id}`}>
            <div className="top-card-preview">
              {mostValuable.image ? (
                <img src={mostValuable.image} alt={mostValuable.name} />
              ) : (
                <span>{mostValuable.name}</span>
              )}
            </div>

            <h3>{mostValuable.name}</h3>
            <p>{mostValuable.set}</p>

            <h2>${Number(mostValuable.value || 0).toLocaleString()}</h2>
          </Link>
        </section>
      )}

      <section className="recent-cards">
        <div className="section-header">
          <div>
            <h2>Recent Additions</h2>
            <p>The newest cards added to your Pocket Deck.</p>
          </div>
        </div>

        <div className="recent-grid">
          {recentCards.map((card) => (
            <Link className="recent-card" to={`/collection/${card.id}`} key={card.id}>
              <div className="card-image-placeholder">
                {card.image ? (
                  <img src={card.image} alt={card.name} />
                ) : (
                  card.name
                )}
              </div>

              <h3>{card.name}</h3>
              <p>{card.set}</p>
              <strong>${Number(card.value || 0).toLocaleString()}</strong>

              {card.favorite && <span className="favorite-label">★ Favorite</span>}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default RecentCards;