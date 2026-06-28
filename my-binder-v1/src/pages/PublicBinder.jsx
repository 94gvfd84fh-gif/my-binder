import { Link, useParams } from "react-router-dom";
import PageHeader from "../ui/PageHeader";
import CardTile from "../ui/CardTile";
import { collectors } from "../data/communityData";

export const sampleBinderCards = {
  "vintage-adam": [
    {
      id: "vintage-charizard",
      name: "Charizard Base Set",
      set: "Base Set",
      value: 650,
      status: "For Trade",
      binder: "Trade Binder",
      image: "",
      favorite: true,
    },
    {
      id: "vintage-blastoise",
      name: "Blastoise Base Set",
      set: "Base Set",
      value: 220,
      status: "For Trade",
      binder: "Trade Binder",
      image: "",
    },
    {
      id: "vintage-venusaur",
      name: "Venusaur Base Set",
      set: "Base Set",
      value: 180,
      status: "For Sale",
      salePrice: 200,
      binder: "Trade Binder",
      image: "",
    },
  ],
  slabqueen: [
    {
      id: "luka-silver",
      name: "Luka Dončić Silver",
      set: "Prizm Rookie",
      value: 900,
      status: "For Sale",
      salePrice: 950,
      binder: "Trade Binder",
      gradingCompany: "PSA",
      grade: "10",
      image: "",
    },
    {
      id: "lebron-refractor",
      name: "LeBron James Refractor",
      set: "Topps Chrome",
      value: 700,
      status: "For Trade",
      binder: "Trade Binder",
      gradingCompany: "PSA",
      grade: "9",
      image: "",
    },
  ],
  onepiecehunter: [
    {
      id: "manga-shanks",
      name: "Manga Shanks",
      set: "Romance Dawn",
      value: 1200,
      status: "For Trade",
      binder: "Trade Binder",
      image: "",
      favorite: true,
    },
    {
      id: "trafalgar-law-alt",
      name: "Trafalgar Law Alt Art",
      set: "Paramount War",
      value: 180,
      status: "For Sale",
      salePrice: 210,
      binder: "Trade Binder",
      image: "",
    },
  ],
};

function PublicBinder() {
  const { collectorId } = useParams();

  const collector = collectors.find((collector) => {
    return String(collector.id) === String(collectorId);
  });

  const binderCards = sampleBinderCards[collectorId] || [];

  if (!collector) {
    return (
      <div>
        <PageHeader
          label="PUBLIC BINDER"
          title="Binder Not Found"
          description="This public binder does not exist yet."
        />

        <Link className="secondary-button" to="/community">
          Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        label="PUBLIC BINDER"
        title={`${collector.username}'s Trade Binder`}
        description="Preview cards this collector may be open to trading."
      />

      <section className="public-binder-page">
        <div className="section-header">
          <div>
            <h2>Trade Binder</h2>
            <p>{collector.tradeStatus}</p>
          </div>

          <Link
            className="secondary-button"
            to={`/community/collector/${collector.id}`}
          >
            Back to Profile
          </Link>
        </div>

        {binderCards.length > 0 ? (
          <div className="collection-grid">
            {binderCards.map((card) => (
              <Link
                key={card.id}
                to={`/community/collector/${collector.id}/card/${card.id}`}
                className="public-card-link"
              >
                <CardTile
                  card={card}
                  clickable={false}
                  showDelete={false}
                  showFavorite={false}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="public-binder-empty-state">
            <h3>No public trade cards yet</h3>
            <p>
              This collector has not shared any trade cards in this binder yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default PublicBinder;