import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import PageHeader from "../ui/PageHeader";

function Binder() {
  const { cards } = useContext(CardContext);
  const [page, setPage] = useState(1);
  const [selectedBinder, setSelectedBinder] = useState("Main Collection");

  const binderNames = [
    "Main Collection",
    "Showcase Binder",
    "Trade Binder",
    "Graded Vault",
    "Wishlist",
  ];

  const binderCards = cards.filter((card) => {
    return (card.binder || "Main Collection") === selectedBinder;
  });

  const cardsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(binderCards.length / cardsPerPage));

  const start = (page - 1) * cardsPerPage;
  const visibleCards = binderCards.slice(start, start + cardsPerPage);

  const binderSlots = Array.from({ length: 9 }, (_, index) => {
    return visibleCards[index] || null;
  });

  function handleBinderChange(event) {
    setSelectedBinder(event.target.value);
    setPage(1);
  }

  function nextPage() {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }

  function previousPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  return (
    <div>
      <PageHeader
        label="VAULTED BINDERS"
        title="Binders"
        description="Organize your collection into digital 9-pocket binders."
      />

      <div className="binder-toolbar">
        <div>
          <h2>{selectedBinder}</h2>
          <p>
            {binderCards.length} cards • 9-pocket digital display
          </p>
        </div>

        <div className="binder-controls">
          <select value={selectedBinder} onChange={handleBinderChange}>
            {binderNames.map((binder) => (
              <option key={binder}>{binder}</option>
            ))}
          </select>

          <button onClick={previousPage}>Previous</button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button onClick={nextPage}>Next</button>
        </div>
      </div>

      <div className="binder-page">
        {binderSlots.map((card, index) => (
          <div className="binder-pocket" key={index}>
            {card ? (
              <>
                <div className="binder-card-image">
                  {card.image ? (
                    <img src={card.image} alt={card.name} />
                  ) : (
                    card.name
                  )}
                </div>

                <h3>{card.name}</h3>
                <p>{card.set}</p>
              </>
            ) : (
              <span>Empty Pocket</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Binder;