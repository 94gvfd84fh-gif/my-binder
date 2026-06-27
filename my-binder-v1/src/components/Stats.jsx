import { useContext } from "react";
import { CardContext } from "../context/CardContext";

function Stats() {
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

  function getExtraBinders(card) {
    return Array.isArray(card.extraBinders) ? card.extraBinders : [];
  }

  const ownedCards = cards.filter((card) => {
    return getPrimaryBinder(card) !== "Wishlist";
  });

  const totalCards = ownedCards.length;

  const collectionValue = ownedCards.reduce((total, card) => {
    return total + Number(card.value || 0);
  }, 0);

  const favoriteCards = ownedCards.filter((card) => card.favorite).length;

  const gradedCards = ownedCards.filter((card) => {
    return card.gradingCompany && card.gradingCompany !== "Raw";
  }).length;

  const tradeCards = ownedCards.filter((card) => {
    return (
      card.status === "For Trade" ||
      getExtraBinders(card).includes("Trade Binder")
    );
  }).length;

  return (
    <section className="stats">
      <div className="stat-card">
        <p>OWNED CARDS</p>
        <h2>{totalCards}</h2>
        <span>Main and graded cards you own</span>
      </div>

      <div className="stat-card">
        <p>ESTIMATED VALUE</p>
        <h2>${collectionValue.toLocaleString()}</h2>
        <span>Excludes wishlist cards</span>
      </div>

      <div className="stat-card">
        <p>FOR TRADE</p>
        <h2>{tradeCards}</h2>
        <span>Cards available in your Trade Binder</span>
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