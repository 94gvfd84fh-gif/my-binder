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
    "Graded Collection",
    "Wishlist",
  ];

  const binderCards = cards.filter((card) => {
    return (card.binder || "Main Collection") === selectedBinder;
  });

  const cardsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(binderCards.length / cardsPerPage));

  const start = (page - 1) * cardsPerPage;
  const visibleCards = binderCards.slice(start, start + cardsPerPage);

  const binderSlots = Array.from({ length: cardsPerPage }, (_, index) => {
    return visibleCards[index] || null;
  });

  function handleBinderChange(event) {
    setSelectedBinder(event.target.value);
    setPage(1);
  }

  function nextPage() {
    setPage((currentPage) => Math.min(currentPage + 1, totalPages));
  }

  function previousPage() {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  return (
    <div>
      <PageHeader
        label="POCKET DECK BINDERS"
        title="Your Binders"
        description="Flip through your collection in clean 9-pocket digital pages."
      />

      <div className="binder-toolbar">
        <div>
          <h2>{selectedBinder}</h2>
          <p>
            {binderCards.length} cards • Page {page} of {totalPages}
          </p>
        </div>

        <div className="binder-controls">
          <select value={selectedBinder} onChange={handleBinderChange}>
            {binderNames.map((binder) => (
              <option key={binder}>{binder}</option>
            ))}
          </select>

          <button onClick={previousPage} disabled={page === 1}>
            Previous
          </button>

          <button onClick={nextPage} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>

      <div className="binder-page">
        {binderSlots.map((card, index) => (
          <div
            className={card ? "binder-pocket" : "binder-pocket empty-pocket"}
            key={card ? card.id : `empty-${index}`}
          >
            {card ? (
              <>
                {card.gradingCompany && card.gradingCompany !== "Raw" && (
                  <div className="graded-badge">
                    {card.gradingCompany} {card.grade || ""}
                  </div>
                )}

                <div className="binder-card-image">
                  {card.image ? (
                    <img src={card.image} alt={card.name} />
                  ) : (
                    <span>{card.name}</span>
                  )}
                </div>

                <h3>{card.name || "Untitled Card"}</h3>
                <p>{card.set || "Unknown set"}</p>

                {card.certNumber && (
                  <small className="cert-number">Cert #{card.certNumber}</small>
                )}
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