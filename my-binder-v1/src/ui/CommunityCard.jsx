import { Link } from "react-router-dom";

function CommunityCard({
  label,
  title,
  details = [],
  description,
  buttonText,
  buttonClassName = "",
  onButtonClick,
  linkTo,
  linkText = "View Profile",
}) {
  return (
    <article className="community-event-card">
      {label && <p className="page-label">{label}</p>}

      <h3>{title}</h3>

      {details.length > 0 && (
        <div className="event-detail-list">
          {details.map((detail) => (
            <span key={detail}>{detail}</span>
          ))}
        </div>
      )}

      {description && <p>{description}</p>}

      <div className="community-card-actions">
        {linkTo && (
          <Link className="secondary-button" to={linkTo}>
            {linkText}
          </Link>
        )}

        {buttonText && (
          <button
            type="button"
            className={buttonClassName}
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </article>
  );
}

export default CommunityCard;