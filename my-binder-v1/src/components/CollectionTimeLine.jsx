import { useContext } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";

function CollectionTimeline() {
  const { cards } = useContext(CardContext);

  function getPrimaryBinder(card) {
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

  function getDateValue(card) {
    return card.updatedAt || card.createdAt || card.id;
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Unknown date";
    }

    return new Date(dateValue).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getTimelineLabel(card) {
    const primaryBinder = getPrimaryBinder(card);
    const extraBinders = getExtraBinders(card);
    const hasBeenUpdated = Boolean(card.updatedAt);

    if (hasBeenUpdated && primaryBinder === "Wishlist") {
      return "Updated wishlist card";
    }

    if (hasBeenUpdated && primaryBinder === "Graded Collection") {
      return "Updated graded card";
    }

    if (hasBeenUpdated && extraBinders.includes("Trade Binder")) {
      return "Updated trade card";
    }

    if (hasBeenUpdated) {
      return "Updated card details";
    }

    if (primaryBinder === "Wishlist") {
      return "Added to Wishlist";
    }

    if (primaryBinder === "Graded Collection") {
      return "Added to Graded Collection";
    }

    if (extraBinders.includes("Trade Binder") || card.status === "For Trade") {
      return "Added to Trade Binder";
    }

    if (extraBinders.length > 0) {
      return `Added to ${extraBinders[0]}`;
    }

    return "Added to Main Collection";
  }

  const timelineCards = [...cards]
    .sort((a, b) => {
      return new Date(getDateValue(b)) - new Date(getDateValue(a));
    })
    .slice(0, 5);

  if (timelineCards.length === 0) {
    return null;
  }

  return (
    <section className="collection-timeline">
      <div className="section-header">
        <div>
          <h2>Collection Timeline</h2>
          <p>Your latest collection activity.</p>
        </div>
      </div>

      <div className="timeline-list">
        {timelineCards.map((card) => (
          <Link
            className="timeline-item"
            to={`/collection/${card.id}`}
            key={card.id}
          >
            <div className="timeline-dot"></div>

            <div>
              <strong>{card.name || "Untitled Card"}</strong>
              <span>{getTimelineLabel(card)}</span>
            </div>

            <small>{formatDate(getDateValue(card))}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CollectionTimeline;