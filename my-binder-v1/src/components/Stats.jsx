import { useContext } from "react";
import { CardContext } from "../context/CardContext";

function Stats() {
  const { cards } = useContext(CardContext);

  const totalCards = cards.length;

  const collectionValue = cards.reduce((total, card) => {
    return total + card.value;
  }, 0);

  const favoriteCards = cards.filter((card) => card.favorite).length;

  const tradeCards = cards.filter((card) => card.status === "For Trade").length;

  return (
    <section className="stats">
      <div className="stat-card blue">
        <p>TOTAL CARDS</p>
        <h2>{totalCards}</h2>
        <span>From your collection</span>
      </div>

      <div className="stat-card green">
        <p>COLLECTION VALUE</p>
        <h2>${collectionValue}</h2>
        <span>Total estimated value</span>
      </div>

      <div className="stat-card purple">
        <p>FAVORITES</p>
        <h2>{favoriteCards}</h2>
        <span>Favorite cards</span>
      </div>

      <div className="stat-card orange">
        <p>FOR TRADE</p>
        <h2>{tradeCards}</h2>
        <span>Trade binder</span>
      </div>
    </section>
  );
}

export default Stats;