import { useContext } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import PageHeader from "../ui/PageHeader";
import "../styles/TradeList.css";

function TradeList() {
  const { cards } = useContext(CardContext);

  const tradeCards = cards.filter((card) => card.status === "For Trade");
  const saleCards = cards.filter((card) => card.status === "For Sale");

  const activeTradeTypes = Array.from(
    new Set(
      [...tradeCards, ...saleCards].map((card) => {
        return card.cardType || "Pokémon";
      })
    )
  );

  function getSalePrice(card) {
    return Number(card.salePrice || 0).toLocaleString();
  }

  return (
    <div>
      <PageHeader
        label="BEACON COLLECT TRADES"
        title="Trade & Sale List"
        description="Cards you are open to trading or selling with other collectors."
      />

      <section className="trade-list-summary">
        <div>
          <span>For Trade</span>
          <strong>{tradeCards.length}</strong>
        </div>

        <div>
          <span>For Sale</span>
          <strong>{saleCards.length}</strong>
        </div>

        <div>
          <span>Card Types</span>
          <strong>{activeTradeTypes.length || 0}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong>Collector Ready</strong>
        </div>
      </section>

      {activeTradeTypes.length > 0 && (
        <section className="trade-type-strip">
          {activeTradeTypes.map((type) => (
            <span key={type}>{type}</span>
          ))}
        </section>
      )}

      <section className="trade-section">
        <div className="section-header">
          <div>
            <h2>For Trade</h2>
            <p>Cards you are willing to move for the right collector trade.</p>
          </div>
        </div>

        {tradeCards.length > 0 ? (
          <div className="trade-grid">
            {tradeCards.map((card) => (
              <Link
                key={card.id}
                className="trade-card"
                to={`/collection/${card.id}`}
              >
                <div className="trade-card-image">
                  {card.image ? (
                    <img src={card.image} alt={card.name} />
                  ) : (
                    <span>{card.name}</span>
                  )}
                </div>

                <div className="trade-card-body">
                  <div className="trade-card-pill-row">
                    <span className="trade-status-pill">Open to Trade</span>
                    <span className="trade-type-pill">
                      {card.cardType || "Pokémon"}
                    </span>
                  </div>

                  <h3>{card.name || "Untitled Card"}</h3>
                  <p>{card.set || "Unknown set"}</p>

                  <div className="trade-card-meta">
                    <span>{card.condition || "Condition not set"}</span>
                    <span>{card.rarity || "Rarity not set"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-trade-note">
            <h3>No trade cards yet</h3>
            <p>Mark cards as For Trade to start building your public trade list.</p>
          </div>
        )}
      </section>

      <section className="trade-section">
        <div className="section-header">
          <div>
            <h2>For Sale</h2>
            <p>Cards you are willing to sell when marketplace tools go live.</p>
          </div>
        </div>

        {saleCards.length > 0 ? (
          <div className="trade-grid">
            {saleCards.map((card) => (
              <Link
                key={card.id}
                className="trade-card sale-card"
                to={`/collection/${card.id}`}
              >
                <div className="trade-card-image">
                  {card.image ? (
                    <img src={card.image} alt={card.name} />
                  ) : (
                    <span>{card.name}</span>
                  )}
                </div>

                <div className="trade-card-body">
                  <div className="trade-card-pill-row">
                    <span className="trade-status-pill sale-pill">For Sale</span>
                    <span className="trade-type-pill">
                      {card.cardType || "Pokémon"}
                    </span>
                  </div>

                  <h3>{card.name || "Untitled Card"}</h3>
                  <p>{card.set || "Unknown set"}</p>

                  <div className="asking-price">
                    <span>Asking Price</span>
                    <strong>${getSalePrice(card)}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-trade-note">
            <h3>No sale cards yet</h3>
            <p>Mark cards as For Sale to prepare collector listings.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default TradeList;