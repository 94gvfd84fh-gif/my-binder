import { useContext } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import { BinderContext } from "../context/BinderContext";
import PageHeader from "../ui/PageHeader";

import "../styles/publicProfile.css";

const PROFILE_KEY = "pocket-deck-profile";

const defaultProfile = {
  username: "Pocket Deck Collector",
  favoriteTcg: "Pokémon",
  favoriteSet: "Team Rocket Returns",
  location: "Sacramento, CA",
  collectorSince: "2026",
  bio: "Collecting since I was a kid. Always looking for vintage holos.",
  avatar: "",
  featuredCardId: "",
};

function PublicProfile() {
  const { cards } = useContext(CardContext);
  const { binders, BINDER_VISIBILITY, getBinderVisibility } =
    useContext(BinderContext);

  const savedProfile = localStorage.getItem(PROFILE_KEY);
  const collectorProfile = savedProfile
    ? { ...defaultProfile, ...JSON.parse(savedProfile) }
    : defaultProfile;

  function getPrimaryBinder(card) {
    if (card.status === "Wishlist") return "Wishlist";
    if (card.primaryBinder) return card.primaryBinder;
    if (card.binder) return card.binder;

    if (card.gradingCompany && card.gradingCompany !== "Raw") {
      return "Graded Collection";
    }

    return "Main Collection";
  }

  function getExtraBinders(card) {
    return Array.isArray(card.extraBinders) ? card.extraBinders : [];
  }

  function cardBelongsToBinder(card, binderName) {
    if (
      binderName === "Main Collection" ||
      binderName === "Graded Collection" ||
      binderName === "Wishlist"
    ) {
      return getPrimaryBinder(card) === binderName;
    }

    return getExtraBinders(card).includes(binderName);
  }

  function isPublicBinder(binderName) {
    const visibility = getBinderVisibility(binderName);

    return (
      visibility === BINDER_VISIBILITY.PUBLIC ||
      visibility === BINDER_VISIBILITY.TRADE_VISIBLE
    );
  }

  const ownedCards = cards.filter((card) => {
    return getPrimaryBinder(card) !== "Wishlist";
  });

  const cardTypeCounts = ownedCards.reduce((counts, card) => {
    const cardType = card.cardType || "Pokémon";

    return {
      ...counts,
      [cardType]: (counts[cardType] || 0) + 1,
    };
  }, {});

  const collectionMix = Object.entries(cardTypeCounts)
    .map(([type, count]) => {
      return { type, count };
    })
    .sort((a, b) => b.count - a.count);

  const topCardType = collectionMix[0]?.type || "No cards yet";

  const publicBinders = binders
    .filter(isPublicBinder)
    .map((binderName) => {
      const binderCards = cards.filter((card) => {
        return cardBelongsToBinder(card, binderName);
      });

      return {
        name: binderName,
        cardCount: binderCards.length,
        visibility: getBinderVisibility(binderName),
        previewCards: binderCards.slice(0, 3),
      };
    });

  const selectedFeaturedCard = ownedCards.find((card) => {
    return String(card.id) === String(collectorProfile.featuredCardId);
  });

  const featuredCard = selectedFeaturedCard || ownedCards[0];

  return (
    <div>
      <PageHeader
        label="PUBLIC PROFILE"
        title={collectorProfile.username}
        description="A public collector profile preview for Pocket Deck."
      />

      <section className="public-profile-card">
        <div className="public-profile-hero">
          <div className="collector-avatar">
            {collectorProfile.avatar ? (
              <img
                src={collectorProfile.avatar}
                alt={collectorProfile.username}
              />
            ) : (
              <span>{collectorProfile.username.charAt(0)}</span>
            )}
          </div>

          <div>
            <p className="page-label">{collectorProfile.favoriteTcg} COLLECTOR</p>
            <h2>{collectorProfile.username}</h2>
            <p>"{collectorProfile.bio}"</p>
          </div>
        </div>

        <div className="collector-profile-stats">
          <div>
            <span>Collector Since</span>
            <strong>{collectorProfile.collectorSince}</strong>
          </div>

          <div>
            <span>Favorite Set</span>
            <strong>{collectorProfile.favoriteSet}</strong>
          </div>

          <div>
            <span>Top Card Type</span>
            <strong>{topCardType}</strong>
          </div>

          <div>
            <span>Owned Cards</span>
            <strong>{ownedCards.length}</strong>
          </div>

          <div>
            <span>Public Binders</span>
            <strong>{publicBinders.length}</strong>
          </div>
        </div>

        {collectionMix.length > 0 && (
          <div className="public-collection-mix">
            <div className="section-header">
              <div>
                <h3>Collection Mix</h3>
                <p>Card types this collector shares publicly.</p>
              </div>
            </div>

            <div className="public-mix-list">
              {collectionMix.map((item) => (
                <div key={item.type}>
                  <span>{item.type}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {featuredCard && (
          <Link
            className="collector-featured-card"
            to={`/collection/${featuredCard.id}`}
          >
            <div className="collector-featured-image">
              {featuredCard.image ? (
                <img src={featuredCard.image} alt={featuredCard.name} />
              ) : (
                <span>{featuredCard.name}</span>
              )}
            </div>

            <div>
              <span className="page-label">FEATURED CARD</span>
              <h3>{featuredCard.name}</h3>
              <p>{featuredCard.set || "Unknown Set"}</p>
              <strong>{featuredCard.cardType || "Pokémon"}</strong>
            </div>
          </Link>
        )}

        <div className="public-binders-preview">
          <div className="section-header">
            <div>
              <h3>Featured Binders</h3>
              <p>Binders this collector has chosen to share.</p>
            </div>
          </div>

          {publicBinders.length > 0 ? (
            <div className="public-binder-card-grid">
              {publicBinders.map((binder) => (
                <Link
                  key={binder.name}
                  className="public-binder-card"
                  to={`/binder?view=${encodeURIComponent(binder.name)}`}
                >
                  <div className="public-binder-card-header">
                    <span className="public-binder-badge">
                      {binder.visibility}
                    </span>

                    <h3>{binder.name}</h3>
                    <p>{binder.cardCount} cards</p>
                  </div>

                  <div className="public-binder-preview-row">
                    {binder.previewCards.length > 0 ? (
                      binder.previewCards.map((card) => (
                        <div className="public-binder-preview-card" key={card.id}>
                          {card.image ? (
                            <img src={card.image} alt={card.name} />
                          ) : (
                            <span>{card.name}</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="public-binder-empty-preview">
                        No cards yet
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="profile-empty-note">
              <p>No public binders yet.</p>
              <span>This collector has not shared any binders.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PublicProfile;