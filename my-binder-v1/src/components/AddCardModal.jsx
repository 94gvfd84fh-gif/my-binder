import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import { searchPokemonCards } from "../services/pokemonApi";

function AddCardModal({ onClose, cardToEdit }) {
  const { cards, setCards } = useContext(CardContext);

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
  const [binder, setBinder] = useState(
    cardToEdit ? cardToEdit.binder || "Main Collection" : "Main Collection"
  );

  const [gradingCompany, setGradingCompany] = useState(
    cardToEdit ? cardToEdit.gradingCompany || "Raw" : "Raw"
  );
  const [grade, setGrade] = useState(cardToEdit ? cardToEdit.grade || "" : "");
  const [certNumber, setCertNumber] = useState(
    cardToEdit ? cardToEdit.certNumber || "" : ""
  );

  const [favorite, setFavorite] = useState(
    cardToEdit ? cardToEdit.favorite : false
  );
  const [image, setImage] = useState(cardToEdit ? cardToEdit.image : "");

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

  function handleSave() {
    const cardData = {
      name,
      set,
      cardNumber,
      rarity,
      condition,
      notes,
      value: Number(value),
      status,
      binder,
      gradingCompany,
      grade,
      certNumber,
      favorite,
      image,
    };

    if (cardToEdit) {
      const updatedCards = cards.map((card) => {
        if (card.id === cardToEdit.id) {
          return {
            ...card,
            ...cardData,
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
            </select>

            <select
              value={binder}
              onChange={(event) => setBinder(event.target.value)}
            >
              <option>Main Collection</option>
              <option>Showcase Binder</option>
              <option>Trade Binder</option>
              <option>Graded Pocket Deck</option>
              <option>Wishlist</option>
            </select>
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