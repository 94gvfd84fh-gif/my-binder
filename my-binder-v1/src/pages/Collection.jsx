import { useContext, useState } from "react";
import { CardContext } from "../context/CardContext";
import { BinderContext } from "../context/BinderContext";
import AddCardModal from "../components/AddCardModal";
import PageHeader from "../ui/PageHeader";
import CardTile from "../ui/CardTile";

const CARD_TYPES = [
  "All Types",
  "Pokémon",
  "Magic: The Gathering",
  "Yu-Gi-Oh!",
  "One Piece",
  "Union Arena",
  "Baseball",
  "Basketball",
  "Football",
  "Soccer",
  "Other",
];

function Collection() {
  const { cards, setCards } = useContext(CardContext);
  const { binders } = useContext(BinderContext);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Cards");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [sort, setSort] = useState("Newest");
  const [showAddModal, setShowAddModal] = useState(false);

  function getPrimaryBinder(card) {
    if (card.status === "Wishlist") {
      return "Wishlist";
    }

    if (card.primaryBinder) {
      return card.primaryBinder;
    }

    if (card.binder) {
      return card.binder;
    }

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
    const primaryBinder = getPrimaryBinder(card);
    const extraBinders = getExtraBinders(card);
    const salePriceText = String(card.salePrice || "");
    const cardType = card.cardType || "Pokémon";

    const matchesSearch =
      cardType.toLowerCase().includes(searchText) ||
      (card.name || "").toLowerCase().includes(searchText) ||
      (card.set || "").toLowerCase().includes(searchText) ||
      (card.status || "").toLowerCase().includes(searchText) ||
      (card.rarity || "").toLowerCase().includes(searchText) ||
      (card.condition || "").toLowerCase().includes(searchText) ||
      String(card.value || "").includes(searchText) ||
      salePriceText.includes(searchText) ||
      primaryBinder.toLowerCase().includes(searchText) ||
      extraBinders.join(" ").toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All Cards" ||
      (filter === "Favorites" && card.favorite) ||
      filter === card.status ||
      cardBelongsToBinder(card, filter);

    const matchesType =
      typeFilter === "All Types" || cardType === typeFilter;

    return matchesSearch && matchesFilter && matchesType;
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

    if (sort === "Highest Sale Price") {
      return Number(b.salePrice || 0) - Number(a.salePrice || 0);
    }

    if (sort === "Lowest Sale Price") {
      return Number(a.salePrice || 0) - Number(b.salePrice || 0);
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
          placeholder="Search cards, type, set, rarity, condition, status, binder, or price..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          {CARD_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option>All Cards</option>
          <option>Favorites</option>
          <option>For Trade</option>
          <option>For Sale</option>
          <option>Wishlist</option>

          {binders.map((binder) => (
            <option key={binder}>{binder}</option>
          ))}
        </select>

        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Highest Value</option>
          <option>Lowest Value</option>
          <option>Highest Sale Price</option>
          <option>Lowest Sale Price</option>
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
            Add a card or adjust your search and filters to keep building your
            Pocket Deck.
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