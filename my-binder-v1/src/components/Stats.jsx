import { useContext } from "react";
import { CardContext } from "../context/CardContext";

function Stats() {
  const { cards } = useContext(CardContext);

  const totalCards = cards.length;

  const collectionValue = cards.reduce((total, card) => {
    return total + Number(card.value || 0);
  }, 0);

  const favoriteCards = cards.filter((card) => card.favorite).length;

  const averageValue =
    totalCards > 0 ? collectionValue / totalCards : 0;

  return (
    <section className="stats">
      <div className="stat-card">
        <p>TOTAL CARDS</p>
        <h2>{totalCards}</h2>
        <span>Cards secured in Vaulted</span>
      </div>

      <div className="stat-card">
        <p>COLLECTION VALUE</p>
        <h2>${collectionValue.toLocaleString()}</h2>
        <span>Total estimated value</span>
      </div>

      <div className="stat-card">
        <p>FAVORITES</p>
        <h2>{favoriteCards}</h2>
        <span>Showcase-worthy cards</span>
      </div>

      <div className="stat-card">
        <p>AVG. CARD VALUE</p>
        <h2>${averageValue.toFixed(2)}</h2>
        <span>Average value per card</span>
      </div>
    </section>
  );
}

export default Stats;