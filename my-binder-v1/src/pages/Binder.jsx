import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import { BinderContext } from "../context/BinderContext";
import PageHeader from "../ui/PageHeader";

const BINDER_SLOT_LABELS_KEY = "beacon-collect-binder-slot-labels";
const BINDER_CARD_LAYOUT_KEY = "beacon-collect-binder-card-layouts";

function getStoredObject(storageKey) {
  const savedValue = localStorage.getItem(storageKey);

  if (savedValue) {
    try {
      const parsedValue = JSON.parse(savedValue);

      if (parsedValue && typeof parsedValue === "object") {
        return parsedValue;
      }
    } catch {
      return {};
    }
  }

  return {};
}

function Binder() {
  const { cards, editCard } = useContext(CardContext);
  const {
    binders,
    binderGoals,
    BINDER_VISIBILITY,
    addBinder,
    renameBinder,
    deleteBinder,
    setBinderGoal,
    getBinderVisibility,
    setBinderVisibilityStatus,
    getBinderColor,
    setBinderColor,
    isDefaultBinder,
  } = useContext(BinderContext);

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [selectedBinder, setSelectedBinder] = useState("Main Collection");
  const [newBinderName, setNewBinderName] = useState("");
  const [renameBinderName, setRenameBinderName] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [cardToAdd, setCardToAdd] = useState("");
  const [binderSlotLabels, setBinderSlotLabels] = useState(() =>
    getStoredObject(BINDER_SLOT_LABELS_KEY)
  );
  const [binderCardLayouts, setBinderCardLayouts] = useState(() =>
    getStoredObject(BINDER_CARD_LAYOUT_KEY)
  );
  const [draggedCardId, setDraggedCardId] = useState("");
  const [dragOverSlotNumber, setDragOverSlotNumber] = useState(0);

  useEffect(() => {
    const binderFromUrl = searchParams.get("view");

    if (binderFromUrl && binders.includes(binderFromUrl)) {
      setSelectedBinder(binderFromUrl);
      setPage(1);
      setRenameBinderName("");
      setGoalInput("");
      setCardToAdd("");
      setDraggedCardId("");
      setDragOverSlotNumber(0);
    }
  }, [searchParams, binders]);

  useEffect(() => {
    localStorage.setItem(
      BINDER_SLOT_LABELS_KEY,
      JSON.stringify(binderSlotLabels)
    );
  }, [binderSlotLabels]);

  useEffect(() => {
    localStorage.setItem(
      BINDER_CARD_LAYOUT_KEY,
      JSON.stringify(binderCardLayouts)
    );
  }, [binderCardLayouts]);

  const selectedBinderIsDefault = isDefaultBinder(selectedBinder);
  const selectedBinderVisibility = getBinderVisibility(selectedBinder);
  const selectedBinderColor = getBinderColor(selectedBinder);

  function getPrimaryBinder(card) {
    if (card.status === "Wishlist") {
      return "Wishlist";
    }

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
        text: "Add cards as Wishlist items from the Add Card modal to build your chase list.",
      };
    }

    if (selectedBinder === "Trade Binder") {
      return {
        title: "No trade cards yet",
        text: "Mark cards as For Trade and Beacon Collect will add them here automatically.",
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
        text: "Add your first owned card from the Collection page to start building Beacon Collect.",
      };
    }

    return {
      title: "This custom binder is empty",
      text: "Use the Add Card picker above to add cards without removing them from their primary binder.",
    };
  }

  function getVisibilityDescription() {
    if (selectedBinderVisibility === BINDER_VISIBILITY.PUBLIC) {
      return "This binder can appear on your public collector profile.";
    }

    if (selectedBinderVisibility === BINDER_VISIBILITY.TRADE_VISIBLE) {
      return "This binder can be shown to collectors looking for trades.";
    }

    return "Only you can see this binder.";
  }

  function getSlotLabel(binderName, slotNumber) {
    return binderSlotLabels[binderName]?.[slotNumber] || "";
  }

  function updateSlotLabel(binderName, slotNumber, label) {
    setBinderSlotLabels((currentLabels) => {
      const binderLabels = currentLabels[binderName] || {};
      const updatedBinderLabels = {
        ...binderLabels,
        [slotNumber]: label,
      };

      if (!label.trim()) {
        delete updatedBinderLabels[slotNumber];
      }

      return {
        ...currentLabels,
        [binderName]: updatedBinderLabels,
      };
    });
  }

  function renameBinderLayout(oldName, newName) {
    setBinderSlotLabels((currentLabels) => {
      if (!currentLabels[oldName]) return currentLabels;

      const updatedLabels = { ...currentLabels };
      updatedLabels[newName] = updatedLabels[oldName];
      delete updatedLabels[oldName];
      return updatedLabels;
    });

    setBinderCardLayouts((currentLayouts) => {
      if (!currentLayouts[oldName]) return currentLayouts;

      const updatedLayouts = { ...currentLayouts };
      updatedLayouts[newName] = updatedLayouts[oldName];
      delete updatedLayouts[oldName];
      return updatedLayouts;
    });
  }

  function deleteBinderLayout(binderName) {
    setBinderSlotLabels((currentLabels) => {
      if (!currentLabels[binderName]) return currentLabels;

      const updatedLabels = { ...currentLabels };
      delete updatedLabels[binderName];
      return updatedLabels;
    });

    setBinderCardLayouts((currentLayouts) => {
      if (!currentLayouts[binderName]) return currentLayouts;

      const updatedLayouts = { ...currentLayouts };
      delete updatedLayouts[binderName];
      return updatedLayouts;
    });
  }

  const binderCards = cards.filter((card) => {
    return cardBelongsToBinder(card, selectedBinder);
  });

  const cardsNotInBinder = cards.filter((card) => {
    return !cardBelongsToBinder(card, selectedBinder);
  });

  const selectedBinderGoal = binderGoals[selectedBinder] || 0;
  const cardsPerPage = 9;

  function getResolvedCardSlots(binderName, collectionCards) {
    const storedLayout = binderCardLayouts[binderName] || {};
    const usedSlots = new Set();
    const resolvedSlots = {};

    collectionCards.forEach((card) => {
      const storedSlot = Number(storedLayout[card.id]);

      if (storedSlot > 0 && !usedSlots.has(storedSlot)) {
        resolvedSlots[card.id] = storedSlot;
        usedSlots.add(storedSlot);
      }
    });

    collectionCards.forEach((card) => {
      if (resolvedSlots[card.id]) return;

      let nextSlot = 1;

      while (usedSlots.has(nextSlot)) {
        nextSlot += 1;
      }

      resolvedSlots[card.id] = nextSlot;
      usedSlots.add(nextSlot);
    });

    return resolvedSlots;
  }

  const resolvedCardSlots = getResolvedCardSlots(selectedBinder, binderCards);
  const slotToCard = new Map(
    binderCards.map((card) => [resolvedCardSlots[card.id], card])
  );
  const highestUsedSlot = Object.values(resolvedCardSlots).reduce(
    (highestSlot, slotNumber) => Math.max(highestSlot, Number(slotNumber || 0)),
    0
  );
  const plannedSlotCount = Math.max(
    binderCards.length,
    selectedBinderGoal,
    highestUsedSlot
  );
  const totalPages = Math.max(1, Math.ceil(plannedSlotCount / cardsPerPage));
  const start = (page - 1) * cardsPerPage;

  const binderSlots = Array.from({ length: cardsPerPage }, (_, index) => {
    const slotNumber = start + index + 1;
    const card = slotToCard.get(slotNumber) || null;
    const slotLabel = getSlotLabel(selectedBinder, slotNumber);
    const isPlannedSlot =
      selectedBinderGoal > 0 || slotNumber <= plannedSlotCount || Boolean(slotLabel);

    return {
      card,
      slotNumber,
      slotLabel,
      isPlannedSlot,
    };
  });

  const goalPercent =
    selectedBinderGoal > 0
      ? Math.min(
          100,
          Math.round((binderCards.length / selectedBinderGoal) * 100)
        )
      : 0;

  const emptyBinderMessage = getEmptyBinderMessage();
  const binderColorStyle = { "--binder-color": selectedBinderColor };

  function resetBinderTools() {
    setPage(1);
    setRenameBinderName("");
    setGoalInput("");
    setCardToAdd("");
    setDraggedCardId("");
    setDragOverSlotNumber(0);
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

  async function handleRenameBinder(event) {
    event.preventDefault();

    const trimmedName = renameBinderName.trim();

    if (!trimmedName) return;

    const renamed = renameBinder(selectedBinder, trimmedName);

    if (!renamed) {
      alert("This binder cannot be renamed or that name already exists.");
      return;
    }

    const cardsToUpdate = cards.filter((card) => {
      return getExtraBinders(card).includes(selectedBinder);
    });

    await Promise.all(
      cardsToUpdate.map((card) => {
        const extraBinders = getExtraBinders(card).map((binderName) => {
          return binderName === selectedBinder ? trimmedName : binderName;
        });

        return editCard({
          ...card,
          extraBinders,
          updatedAt: new Date().toISOString(),
        });
      })
    );

    renameBinderLayout(selectedBinder, trimmedName);
    setSelectedBinder(trimmedName);
    setRenameBinderName("");
    setPage(1);
  }

  async function handleDeleteBinder() {
    const confirmDelete = confirm(
      'Delete "' +
        selectedBinder +
        '"? Cards will be removed from this custom binder only.'
    );

    if (!confirmDelete) return;

    const deleted = deleteBinder(selectedBinder);

    if (!deleted) {
      alert("Default binders cannot be deleted.");
      return;
    }

    const cardsToUpdate = cards.filter((card) => {
      return getExtraBinders(card).includes(selectedBinder);
    });

    await Promise.all(
      cardsToUpdate.map((card) => {
        const extraBinders = getExtraBinders(card).filter((binderName) => {
          return binderName !== selectedBinder;
        });

        return editCard({
          ...card,
          extraBinders,
          updatedAt: new Date().toISOString(),
        });
      })
    );

    deleteBinderLayout(selectedBinder);
    setSelectedBinder("Main Collection");
    setRenameBinderName("");
    setPage(1);
  }

  function handleSetGoal(event) {
    event.preventDefault();

    setBinderGoal(selectedBinder, goalInput);
    setGoalInput("");
    setPage(1);
  }

  async function handleAddCardToBinder(event) {
    event.preventDefault();

    if (!cardToAdd || selectedBinderIsDefault) return;

    const now = new Date().toISOString();
    const card = cards.find((currentCard) => String(currentCard.id) === cardToAdd);

    if (!card) return;

    const extraBinders = getExtraBinders(card);

    await editCard({
      ...card,
      extraBinders: Array.from(new Set([...extraBinders, selectedBinder])),
      updatedAt: now,
    });
    setCardToAdd("");
    setPage(1);
  }

  async function removeCardFromCurrentBinder(cardId) {
    const now = new Date().toISOString();
    const card = cards.find((currentCard) => currentCard.id === cardId);

    if (!card) return;

    const extraBinders = getExtraBinders(card).filter((binderName) => {
      return binderName !== selectedBinder;
    });

    await editCard({
      ...card,
      extraBinders,
      updatedAt: now,
    });

    setBinderCardLayouts((currentLayouts) => {
      const binderLayout = { ...(currentLayouts[selectedBinder] || {}) };
      delete binderLayout[cardId];

      return {
        ...currentLayouts,
        [selectedBinder]: binderLayout,
      };
    });
  }

  async function markCardCollected(cardId) {
    const now = new Date().toISOString();
    const card = cards.find((currentCard) => currentCard.id === cardId);

    if (!card) return;

    await editCard({
      ...card,
      status: "Keep",
      binder: "Main Collection",
      primaryBinder: "Main Collection",
      updatedAt: now,
      createdAt: card.createdAt || now,
    });
  }

  function placeCardInSlot(cardId, slotNumber) {
    const numericSlot = Number(slotNumber);

    if (!cardId || numericSlot < 1) return;

    const sourceSlot = Number(resolvedCardSlots[cardId]);
    const targetCard = slotToCard.get(numericSlot);
    const targetCardId = targetCard ? String(targetCard.id) : "";

    if (targetCardId === String(cardId)) return;

    setBinderCardLayouts((currentLayouts) => {
      const nextLayout = { ...(currentLayouts[selectedBinder] || {}) };

      binderCards.forEach((card) => {
        nextLayout[card.id] = resolvedCardSlots[card.id];
      });

      nextLayout[cardId] = numericSlot;

      if (targetCardId && sourceSlot > 0) {
        nextLayout[targetCardId] = sourceSlot;
      }

      return {
        ...currentLayouts,
        [selectedBinder]: nextLayout,
      };
    });
  }

  function moveCardBySlot(cardId, direction) {
    const currentSlot = Number(resolvedCardSlots[cardId]);
    const nextSlot = currentSlot + direction;

    if (nextSlot < 1) return;

    placeCardInSlot(cardId, nextSlot);
  }

  function nextPage() {
    setPage((currentPage) => Math.min(currentPage + 1, totalPages));
  }

  function previousPage() {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  return (
    <div className="binder-page-shell" style={binderColorStyle}>
      <PageHeader
        label="BEACON COLLECT BINDERS"
        title="Your Binders"
        description="Create binders for master sets, favorite Pokemon, trades, wishlists, and more."
      />

      <div className="binder-toolbar">
        <div>
          <h2>{selectedBinder}</h2>
          <p>
            {binderCards.length} cards - Page {page} of {totalPages}
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

      <div className="binder-visibility-panel">
        <div>
          <p className="page-label">BINDER VISIBILITY</p>
          <h3>{selectedBinderVisibility}</h3>
          <p>{getVisibilityDescription()}</p>
        </div>

        <select
          value={selectedBinderVisibility}
          onChange={(event) =>
            setBinderVisibilityStatus(selectedBinder, event.target.value)
          }
        >
          <option>{BINDER_VISIBILITY.PRIVATE}</option>
          <option>{BINDER_VISIBILITY.PUBLIC}</option>
          <option>{BINDER_VISIBILITY.TRADE_VISIBLE}</option>
        </select>
      </div>

      <div className="binder-color-panel">
        <div>
          <p className="page-label">BINDER COLOR</p>
          <h3>Customize {selectedBinder}</h3>
          <p>This changes only this binder, so every binder can have its own look.</p>
        </div>

        <div className="binder-color-tools">
          <span style={{ background: selectedBinderColor }}></span>
          <input
            type="color"
            value={selectedBinderColor}
            aria-label={"Change " + selectedBinder + " color"}
            onChange={(event) => setBinderColor(selectedBinder, event.target.value)}
          />
        </div>
      </div>

      <form className="add-binder-form" onSubmit={handleAddBinder}>
        <div className="form-copy">
          <p className="page-label">CREATE BINDER</p>
          <h3>New Custom Binder</h3>
          <p>Create a binder for a Pokemon, set, chase list, or theme.</p>
        </div>

        <input
          placeholder="Example: All Charizards"
          value={newBinderName}
          onChange={(event) => setNewBinderName(event.target.value)}
        />

        <button type="submit">Add Binder</button>
      </form>

      <form
        className="add-card-to-binder-form binder-goal-form"
        onSubmit={handleSetGoal}
      >
        <div className="form-copy">
          <p className="page-label">BINDER LAYOUT</p>
          <h3>
            {selectedBinderGoal
              ? binderCards.length + " / " + selectedBinderGoal + " slots filled"
              : "Set Planned Slots"}
          </h3>
          <p>
            {selectedBinderGoal
              ? goalPercent + "% complete"
              : "Set the number of pockets you want, then name empty slots for missing cards."}
          </p>

          {selectedBinderGoal > 0 && (
            <div
              className="binder-goal-progress"
              style={{ "--goal-progress": goalPercent + "%" }}
            >
              <span></span>
            </div>
          )}
        </div>

        <input
          type="number"
          min="1"
          placeholder="Planned slots ex: 102"
          value={goalInput}
          onChange={(event) => setGoalInput(event.target.value)}
        />

        <button type="submit">
          {selectedBinderGoal ? "Update Slots" : "Set Slots"}
        </button>

        {selectedBinderGoal > 0 && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setBinderGoal(selectedBinder, "");
              setPage(1);
            }}
          >
            Clear
          </button>
        )}
      </form>

      <section className="master-binder-plan">
        <div>
          <p className="page-label">POCKET PLANNER</p>
          <h3>Numbered Binder Slots</h3>
          <p>
            Drag cards into any pocket and leave open spaces for cards you are
            still missing. Empty pockets can be named so you know what belongs
            there.
          </p>
        </div>

        <div className="master-binder-plan-stats">
          <span>
            <strong>{binderCards.length}</strong>
            Filled
          </span>
          <span>
            <strong>{Math.max(0, plannedSlotCount - binderCards.length)}</strong>
            Empty
          </span>
          <span>
            <strong>{plannedSlotCount}</strong>
            Slots
          </span>
        </div>
      </section>

      {!selectedBinderIsDefault && (
        <>
          <form
            className="add-card-to-binder-form"
            onSubmit={handleAddCardToBinder}
          >
            <div className="form-copy">
              <p className="page-label">ADD CARD</p>
              <h3>Add to {selectedBinder}</h3>
              <p>
                Add an existing card here without removing it from its primary
                binder.
              </p>
            </div>

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
          </form>

          <form
            className="add-card-to-binder-form binder-manage-form"
            onSubmit={handleRenameBinder}
          >
            <div className="form-copy">
              <p className="page-label">MANAGE BINDER</p>
              <h3>Rename or Delete</h3>
              <p>
                Update this custom binder without affecting the cards
                themselves.
              </p>
            </div>

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
          </form>
        </>
      )}

      {binderCards.length === 0 && selectedBinderGoal === 0 && (
        <div className="binder-empty-state">
          <p className="page-label">EMPTY BINDER</p>
          <h3>{emptyBinderMessage.title}</h3>
          <p>{emptyBinderMessage.text}</p>
        </div>
      )}

      <div className="binder-page" style={binderColorStyle}>
        {binderSlots.map(({ card, slotNumber, slotLabel, isPlannedSlot }) => (
          <div
            className={
              card
                ? dragOverSlotNumber === slotNumber
                  ? "binder-pocket draggable-binder-pocket drag-over-pocket"
                  : "binder-pocket draggable-binder-pocket"
                : isPlannedSlot
                  ? dragOverSlotNumber === slotNumber
                    ? "binder-pocket empty-pocket planned-empty-pocket drag-over-pocket"
                    : "binder-pocket empty-pocket planned-empty-pocket"
                  : dragOverSlotNumber === slotNumber
                    ? "binder-pocket empty-pocket drag-over-pocket"
                    : "binder-pocket empty-pocket"
            }
            draggable={Boolean(card)}
            onDragStart={() => {
              if (card) setDraggedCardId(String(card.id));
            }}
            onDragOver={(event) => {
              if (draggedCardId) {
                event.preventDefault();
                setDragOverSlotNumber(slotNumber);
              }
            }}
            onDragLeave={() => setDragOverSlotNumber(0)}
            onDrop={(event) => {
              event.preventDefault();

              if (draggedCardId) {
                placeCardInSlot(draggedCardId, slotNumber);
              }

              setDraggedCardId("");
              setDragOverSlotNumber(0);
            }}
            onDragEnd={() => {
              setDraggedCardId("");
              setDragOverSlotNumber(0);
            }}
            key={card ? card.id : "empty-" + slotNumber}
          >
            {card ? (
              <>
                <div className="binder-slot-number">
                  Slot {String(slotNumber).padStart(3, "0")}
                </div>

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

                {slotLabel && (
                  <small className="planned-slot-note">{slotLabel}</small>
                )}

                {card.certNumber && (
                  <small className="cert-number">Cert #{card.certNumber}</small>
                )}

                <div className="main-binder-pocket-tools">
                  <button
                    type="button"
                    className="move-card-button"
                    disabled={slotNumber === 1}
                    onClick={() => moveCardBySlot(card.id, -1)}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    className="move-card-button"
                    onClick={() => moveCardBySlot(card.id, 1)}
                  >
                    Forward
                  </button>
                </div>

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
              <div className="planned-slot-label">
                <strong>Slot {String(slotNumber).padStart(3, "0")}</strong>
                <input
                  className="planned-slot-input"
                  placeholder="Name this missing card"
                  value={slotLabel}
                  onChange={(event) =>
                    updateSlotLabel(
                      selectedBinder,
                      slotNumber,
                      event.target.value
                    )
                  }
                />
                <span>{slotLabel ? "Planned Card" : "Empty Pocket"}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Binder;
