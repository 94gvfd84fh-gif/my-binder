import { useContext } from "react";
import { CardContext } from "../context/CardContext";

function Stats() {
  const { cards } = useContext(CardContext);

  const totalCards = cards.length;

  const collectionValue = cards.reduce((total, card) => {
    return total + Number(card.value || 0);
  }, 0);

  const favoriteCards = cards.filter((card) => card.favorite).length;

  const gradedCards = cards.filter((card) => {
    return card.grade || card.gradingCompany || card.certNumber;
  }).length;

  return (
    <section className="stats">
      <div className="stat-card">
        <p>TOTAL CARDS</p>
        <h2>{totalCards}</h2>
        <span>Cards in your collection</span>
      </div>

      <div className="stat-card">
        <p>ESTIMATED VALUE</p>
        <h2>${collectionValue.toLocaleString()}</h2>
        <span>Based on your saved values</span>
      </div>

      <div className="stat-card">
        <p>FAVORITES</p>
        <h2>{favoriteCards}</h2>
        <span>Your favorite pulls</span>
      </div>

      <div className="stat-card">
        <p>GRADED CARDS</p>
        <h2>{gradedCards}</h2>
        <span>Cards with grading details</span>
      </div>
    </section>
  );
}

export default Stats;