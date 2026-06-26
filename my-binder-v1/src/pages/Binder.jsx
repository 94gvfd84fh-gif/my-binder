import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import PageHeader from "../ui/PageHeader";

function Binder() {
  const { cards } = useContext(CardContext);
  const [page, setPage] = useState(1);

  const cardsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(cards.length / cardsPerPage));

  const start = (page - 1) * cardsPerPage;
  const visibleCards = cards.slice(start, start + cardsPerPage);

  const binderSlots = Array.from({ length: 9 }, (_, index) => {
    return visibleCards[index] || null;
  });

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
        label="MY BINDER"
        title="Binder"
        description="View your collection like a real 9-pocket binder page."
      />

      <div className="binder-toolbar">
  <div>
    <h2>Pokémon Binder</h2>
    <p>9-pocket digital display</p>
  </div>

  <div className="binder-controls">
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