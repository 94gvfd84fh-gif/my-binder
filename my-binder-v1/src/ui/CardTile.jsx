import { useNavigate } from "react-router-dom";

function CardTile({ card, onDelete, onToggleFavorite }) {
  const navigate = useNavigate();

  const value = Number(card.value || 0).toLocaleString();
  const isGraded = card.gradingCompany && card.gradingCompany !== "Raw";

  const primaryBinder =
    card.primaryBinder ||
    card.binder ||
    (isGraded ? "Graded Collection" : "Main Collection");

  const extraBinders = Array.isArray(card.extraBinders)
    ? card.extraBinders
    : [];

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

        <div className="card-binder-stack">
          <small className="binder-label">{primaryBinder}</small>

          {extraBinders.length > 0 && (
            <div className="extra-binder-chips">
              {extraBinders.slice(0, 3).map((binderName) => (
                <span key={binderName}>{binderName}</span>
              ))}

              {extraBinders.length > 3 && (
                <span>+{extraBinders.length - 3}</span>
              )}
            </div>
          )}
        </div>

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