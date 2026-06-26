import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import AddCardModal from "../components/AddCardModal";
import PageHeader from "../ui/PageHeader";
import CardTile from "../ui/CardTile";

function Collection() {
  const { cards } = useContext(CardContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Cards");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(search.toLowerCase()) ||
      card.set.toLowerCase().includes(search.toLowerCase()) ||
      card.status.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All Cards" ||
      (filter === "Favorites" && card.favorite) ||
      filter === card.status;

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {showAddModal && (
        <AddCardModal onClose={() => setShowAddModal(false)} />
      )}

      <PageHeader
        label="MY BINDER"
        title="Collection"
        description="Manage your cards, values, favorites, and trade status."
        action={
          <button
            className="primary-button"
            onClick={() => setShowAddModal(true)}
          >
            + Add Card
          </button>
        }
      />

      <div className="collection-tools">
        <input
          placeholder="Search your collection..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option>All Cards</option>
          <option>Favorites</option>
          <option>For Trade</option>
          <option>For Sale</option>
        </select>
      </div>

      <div className="collection-grid">
        {filteredCards.map((card) => (
          <CardTile key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default Collection;