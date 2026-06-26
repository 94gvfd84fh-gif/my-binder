import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";

function AddCardModal({ onClose, cardToEdit }) {
  const { cards, setCards } = useContext(CardContext);

  const [name, setName] = useState(cardToEdit ? cardToEdit.name : "");
  const [set, setSet] = useState(cardToEdit ? cardToEdit.set : "");
  const [value, setValue] = useState(cardToEdit ? cardToEdit.value : "");
  const [status, setStatus] = useState(cardToEdit ? cardToEdit.status : "Keep");
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
    if (cardToEdit) {
      const updatedCards = cards.map((card) => {
        if (card.id === cardToEdit.id) {
          return {
            ...card,
            name,
            set,
            value: Number(value),
            status,
            favorite,
            image,
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
      name,
      set,
      value: Number(value),
      status,
      favorite,
      image,
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