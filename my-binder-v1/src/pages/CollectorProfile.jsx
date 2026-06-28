import { Link, useParams } from "react-router-dom";
import PageHeader from "../ui/PageHeader";
import { collectors } from "../data/communityData";
import "../styles/collectorProfile.css";

function CollectorProfile() {
  const { collectorId } = useParams();

  const collector = collectors.find((collector) => {
    return String(collector.id) === String(collectorId);
  });

  if (!collector) {
    return (
      <div>
        <PageHeader
          label="COLLECTOR PROFILE"
          title="Collector Not Found"
          description="This collector profile does not exist yet."
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
        label="COLLECTOR PROFILE"
        title={collector.username}
        description="Preview this collector's identity, trade signals, and public binders."
      />

      <section className="collector-detail-card">
        <div className="collector-detail-hero">
          <div className="collector-avatar">
            <span>{collector.username.charAt(0)}</span>
          </div>

          <div>
            <p className="page-label">{collector.favoriteTcg} COLLECTOR</p>
            <h2>{collector.username}</h2>
            <p>{collector.style}</p>
          </div>
        </div>

        <div className="collector-detail-stats">
          <div>
            <span>Public Binders</span>
            <strong>{collector.publicBinders}</strong>
          </div>

          <div>
            <span>Trade Status</span>
            <strong>{collector.tradeStatus}</strong>
          </div>

          <div>
            <span>Featured Card</span>
            <strong>{collector.featuredCard}</strong>
          </div>
        </div>

        <div className="collector-detail-actions">
          <button className="primary-button">Follow Collector</button>

          <Link
            className="secondary-button"
            to={`/community/collector/${collector.id}/binder`}
          >
            View Trade Binder
          </Link>

          <button className="secondary-button">Request Trade</button>

          <Link className="secondary-button" to="/community">
            Back to Community
          </Link>
        </div>
      </section>
    </div>
  );
}

export default CollectorProfile;