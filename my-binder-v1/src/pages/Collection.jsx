import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import AddCardModal from "../components/AddCardModal";

function Collection() {
  const { cards } = useContext(CardContext);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCards = cards.filter((card) => {
    return (
      card.name.toLowerCase().includes(search.toLowerCase()) ||
      card.set.toLowerCase().includes(search.toLowerCase()) ||
      card.status.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      {showAddModal && (
        <AddCardModal onClose={() => setShowAddModal(false)} />
      )}

      <div className="page-header">
        <div>
          <p className="page-label">MY BINDER</p>
          <h1>Collection</h1>
          <p>Manage your cards, values, favorites, and trade status.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowAddModal(true)}
        >
          + Add Card
        </button>
      </div>

      <div className="collection-tools">
        <input
          placeholder="Search your collection..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select>
          <option>All Cards</option>
          <option>Favorites</option>
          <option>For Trade</option>
          <option>For Sale</option>
        </select>
      </div>

      <div className="collection-grid">
        {filteredCards.map((card) => (
          <div className="collection-card" key={card.id}>
            <div className="collection-card-image">{card.name}</div>

            <h3>{card.name}</h3>
            <p>{card.set}</p>

            <div className="collection-card-footer">
              <span>${card.value}</span>
              <span>{card.favorite ? "★" : "☆"}</span>
            </div>

            <small>{card.status}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collection;