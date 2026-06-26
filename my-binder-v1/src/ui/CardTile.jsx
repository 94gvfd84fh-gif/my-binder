function CardTile({ card, onDelete, onToggleFavorite }) {
  return (
    <div className="collection-card">
      <div className="collection-card-image">
        {card.image ? (
          <img src={card.image} alt={card.name} />
        ) : (
          card.name
        )}
      </div>

      <h3>{card.name}</h3>
      <p>{card.set}</p>

      <div className="collection-card-footer">
        <span>${card.value}</span>

        <button
          className="favorite-button"
          onClick={() => onToggleFavorite(card.id)}
        >
          {card.favorite ? "★" : "☆"}
        </button>
      </div>

      <small>{card.status}</small>

      <button className="delete-button" onClick={() => onDelete(card.id)}>
        Delete
      </button>
    </div>
  );
}

export default CardTile;