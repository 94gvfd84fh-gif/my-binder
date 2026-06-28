import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import AddCardModal from "../components/AddCardModal";

function CardDetails() {
  const { id } = useParams();
  const { cards, setCards } = useContext(CardContext);
  const [showEditModal, setShowEditModal] = useState(false);

  const card = cards.find((card) => Number(card.id) === Number(id));

  if (!card) {
    return (
      <div>
        <Link to="/collection" className="back-link">
          Back to Collection
        </Link>
        <h1>Card not found</h1>
      </div>
    );
  }

  const cardType = card.cardType || "Pokémon";
  const estimatedValue = Number(card.value || 0).toLocaleString();
  const askingPrice = Number(card.salePrice || 0).toLocaleString();
  const isGraded = card.gradingCompany && card.gradingCompany !== "Raw";
  const isForSale = card.status === "For Sale";

  const primaryBinder =
    card.status === "Wishlist"
      ? "Wishlist"
      : card.primaryBinder ||
        card.binder ||
        (isGraded ? "Graded Collection" : "Main Collection");

  const extraBinders = Array.isArray(card.extraBinders)
    ? card.extraBinders
    : [];

  const isWishlistCard = primaryBinder === "Wishlist";

  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }

    return new Date(dateValue).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function markAsCollected() {
    const now = new Date().toISOString();

    const updatedCards = cards.map((currentCard) => {
      if (Number(currentCard.id) !== Number(id)) {
        return currentCard;
      }

      return {
        ...currentCard,
        status: "Keep",
        binder: "Main Collection",
        primaryBinder: "Main Collection",
        updatedAt: now,
        createdAt: currentCard.createdAt || now,
      };
    });

    setCards(updatedCards);
  }

  return (
    <div className="card-details-page">
      {showEditModal && (
        <AddCardModal
          cardToEdit={card}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <Link to="/collection" className="back-link">
        Back to Collection
      </Link>

      <div className="card-details">
        <div className="card-details-image">
          {card.image ? (
            <img src={card.image} alt={card.name} />
          ) : (
            <span>{card.name}</span>
          )}
        </div>

        <div className="card-details-info">
          <p className="page-label">CARD DETAILS</p>

          <div className="card-title-row">
            <div>
              <h1>{card.name || "Untitled Card"}</h1>

              <p className="card-subtitle">
                {cardType} • {card.set || "Unknown Set"} • #
                {card.cardNumber || "-"} • {card.rarity || "Unknown Rarity"}
              </p>
            </div>

            <div className="card-detail-actions">
              {isWishlistCard && (
                <button className="primary-button" onClick={markAsCollected}>
                  Mark as Collected
                </button>
              )}

              <button
                className="secondary-button"
                onClick={() => setShowEditModal(true)}
              >
                Edit Card
              </button>
            </div>
          </div>

          <div className="detail-highlight-grid">
            <div>
              <span>Card Type</span>
              <strong>{cardType}</strong>
            </div>

            <div>
              <span>Estimated Value</span>
              <strong>${estimatedValue}</strong>
            </div>

            {isForSale && (
              <div>
                <span>Asking Price</span>
                <strong>${askingPrice}</strong>
              </div>
            )}

            <div>
              <span>Condition</span>
              <strong>{card.condition || "-"}</strong>
            </div>

            <div>
              <span>Primary Binder</span>
              <strong>{primaryBinder}</strong>
            </div>
          </div>

          {extraBinders.length > 0 && (
            <div className="details-binder-panel">
              <strong>Extra Binders</strong>

              <div className="extra-binder-chips">
                {extraBinders.map((binderName) => (
                  <span key={binderName}>{binderName}</span>
                ))}
              </div>
            </div>
          )}

          {isGraded && (
            <div className="grading-summary">
              <strong>
                {card.gradingCompany} {card.grade || ""}
              </strong>
              <span>Cert #{card.certNumber || "-"}</span>
            </div>
          )}

          <div className="detail-row">
            <strong>Card Type</strong>
            <span>{cardType}</span>
          </div>

          <div className="detail-row">
            <strong>Set</strong>
            <span>{card.set || "-"}</span>
          </div>

          <div className="detail-row">
            <strong>Card Number</strong>
            <span>{card.cardNumber || "-"}</span>
          </div>

          <div className="detail-row">
            <strong>Rarity</strong>
            <span>{card.rarity || "-"}</span>
          </div>

          <div className="detail-row">
            <strong>Status</strong>
            <span>{card.status || "-"}</span>
          </div>

          {isForSale && (
            <div className="detail-row">
              <strong>Asking Price</strong>
              <span>${askingPrice}</span>
            </div>
          )}

          <div className="detail-row">
            <strong>Primary Binder</strong>
            <span>{primaryBinder}</span>
          </div>

          <div className="detail-row">
            <strong>Grading Company</strong>
            <span>{card.gradingCompany || "Raw"}</span>
          </div>

          <div className="detail-row">
            <strong>Grade</strong>
            <span>{card.grade || "-"}</span>
          </div>

          <div className="detail-row">
            <strong>Certification #</strong>
            <span>{card.certNumber || "-"}</span>
          </div>

          <div className="detail-row">
            <strong>Favorite</strong>
            <span>{card.favorite ? "Yes ★" : "No ☆"}</span>
          </div>

          <div className="detail-row">
            <strong>Date Added</strong>
            <span>{formatDate(card.createdAt || card.id)}</span>
          </div>

          <div className="detail-row">
            <strong>Last Updated</strong>
            <span>{formatDate(card.updatedAt || card.createdAt || card.id)}</span>
          </div>

          <div className="notes-panel">
            <strong>Notes</strong>
            <p>{card.notes || "No notes added yet."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetails;