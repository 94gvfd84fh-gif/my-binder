function CardTile({ card }) {
  return (
    <div className="collection-card">
      <div className="collection-card-image">{card.name}</div>

      <h3>{card.name}</h3>
      <p>{card.set}</p>

      <div className="collection-card-footer">
        <span>${card.value}</span>
        <span>{card.favorite ? "★" : "☆"}</span>
      </div>

      <small>{card.status}</small>
    </div>
  );
}

export default CardTile;