import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import { BinderContext } from "../context/BinderContext";
import { searchPokemonCards } from "../services/pokemonApi";

function AddCardModal({ onClose, cardToEdit }) {
  const { cards, setCards } = useContext(CardContext);
  const { binders } = useContext(BinderContext);

  function getStartingPrimaryBinder(card) {
    if (!card) {
      return "Main Collection";
    }

    if (card.primaryBinder) {
      return card.primaryBinder;
    }

    if (
      card.binder === "Main Collection" ||
      card.binder === "Graded Collection" ||
      card.binder === "Wishlist"
    ) {
      return card.binder;
    }

    if (card.gradingCompany && card.gradingCompany !== "Raw") {
      return "Graded Collection";
    }

    return "Main Collection";
  }

  function getStartingExtraBinders(card) {
    if (!card) {
      return [];
    }

    const extras = Array.isArray(card.extraBinders)
      ? [...card.extraBinders]
      : [];

    if (
      card.binder &&
      card.binder !== "Main Collection" &&
      card.binder !== "Graded Collection" &&
      card.binder !== "Wishlist" &&
      !extras.includes(card.binder)
    ) {
      extras.push(card.binder);
    }

    return extras;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [name, setName] = useState(cardToEdit ? cardToEdit.name : "");
  const [set, setSet] = useState(cardToEdit ? cardToEdit.set : "");
  const [cardNumber, setCardNumber] = useState(
    cardToEdit ? cardToEdit.cardNumber || "" : ""
  );
  const [rarity, setRarity] = useState(cardToEdit ? cardToEdit.rarity || "" : "");
  const [condition, setCondition] = useState(
    cardToEdit ? cardToEdit.condition || "Near Mint" : "Near Mint"
  );
  const [notes, setNotes] = useState(cardToEdit ? cardToEdit.notes || "" : "");
  const [value, setValue] = useState(cardToEdit ? cardToEdit.value : "");
  const [status, setStatus] = useState(cardToEdit ? cardToEdit.status : "Keep");

  const [gradingCompany, setGradingCompany] = useState(
    cardToEdit ? cardToEdit.gradingCompany || "Raw" : "Raw"
  );
  const [grade, setGrade] = useState(cardToEdit ? cardToEdit.grade || "" : "");
  const [certNumber, setCertNumber] = useState(
    cardToEdit ? cardToEdit.certNumber || "" : ""
  );

  const [extraBinders, setExtraBinders] = useState(
    getStartingExtraBinders(cardToEdit)
  );

  const [favorite, setFavorite] = useState(
    cardToEdit ? cardToEdit.favorite : false
  );
  const [image, setImage] = useState(cardToEdit ? cardToEdit.image : "");

  const primaryBinder =
    status === "Wishlist"
      ? "Wishlist"
      : gradingCompany && gradingCompany !== "Raw"
      ? "Graded Collection"
      : getStartingPrimaryBinder(cardToEdit) === "Wishlist"
      ? "Main Collection"
      : "Main Collection";

  const extraBinderOptions = binders.filter((binderName) => {
    return binderName !== "Main Collection" && binderName !== "Graded Collection";
  });

  const selectedExtraBinderCount =
    status === "For Trade" && !extraBinders.includes("Trade Binder")
      ? extraBinders.length + 1
      : extraBinders.length;

  async function handleCardSearch() {
    try {
      setIsSearching(true);
      const results = await searchPokemonCards(searchTerm);
      setSearchResults(results);
    } catch (error) {
      alert("Could not search Pokémon cards right now.");
    } finally {
      setIsSearching(false);
    }
  }

  function selectSearchResult(result) {
    setName(result.name);
    setSet(result.set);
    setCardNumber(result.cardNumber);
    setRarity(result.rarity);
    setImage(result.image);
    setSearchResults([]);
    setSearchTerm("");
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function toggleExtraBinder(binderName) {
    if (extraBinders.includes(binderName)) {
      setExtraBinders(
        extraBinders.filter((binder) => {
          return binder !== binderName;
        })
      );

      return;
    }

    setExtraBinders([...extraBinders, binderName]);
  }

  function getFinalExtraBinders() {
    const finalExtraBinders = [...extraBinders];

    if (status === "For Trade" && !finalExtraBinders.includes("Trade Binder")) {
      finalExtraBinders.push("Trade Binder");
    }

    return Array.from(
      new Set(
        finalExtraBinders.filter((binderName) => {
          return binderName !== primaryBinder;
        })
      )
    );
  }

  function handleSave() {
    const now = new Date().toISOString();
    const finalExtraBinders = getFinalExtraBinders();

    const cardData = {
      name,
      set,
      cardNumber,
      rarity,
      condition,
      notes,
      value: Number(value),
      status,
      binder: primaryBinder,
      primaryBinder,
      extraBinders: finalExtraBinders,
      gradingCompany,
      grade,
      certNumber,
      favorite,
      image,
      updatedAt: now,
    };

    if (cardToEdit) {
      const updatedCards = cards.map((card) => {
        if (card.id === cardToEdit.id) {
          return {
            ...card,
            ...cardData,
            createdAt: card.createdAt || now,
          };
        }

        return card;
      });

      setCards(updatedCards);
      onClose();
      return;
    }

    const newCard = {
      id: Date.now(),
      ...cardData,
      createdAt: now,
    };

    setCards([newCard, ...cards]);
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>{cardToEdit ? "Edit Card" : "Add Card"}</h2>
          <button onClick={onClose}>X</button>
        </div>

        {!cardToEdit && (
          <div className="form-section">
            <h3>Smart Search</h3>

            <div className="smart-search-row">
              <input
                placeholder="Search Pokémon card ex: Charizard"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <button type="button" onClick={handleCardSearch}>
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result) => (
                  <button
                    type="button"
                    className="search-result-card"
                    key={result.apiId}
                    onClick={() => selectSearchResult(result)}
                  >
                    {result.image && (
                      <img src={result.image} alt={result.name} />
                    )}

                    <div>
                      <strong>{result.name}</strong>
                      <span>{result.set}</span>
                      <small>
                        #{result.cardNumber} • {result.rarity || "Unknown"}
                      </small>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <form className="add-card-form">
          <div className="form-section">
            <h3>Basic Information</h3>

            <input
              placeholder="Card name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <input
              placeholder="Set name"
              value={set}
              onChange={(event) => setSet(event.target.value)}
            />

            <input
              placeholder="Card number ex: 199/165"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
            />

            <input
              placeholder="Rarity ex: Secret Rare"
              value={rarity}
              onChange={(event) => setRarity(event.target.value)}
            />
          </div>

          <div className="form-section">
            <h3>Collection Details</h3>

            <select
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
            >
              <option>Mint</option>
              <option>Near Mint</option>
              <option>Lightly Played</option>
              <option>Moderately Played</option>
              <option>Heavily Played</option>
              <option>Damaged</option>
            </select>

            <input
              placeholder="Estimated value"
              type="number"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option>Keep</option>
              <option>For Trade</option>
              <option>For Sale</option>
              <option>Wishlist</option>
            </select>

            <div className="primary-binder-preview">
              <p>Primary Binder</p>
              <strong>{primaryBinder}</strong>
              <span>
                {primaryBinder === "Graded Collection"
                  ? "Graded cards are stored here automatically."
                  : primaryBinder === "Wishlist"
                  ? "Wishlist cards are tracked separately from owned cards."
                  : "Raw owned cards stay in your Main Collection."}
              </span>
            </div>

            <div className="extra-binder-picker">
              <p>Extra Binders</p>

              <details className="extra-binder-dropdown">
                <summary>
                  {selectedExtraBinderCount > 0
                    ? `${selectedExtraBinderCount} selected`
                    : "Choose extra binders"}
                </summary>

                <div className="extra-binder-menu">
                  {extraBinderOptions.map((binderName) => (
                    <label key={binderName} className="extra-binder-option">
                      <input
                        type="checkbox"
                        checked={
                          extraBinders.includes(binderName) ||
                          (status === "For Trade" &&
                            binderName === "Trade Binder")
                        }
                        disabled={
                          status === "For Trade" &&
                          binderName === "Trade Binder"
                        }
                        onChange={() => toggleExtraBinder(binderName)}
                      />

                      <span>{binderName}</span>
                    </label>
                  ))}
                </div>
              </details>
            </div>
          </div>

          <div className="form-section">
            <h3>Grading</h3>

            <select
              value={gradingCompany}
              onChange={(event) => setGradingCompany(event.target.value)}
            >
              <option>Raw</option>
              <option>PSA</option>
              <option>Beckett</option>
              <option>TAG</option>
              <option>CGC</option>
              <option>Other</option>
            </select>

            <input
              placeholder="Grade ex: 10, 9.5, Pristine 10"
              value={grade}
              onChange={(event) => setGrade(event.target.value)}
            />

            <input
              placeholder="Certification number"
              value={certNumber}
              onChange={(event) => setCertNumber(event.target.value)}
            />
          </div>

          <div className="form-section">
            <h3>Extras</h3>

            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {image && (
              <img className="image-preview" src={image} alt="Preview" />
            )}

            <label className="favorite-toggle">
              <input
                type="checkbox"
                checked={favorite}
                onChange={(event) => setFavorite(event.target.checked)}
              />
              Favorite
            </label>
          </div>

          <button type="button" onClick={handleSave}>
            {cardToEdit ? "Save Changes" : "Save Card"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCardModal;