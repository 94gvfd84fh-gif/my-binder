import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";

function AddCardModal({ onClose }) {
  const { cards, setCards } = useContext(CardContext);

  const [name, setName] = useState("");
  const [set, setSet] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("Keep");
  const [favorite, setFavorite] = useState(false);

  function handleSave() {
    const newCard = {
      id: Date.now(),
      name: name,
      set: set,
      value: Number(value),
      status: status,
      favorite: favorite,
    };

    setCards([newCard, ...cards]);
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Add Card</h2>
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

          <label>
            <input
              type="checkbox"
              checked={favorite}
              onChange={(event) => setFavorite(event.target.checked)}
            />
            Favorite
          </label>

          <button type="button" onClick={handleSave}>
            Save Card
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCardModal;