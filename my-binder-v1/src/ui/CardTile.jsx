import { useNavigate } from "react-router-dom";

function CardTile({ card, onDelete, onToggleFavorite }) {
  const navigate = useNavigate();

  return (
    <div
      className="collection-card"
      onClick={() => navigate(`/collection/${card.id}`)}
      style={{ cursor: "pointer" }}
    >
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
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(card.id);
          }}
        >
          {card.favorite ? "★" : "☆"}
        </button>
      </div>

      <small>{card.status}</small>

      <button
        className="delete-button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(card.id);
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default CardTile;