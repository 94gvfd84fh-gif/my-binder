import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import AddCardModal from "../components/AddCardModal";

function CardDetails() {
  const { id } = useParams();
  const { cards } = useContext(CardContext);
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

  const estimatedValue = Number(card.value || 0).toLocaleString();
  const isGraded = card.gradingCompany && card.gradingCompany !== "Raw";

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
                {card.set || "Unknown Set"} • #{card.cardNumber || "-"} •{" "}
                {card.rarity || "Unknown Rarity"}
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowEditModal(true)}
            >
              Edit Card
            </button>
          </div>

          <div className="detail-highlight-grid">
            <div>
              <span>Estimated Value</span>
              <strong>${estimatedValue}</strong>
            </div>

            <div>
              <span>Condition</span>
              <strong>{card.condition || "-"}</strong>
            </div>

            <div>
              <span>Binder</span>
              <strong>{card.binder || "Main Collection"}</strong>
            </div>
          </div>

          {isGraded && (
            <div className="grading-summary">
              <strong>
                {card.gradingCompany} {card.grade || ""}
              </strong>
              <span>Cert #{card.certNumber || "-"}</span>
            </div>
          )}

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