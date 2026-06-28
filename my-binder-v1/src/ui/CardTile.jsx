import { useNavigate } from "react-router-dom";

function CardTile({
  card,
  onDelete,
  onToggleFavorite,
  clickable = true,
  showDelete = true,
  showFavorite = true,
}) {
  const navigate = useNavigate();

  const value = Number(card.value || 0).toLocaleString();
  const salePrice = Number(card.salePrice || 0).toLocaleString();

  const isGraded = card.gradingCompany && card.gradingCompany !== "Raw";
  const isForSale = card.status === "For Sale";
  const isForTrade = card.status === "For Trade";
  const isWishlist = card.status === "Wishlist";

  const primaryBinder = isWishlist
    ? "Wishlist"
    : card.primaryBinder ||
      card.binder ||
      (isGraded ? "Graded Collection" : "Main Collection");

  const extraBinders = Array.isArray(card.extraBinders)
    ? card.extraBinders
    : [];

  function openCard() {
    if (clickable) {
      navigate(`/collection/${card.id}`);
    }
  }

  return (
    <article
      className={
        isWishlist ? "collection-card wishlist-card" : "collection-card"
      }
      onClick={openCard}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(event) => {
        if (clickable && event.key === "Enter") {
          openCard();
        }
      }}
    >
      <div className="card-tile-image-wrap">
        {isGraded && (
          <div className="card-grade-badge">
            {card.gradingCompany} {card.grade || ""}
          </div>
        )}

        {showFavorite && onToggleFavorite && (
          <button
            className={
              card.favorite
                ? "favorite-button active-favorite"
                : "favorite-button"
            }
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
        )}

        <div className="collection-card-image">
          {card.image ? (
            <img src={card.image} alt={card.name || "Card"} />
          ) : (
            <span>{card.name || "Untitled Card"}</span>
          )}
        </div>
      </div>

      <div className="card-tile-body">
        <div className="card-title-block">
          <h3>{card.name || "Untitled Card"}</h3>
          <p>{card.set || "Unknown set"}</p>
        </div>

        <div className="card-status-stack">
          <small className="card-type-chip">
            {card.cardType || "Pokémon"}
          </small>

          {isForSale && (
            <small className="sale-price-chip">Ask ${salePrice}</small>
          )}

          {isForTrade && <small className="trade-chip">Open to Trade</small>}

          {isWishlist && (
            <small className="wishlist-chip">Not collected yet</small>
          )}

          {!isForSale && !isForTrade && !isWishlist && card.status && (
            <small className="card-status">{card.status}</small>
          )}
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
          <div>
            <span>Est. Value</span>
            <strong>${value}</strong>
          </div>
        </div>

        {showDelete && onDelete && (
          <button
            className="delete-button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(card.id);
            }}
          >
            Delete Card
          </button>
        )}
      </div>
    </article>
  );
}

export default CardTile;