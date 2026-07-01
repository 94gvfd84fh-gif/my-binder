import { useContext } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";

function RecentCards() {
  const { cards } = useContext(CardContext);

  function getPrimaryBinder(card) {
    if (card.primaryBinder) {
      return card.primaryBinder;
    }

    if (card.binder) {
      return card.binder;
    }

    if (card.gradingCompany && card.gradingCompany !== "Raw") {
      return "Graded Collection";
    }

    return "Main Collection";
  }

  const ownedCards = cards.filter((card) => {
    return getPrimaryBinder(card) !== "Wishlist";
  });

  const wishlistCards = cards.filter((card) => {
    return getPrimaryBinder(card) === "Wishlist";
  });

  const recentCards = [...ownedCards]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 3);

  const recentWishlist = [...wishlistCards]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 3);

  const mostValuable = [...ownedCards]
    .filter((card) => Number(card.value || 0) > 0)
    .sort((a, b) => Number(b.value || 0) - Number(a.value || 0))[0];

  if (cards.length === 0) {
    return (
      <section className="recent-cards">
        <div className="section-header">
          <div>
            <h2>Start Your Collection</h2>
            <p>Add your first card and Beacon Collect will build your dashboard around it.</p>
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

      {recentCards.length > 0 && (
        <section className="recent-cards">
          <div className="section-header">
            <div>
              <h2>Recent Additions</h2>
              <p>The newest owned cards added to your Beacon Collect.</p>
            </div>
          </div>

          <div className="recent-grid">
            {recentCards.map((card) => (
              <Link
                className="recent-card"
                to={`/collection/${card.id}`}
                key={card.id}
              >
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

                {card.favorite && (
                  <span className="favorite-label">★ Favorite</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {recentWishlist.length > 0 && (
        <section className="recent-cards">
          <div className="section-header">
            <div>
              <h2>Wishlist</h2>
              <p>Cards you are still chasing.</p>
            </div>

            <Link className="text-link" to="/binder">
              View Wishlist
            </Link>
          </div>

          <div className="recent-grid">
            {recentWishlist.map((card) => (
              <Link
                className="recent-card wishlist-card"
                to={`/collection/${card.id}`}
                key={card.id}
              >
                <div className="card-image-placeholder">
                  {card.image ? (
                    <img src={card.image} alt={card.name} />
                  ) : (
                    card.name
                  )}
                </div>

                <h3>{card.name}</h3>
                <p>{card.set}</p>
                <span className="favorite-label">Wishlist</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default RecentCards;