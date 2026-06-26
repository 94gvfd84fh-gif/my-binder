import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import AddCardModal from "../components/AddCardModal";

function CardDetails() {
  const { id } = useParams();
  const { cards } = useContext(CardContext);
  const [showEditModal, setShowEditModal] = useState(false);

  const card = cards.find((card) => card.id === Number(id));

  if (!card) {
    return (
      <div>
        <Link to="/collection">← Back to Collection</Link>
        <h1>Card not found</h1>
      </div>
    );
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
        ← Back to Collection
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
          <h1>{card.name}</h1>

          <button
            className="primary-button"
            onClick={() => setShowEditModal(true)}
          >
            Edit Card
          </button>

          <div className="detail-row">
            <strong>Set:</strong>
            <span>{card.set}</span>
          </div>

          <div className="detail-row">
            <strong>Status:</strong>
            <span>{card.status}</span>
          </div>

          <div className="detail-row">
            <strong>Estimated Value:</strong>
            <span>${card.value}</span>
          </div>

          <div className="detail-row">
            <strong>Favorite:</strong>
            <span>{card.favorite ? "Yes ★" : "No ☆"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetails;