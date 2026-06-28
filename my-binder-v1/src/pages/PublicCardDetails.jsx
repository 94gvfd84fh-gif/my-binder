import { Link, useParams } from "react-router-dom";
import PageHeader from "../ui/PageHeader";
import { collectors } from "../data/communityData";
import { sampleBinderCards } from "./PublicBinder";

function PublicCardDetails() {
  const { collectorId, cardId } = useParams();

  const collector = collectors.find(
    (collector) => String(collector.id) === String(collectorId)
  );

  const card = (sampleBinderCards[collectorId] || []).find(
    (card) => String(card.id) === String(cardId)
  );

  if (!collector || !card) {
    return (
      <div>
        <PageHeader
          label="PUBLIC CARD"
          title="Card Not Found"
          description="This card isn't available."
        />

        <Link
          className="secondary-button"
          to={`/community/collector/${collectorId}/binder`}
        >
          Back to Trade Binder
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        label="PUBLIC CARD"
        title={card.name}
        description={`Viewing a trade card from ${collector.username}.`}
      />

      <section className="card-details-page">
        <div className="card-details-image">
          {card.image ? (
            <img src={card.image} alt={card.name} />
          ) : (
            <div className="image-placeholder">
              <span>{card.name}</span>
            </div>
          )}
        </div>

        <div className="card-details-info">
          <h2>{card.name}</h2>

          <p>{card.set}</p>

          <h3>Estimated Value</h3>
          <p>${Number(card.value || 0).toLocaleString()}</p>

          {card.salePrice && (
            <>
              <h3>Asking Price</h3>
              <p>${Number(card.salePrice).toLocaleString()}</p>
            </>
          )}

          <h3>Status</h3>
          <p>{card.status}</p>

          {card.gradingCompany && (
            <>
              <h3>Grade</h3>
              <p>
                {card.gradingCompany} {card.grade}
              </p>
            </>
          )}

          <div className="collector-detail-actions">
            <button className="primary-button">
              Request Trade
            </button>

            <Link
              className="secondary-button"
              to={`/community/collector/${collector.id}/binder`}
            >
              Back to Trade Binder
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PublicCardDetails;