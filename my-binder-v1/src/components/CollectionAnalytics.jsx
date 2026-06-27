import { useContext } from "react";
import { CardContext } from "../context/CardContext";
import { BinderContext, defaultBinders } from "../context/BinderContext";

function CollectionAnalytics() {
  const { cards } = useContext(CardContext);
  const { binders } = useContext(BinderContext);

  function getPrimaryBinder(card) {
    return card.primaryBinder || card.binder || "Main Collection";
  }

  function getExtraBinders(card) {
    return Array.isArray(card.extraBinders) ? card.extraBinders : [];
  }

  const ownedCards = cards.filter((card) => {
    return getPrimaryBinder(card) !== "Wishlist";
  });

  const wishlistCards = cards.filter((card) => {
    return getPrimaryBinder(card) === "Wishlist";
  });

  const gradedCards = ownedCards.filter((card) => {
    return card.gradingCompany && card.gradingCompany !== "Raw";
  });

  const tradeCards = ownedCards.filter((card) => {
    return (
      card.status === "For Trade" ||
      getExtraBinders(card).includes("Trade Binder")
    );
  });

  const rawCards = ownedCards.filter((card) => {
    return !card.gradingCompany || card.gradingCompany === "Raw";
  });

  const customBinders = binders.filter((binderName) => {
    return !defaultBinders.includes(binderName);
  });

  return (
    <section className="collection-analytics">
      <div className="section-header">
        <div>
          <h2>Collection Analytics</h2>
          <p>A quick read on how your Pocket Deck is organized.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <span>Owned</span>
          <strong>{ownedCards.length}</strong>
        </div>

        <div className="analytics-card">
          <span>Wishlist</span>
          <strong>{wishlistCards.length}</strong>
        </div>

        <div className="analytics-card">
          <span>For Trade</span>
          <strong>{tradeCards.length}</strong>
        </div>

        <div className="analytics-card">
          <span>Graded</span>
          <strong>{gradedCards.length}</strong>
        </div>

        <div className="analytics-card">
          <span>Raw</span>
          <strong>{rawCards.length}</strong>
        </div>

        <div className="analytics-card">
          <span>Custom Binders</span>
          <strong>{customBinders.length}</strong>
        </div>
      </div>
    </section>
  );
}

export default CollectionAnalytics;