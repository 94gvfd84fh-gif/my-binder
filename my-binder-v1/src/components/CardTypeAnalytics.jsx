import { useContext } from "react";
import { CardContext } from "../context/CardContext";

const CARD_TYPES = [
  "Pokémon",
  "Magic: The Gathering",
  "Yu-Gi-Oh!",
  "One Piece",
  "Union Arena",
  "Baseball",
  "Basketball",
  "Football",
  "Soccer",
  "Other",
];

function CardTypeAnalytics() {
  const { cards } = useContext(CardContext);

  const typeCounts = CARD_TYPES.map((type) => {
    const count = cards.filter((card) => {
      return (card.cardType || "Pokémon") === type;
    }).length;

    return {
      type,
      count,
    };
  }).filter((item) => item.count > 0);

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="card-type-analytics">
      <div className="section-header">
        <div>
          <h2>Card Types</h2>
          <p>See how your Pocket Deck is spread across different hobbies.</p>
        </div>
      </div>

      <div className="card-type-grid">
        {typeCounts.map((item) => (
          <div className="card-type-card" key={item.type}>
            <span>{item.type}</span>
            <strong>{item.count}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CardTypeAnalytics;