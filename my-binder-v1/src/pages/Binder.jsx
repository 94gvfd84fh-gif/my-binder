import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import { BinderContext } from "../context/BinderContext";
import PageHeader from "../ui/PageHeader";

function Binder() {
  const { cards, setCards } = useContext(CardContext);
  const {
    binders,
    binderGoals,
    addBinder,
    renameBinder,
    deleteBinder,
    setBinderGoal,
    isDefaultBinder,
  } = useContext(BinderContext);

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [selectedBinder, setSelectedBinder] = useState("Main Collection");
  const [newBinderName, setNewBinderName] = useState("");
  const [renameBinderName, setRenameBinderName] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [cardToAdd, setCardToAdd] = useState("");

  useEffect(() => {
    const binderFromUrl = searchParams.get("view");

    if (binderFromUrl && binders.includes(binderFromUrl)) {
      setSelectedBinder(binderFromUrl);
      setPage(1);
      setRenameBinderName("");
      setGoalInput("");
      setCardToAdd("");
    }
  }, [searchParams, binders]);

  const selectedBinderIsDefault = isDefaultBinder(selectedBinder);

  function getPrimaryBinder(card) {
    if (card.primaryBinder) return card.primaryBinder;
    if (card.binder) return card.binder;
    if (card.gradingCompany && card.gradingCompany !== "Raw") {
      return "Graded Collection";
    }
    return "Main Collection";
  }

  function getExtraBinders(card) {
    return Array.isArray(card.extraBinders) ? card.extraBinders : [];
  }

  function cardBelongsToBinder(card, binderName) {
    if (
      binderName === "Main Collection" ||
      binderName === "Graded Collection" ||
      binderName === "Wishlist"
    ) {
      return getPrimaryBinder(card) === binderName;
    }

    return getExtraBinders(card).includes(binderName);
  }

  function getEmptyBinderMessage() {
    if (selectedBinder === "Wishlist") {
      return {
        title: "No wishlist cards yet",
        text: "Add cards as Wishlist items to build a chase list you can mark collected later.",
      };
    }

    if (selectedBinder === "Trade Binder") {
      return {
        title: "No trade cards yet",
        text: "Mark cards as For Trade or add cards here when you are ready to trade.",
      };
    }

    if (selectedBinder === "Graded Collection") {
      return {
        title: "No graded cards yet",
        text: "Cards with a grading company will appear here automatically.",
      };
    }

    if (selectedBinder === "Main Collection") {
      return {
        title: "No cards in your main collection yet",
        text: "Add your first owned card from the Collection page to start building Pocket Deck.",
      };
    }

    return {
      title: "This custom binder is empty",
      text: "Use the Add Card picker above to add cards without removing them from their primary binder.",
    };
  }

  const binderCards = cards.filter((card) => {
    return cardBelongsToBinder(card, selectedBinder);
  });

  const cardsNotInBinder = cards.filter((card) => {
    return !cardBelongsToBinder(card, selectedBinder);
  });

  const cardsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(binderCards.length / cardsPerPage));

  const start = (page - 1) * cardsPerPage;
  const visibleCards = binderCards.slice(start, start + cardsPerPage);

  const binderSlots = Array.from({ length: cardsPerPage }, (_, index) => {
    return visibleCards[index] || null;
  });

  const selectedBinderGoal = binderGoals[selectedBinder] || 0;

  const goalPercent =
    selectedBinderGoal > 0
      ? Math.min(
          100,
          Math.round((binderCards.length / selectedBinderGoal) * 100)
        )
      : 0;

  const emptyBinderMessage = getEmptyBinderMessage();

  function resetBinderTools() {
    setPage(1);
    setRenameBinderName("");
    setGoalInput("");
    setCardToAdd("");
  }

  function handleBinderChange(event) {
    setSelectedBinder(event.target.value);
    resetBinderTools();
  }

  function handleAddBinder(event) {
    event.preventDefault();

    const trimmedName = newBinderName.trim();

    if (!trimmedName) return;

    const added = addBinder(trimmedName);

    if (!added) {
      alert("That binder already exists.");
      return;
    }

    setSelectedBinder(trimmedName);
    setNewBinderName("");
    setPage(1);
  }

  function handleRenameBinder(event) {
    event.preventDefault();

    const trimmedName = renameBinderName.trim();

    if (!trimmedName) return;

    const renamed = renameBinder(selectedBinder, trimmedName);

    if (!renamed) {
      alert("This binder cannot be renamed or that name already exists.");
      return;
    }

    const updatedCards = cards.map((card) => {
      const extraBinders = getExtraBinders(card).map((binderName) => {
        return binderName === selectedBinder ? trimmedName : binderName;
      });

      return {
        ...card,
        extraBinders,
        updatedAt: new Date().toISOString(),
      };
    });

    setCards(updatedCards);
    setSelectedBinder(trimmedName);
    setRenameBinderName("");
    setPage(1);
  }

  function handleDeleteBinder() {
    const confirmDelete = confirm(
      `Delete "${selectedBinder}"? Cards will be removed from this custom binder only.`
    );

    if (!confirmDelete) return;

    const deleted = deleteBinder(selectedBinder);

    if (!deleted) {
      alert("Default binders cannot be deleted.");
      return;
    }

    const updatedCards = cards.map((card) => {
      const extraBinders = getExtraBinders(card).filter((binderName) => {
        return binderName !== selectedBinder;
      });

      return {
        ...card,
        extraBinders,
        updatedAt: new Date().toISOString(),
      };
    });

    setCards(updatedCards);
    setSelectedBinder("Main Collection");
    setRenameBinderName("");
    setPage(1);
  }

  function handleSetGoal(event) {
    event.preventDefault();

    if (selectedBinderIsDefault) return;

    setBinderGoal(selectedBinder, goalInput);
    setGoalInput("");
  }

  function handleAddCardToBinder(event) {
    event.preventDefault();

    if (!cardToAdd) return;

    const now = new Date().toISOString();

    const updatedCards = cards.map((card) => {
      if (String(card.id) !== cardToAdd) {
        return card;
      }

      if (
        selectedBinder === "Main Collection" ||
        selectedBinder === "Graded Collection" ||
        selectedBinder === "Wishlist"
      ) {
        return {
          ...card,
          binder: selectedBinder,
          primaryBinder: selectedBinder,
          updatedAt: now,
        };
      }

      const extraBinders = getExtraBinders(card);

      return {
        ...card,
        extraBinders: Array.from(new Set([...extraBinders, selectedBinder])),
        updatedAt: now,
      };
    });

    setCards(updatedCards);
    setCardToAdd("");
    setPage(1);
  }

  function removeCardFromCurrentBinder(cardId) {
    const now = new Date().toISOString();

    const updatedCards = cards.map((card) => {
      if (card.id !== cardId) {
        return card;
      }

      const extraBinders = getExtraBinders(card).filter((binderName) => {
        return binderName !== selectedBinder;
      });

      return {
        ...card,
        extraBinders,
        updatedAt: now,
      };
    });

    setCards(updatedCards);
  }

  function markCardCollected(cardId) {
    const now = new Date().toISOString();

    const updatedCards = cards.map((card) => {
      if (card.id !== cardId) {
        return card;
      }

      return {
        ...card,
        status: "Keep",
        binder: "Main Collection",
        primaryBinder: "Main Collection",
        updatedAt: now,
        createdAt: card.createdAt || now,
      };
    });

    setCards(updatedCards);
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
        description="Create binders for master sets, favorite Pokémon, trades, wishlists, and more."
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
            {binders.map((binder) => (
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

      <div className="binder-management-grid">
        <form className="binder-action-card" onSubmit={handleAddBinder}>
          <div>
            <p className="page-label">CREATE BINDER</p>
            <h3>New Custom Binder</h3>
            <p>Create a binder for a Pokémon, set, chase list, or theme.</p>
          </div>

          <div className="binder-action-row">
            <input
              placeholder="Example: All Charizards"
              value={newBinderName}
              onChange={(event) => setNewBinderName(event.target.value)}
            />

            <button type="submit">Add Binder</button>
          </div>
        </form>

        <form className="binder-action-card" onSubmit={handleAddCardToBinder}>
          <div>
            <p className="page-label">ADD CARD</p>
            <h3>Add to {selectedBinder}</h3>
            <p>
              {selectedBinderIsDefault
                ? "Set this as the card's primary binder."
                : "Add an existing card here without removing it from its primary binder."}
            </p>
          </div>

          <div className="binder-action-row">
            <select
              value={cardToAdd}
              onChange={(event) => setCardToAdd(event.target.value)}
            >
              <option value="">Choose a card...</option>

              {cardsNotInBinder.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name} - {card.set || "Unknown set"}
                </option>
              ))}
            </select>

            <button type="submit">Add Card</button>
          </div>
        </form>

        {!selectedBinderIsDefault && (
          <>
            <form className="binder-action-card" onSubmit={handleSetGoal}>
              <div>
                <p className="page-label">BINDER GOAL</p>
                <h3>
                  {selectedBinderGoal
                    ? `${binderCards.length} / ${selectedBinderGoal} cards`
                    : "Set a Goal"}
                </h3>
                <p>
                  {selectedBinderGoal
                    ? `${goalPercent}% complete`
                    : "Track progress for this custom binder."}
                </p>
              </div>

              {selectedBinderGoal > 0 && (
                <div
                  className="binder-goal-progress"
                  style={{ "--goal-progress": `${goalPercent}%` }}
                >
                  <span></span>
                </div>
              )}

              <div className="binder-action-row">
                <input
                  type="number"
                  min="1"
                  placeholder="Target cards ex: 50"
                  value={goalInput}
                  onChange={(event) => setGoalInput(event.target.value)}
                />

                <button type="submit">
                  {selectedBinderGoal ? "Update Goal" : "Set Goal"}
                </button>

                {selectedBinderGoal > 0 && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setBinderGoal(selectedBinder, "")}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            <form className="binder-action-card" onSubmit={handleRenameBinder}>
              <div>
                <p className="page-label">MANAGE BINDER</p>
                <h3>Rename or Delete</h3>
                <p>Update this custom binder without affecting the cards themselves.</p>
              </div>

              <div className="binder-action-row">
                <input
                  placeholder="New binder name"
                  value={renameBinderName}
                  onChange={(event) => setRenameBinderName(event.target.value)}
                />

                <button type="submit">Rename</button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={handleDeleteBinder}
                >
                  Delete
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {binderCards.length === 0 && (
        <div className="binder-empty-state">
          <p className="page-label">EMPTY BINDER</p>
          <h3>{emptyBinderMessage.title}</h3>
          <p>{emptyBinderMessage.text}</p>
        </div>
      )}

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

                {selectedBinder === "Wishlist" && (
                  <button
                    type="button"
                    className="mark-collected-button"
                    onClick={() => markCardCollected(card.id)}
                  >
                    Mark Collected
                  </button>
                )}

                {!selectedBinderIsDefault && (
                  <button
                    type="button"
                    className="remove-from-binder-button"
                    onClick={() => removeCardFromCurrentBinder(card.id)}
                  >
                    Remove from Binder
                  </button>
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