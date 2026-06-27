import { useContext } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";

function ValueAnalytics() {
  const { cards } = useContext(CardContext);

  function getPrimaryBinder(card) {
    return card.primaryBinder || card.binder || "Main Collection";
  }

  const ownedCards = cards.filter((card) => {
    return getPrimaryBinder(card) !== "Wishlist";
  });

  const totalValue = ownedCards.reduce((total, card) => {
    return total + Number(card.value || 0);
  }, 0);

  const averageValue =
    ownedCards.length > 0 ? totalValue / ownedCards.length : 0;

  const gradedValue = ownedCards
    .filter((card) => {
      return card.gradingCompany && card.gradingCompany !== "Raw";
    })
    .reduce((total, card) => {
      return total + Number(card.value || 0);
    }, 0);

  const highestValueCard = [...ownedCards].sort((a, b) => {
    return Number(b.value || 0) - Number(a.value || 0);
  })[0];

  if (ownedCards.length === 0) {
    return null;
  }

  return (
    <section className="value-snapshot">
      <div className="section-header">
        <div>
          <h2>Value Snapshot</h2>
          <p>Estimated value based on your saved card values.</p>
        </div>
      </div>

      <div className="value-snapshot-grid">
        <div className="value-card">
          <span>Total Owned Value</span>
          <strong>${totalValue.toLocaleString()}</strong>
          <p>{ownedCards.length} owned cards tracked</p>
        </div>

        <div className="value-card">
          <span>Average Card</span>
          <strong>${averageValue.toFixed(2)}</strong>
          <p>Average estimated value per owned card</p>
        </div>

        <div className="value-card">
          <span>Graded Value</span>
          <strong>${gradedValue.toLocaleString()}</strong>
          <p>Total estimated value from graded cards</p>
        </div>

        {highestValueCard && (
          <Link
            className="value-card highest-value-card"
            to={`/collection/${highestValueCard.id}`}
          >
            <span>Highest Value</span>
            <strong>{highestValueCard.name}</strong>
            <p>${Number(highestValueCard.value || 0).toLocaleString()}</p>
          </Link>
        )}
      </div>
    </section>
  );
}

export default ValueAnalytics;