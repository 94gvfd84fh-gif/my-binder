import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import AddCardModal from "../components/AddCardModal";
import PageHeader from "../ui/PageHeader";
import CardTile from "../ui/CardTile";

function Collection() {
  const { cards, setCards } = useContext(CardContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Cards");
  const [sort, setSort] = useState("Newest");
  const [showAddModal, setShowAddModal] = useState(false);

  function deleteCard(id) {
    const updatedCards = cards.filter((card) => card.id !== id);
    setCards(updatedCards);
  }

  function toggleFavorite(id) {
    const updatedCards = cards.map((card) => {
      if (card.id === id) {
        return { ...card, favorite: !card.favorite };
      }

      return card;
    });

    setCards(updatedCards);
  }

  const filteredCards = cards.filter((card) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (card.name || "").toLowerCase().includes(searchText) ||
      (card.set || "").toLowerCase().includes(searchText) ||
      (card.status || "").toLowerCase().includes(searchText) ||
      (card.rarity || "").toLowerCase().includes(searchText) ||
      (card.condition || "").toLowerCase().includes(searchText) ||
      (card.binder || "").toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All Cards" ||
      (filter === "Favorites" && card.favorite) ||
      filter === card.status ||
      filter === card.binder;

    return matchesSearch && matchesFilter;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sort === "Newest") {
      return Number(b.id) - Number(a.id);
    }

    if (sort === "Oldest") {
      return Number(a.id) - Number(b.id);
    }

    if (sort === "Highest Value") {
      return Number(b.value || 0) - Number(a.value || 0);
    }

    if (sort === "Lowest Value") {
      return Number(a.value || 0) - Number(b.value || 0);
    }

    if (sort === "A-Z") {
      return (a.name || "").localeCompare(b.name || "");
    }

    if (sort === "Favorites First") {
      return Number(b.favorite) - Number(a.favorite);
    }

    return 0;
  });

  return (
    <div>
      {showAddModal && (
        <AddCardModal onClose={() => setShowAddModal(false)} />
      )}

      <PageHeader
        label="POCKET DECK COLLECTION"
        title="Your Cards"
        description="Search, sort, favorite, and organize every card in your collection."
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
          placeholder="Search cards, sets, rarity, condition, status, or binder..."
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
          <option>Main Collection</option>
          <option>Showcase Binder</option>
          <option>Trade Binder</option>
          <option>Graded Vault</option>
          <option>Wishlist</option>
        </select>

        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Highest Value</option>
          <option>Lowest Value</option>
          <option>A-Z</option>
          <option>Favorites First</option>
        </select>
      </div>

      {sortedCards.length > 0 ? (
        <div className="collection-grid">
          {sortedCards.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              onDelete={deleteCard}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <h2>No cards found</h2>
          <p>
            Add a card or adjust your search and filters to keep building your Pocket Deck.
          </p>
          <button
            className="primary-button"
            onClick={() => setShowAddModal(true)}
          >
            + Add Card
          </button>
        </div>
      )}
    </div>
  );
}

export default Collection;