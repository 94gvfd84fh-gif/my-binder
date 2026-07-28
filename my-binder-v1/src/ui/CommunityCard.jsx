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
}) {
  const [isViewingImage, setIsViewingImage] = useState(false);

  return (
    <>
      <article className={image ? "community-event-card has-card-image" : "community-event-card"}>
        {image && (
          <button
            className="community-card-image"
            type="button"
            onClick={() => setIsViewingImage(true)}
            aria-label={`View ${title} flyer`}
          >
            <img src={image} alt={imageAlt || title} />
          </button>
        )}

        <div className="community-card-content">
          {label && <p className="page-label">{label}</p>}

          <h3>{title}</h3>

          {details.length > 0 && (
            <div className="event-detail-list">
              {details
                .filter(Boolean)
                .map((detail) => (
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