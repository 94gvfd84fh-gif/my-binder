import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";

function AddCardModal({ onClose, cardToEdit }) {
  const { cards, setCards } = useContext(CardContext);

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
  const [favorite, setFavorite] = useState(
    cardToEdit ? cardToEdit.favorite : false
  );
  const [image, setImage] = useState(cardToEdit ? cardToEdit.image : "");

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

        <form className="add-card-form">
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
            <option>Graded Vault</option>
            <option>Wishlist</option>
          </select>

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {image && <img className="image-preview" src={image} alt="Preview" />}

          <label>
            <input
              type="checkbox"
              checked={favorite}
              onChange={(event) => setFavorite(event.target.checked)}
            />
            Favorite
          </label>

          <button type="button" onClick={handleSave}>
            {cardToEdit ? "Save Changes" : "Save Card"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCardModal;