function CommunityCard({
  label,
  title,
  details = [],
  description,
  buttonText,
  buttonClassName = "",
  onButtonClick,
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

      {buttonText && (
        <button
          type="button"
          className={buttonClassName}
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </article>
  );
}

export default CommunityCard;