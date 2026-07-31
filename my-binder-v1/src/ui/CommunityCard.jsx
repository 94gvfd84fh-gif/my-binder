import { useState } from "react";
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
  image,
  imageAlt,
  variant = "default",
  badges = [],
  stats = [],
}) {
  const [isViewingImage, setIsViewingImage] = useState(false);
  const visibleBadges = badges.filter(Boolean);
  const visibleStats = stats.filter((stat) => stat?.label || stat?.value);

  return (
    <>
      <article
        className={[
          "community-event-card",
          "community-card-" + variant,
          image ? "has-card-image" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {image && (
          <button
            className="community-card-image"
            type="button"
            onClick={() => setIsViewingImage(true)}
            aria-label={"View " + title + " flyer"}
          >
            <img src={image} alt={imageAlt || title} />
          </button>
        )}

        <div className="community-card-content">
          <div className="community-card-heading">
            <div>
              {label && <p className="page-label">{label}</p>}
              <h3>{title}</h3>
            </div>

            {visibleBadges.length > 0 && (
              <div className="community-card-badges">
                {visibleBadges.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            )}
          </div>

          {description && <p className="community-card-description">{description}</p>}

          {visibleStats.length > 0 && (
            <div className="community-card-stats">
              {visibleStats.map((stat) => (
                <div key={String(stat.label) + "-" + String(stat.value)}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          )}

          {details.length > 0 && (
            <div className="event-detail-list">
              {details
                .filter(Boolean)
                .map((detail) => (
                  <span key={detail}>{detail}</span>
                ))}
            </div>
          )}

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
        </div>
      </article>

      {isViewingImage && (
        <div
          className="image-lightbox"
          role="button"
          tabIndex={0}
          onClick={() => setIsViewingImage(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape" || event.key === "Enter") {
              setIsViewingImage(false);
            }
          }}
        >
          <div className="image-lightbox-inner">
            <button type="button" onClick={() => setIsViewingImage(false)}>
              Close
            </button>
            <img src={image} alt={imageAlt || title} />
          </div>
        </div>
      )}
    </>
  );
}

export default CommunityCard;
