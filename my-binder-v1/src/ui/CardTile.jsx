import { useNavigate } from "react-router-dom";

function CardTile({ card, onDelete, onToggleFavorite }) {
  const navigate = useNavigate();

  const value = Number(card.value || 0).toLocaleString();
  const isGraded = card.gradingCompany && card.gradingCompany !== "Raw";

  return (
    <article
      className="collection-card"
      onClick={() => navigate(`/collection/${card.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          navigate(`/collection/${card.id}`);
        }
      }}
    >
      {isGraded && (
        <div className="card-grade-badge">
          {card.gradingCompany} {card.grade || ""}
        </div>
      )}

      <div className="collection-card-image">
        {card.image ? (
          <img src={card.image} alt={card.name} />
        ) : (
          <span>{card.name}</span>
        )}
      </div>

      <div className="card-tile-body">
        <div>
          <h3>{card.name || "Untitled Card"}</h3>
          <p>{card.set || "Unknown set"}</p>
        </div>

        {card.binder && <small className="binder-label">{card.binder}</small>}

        <div className="collection-card-footer">
          <span>${value}</span>

          <button
            className="favorite-button"
            aria-label={
              card.favorite ? "Remove from favorites" : "Add to favorites"
            }
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(card.id);
            }}
          >
            {card.favorite ? "★" : "☆"}
          </button>
        </div>

        {card.status && <small className="card-status">{card.status}</small>}

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
    </article>
  );
}

export default CardTile;