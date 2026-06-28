function TradeRequestModal({ card, collector, onClose }) {
  if (!card || !collector) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal trade-request-modal">
        <div className="modal-header">
          <h2>Request Trade</h2>
          <button onClick={onClose}>X</button>
        </div>

        <div className="trade-request-card">
          <p className="page-label">CARD WANTED</p>
          <h3>{card.name}</h3>
          <p>{card.set || "Unknown set"}</p>
          <strong>{collector.username}</strong>
        </div>

        <textarea
          className="trade-request-message"
          defaultValue={`Hi ${collector.username}, I'm interested in your ${card.name}. Would you be open to a trade?`}
        />

        <button
          className="primary-button trade-request-submit"
          onClick={() => {
            alert("Trade request preview sent. Messaging will be added later.");
            onClose();
          }}
        >
          Send Request
        </button>
      </div>
    </div>
  );
}

export default TradeRequestModal;