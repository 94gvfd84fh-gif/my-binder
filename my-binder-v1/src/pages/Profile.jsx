import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import { BinderContext } from "../context/BinderContext";
import PageHeader from "../ui/PageHeader";
import "../styles/profile.css";

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

function Profile() {
  const { cards, setCards } = useContext(CardContext);
  const {
    binders,
    binderGoals,
    binderVisibility,
    BINDER_VISIBILITY,
    getBinderVisibility,
    replaceBinders,
    replaceBinderGoals,
    replaceBinderVisibility,
  } = useContext(BinderContext);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPreviewingPublicProfile, setIsPreviewingPublicProfile] =
    useState(false);

  const [collectorProfile, setCollectorProfile] = useState(() => {
    const savedProfile = localStorage.getItem(PROFILE_KEY);

    if (savedProfile) {
      try {
        return {
          ...defaultProfile,
          ...JSON.parse(savedProfile),
        };
      } catch {
        return defaultProfile;
      }
    }

    return defaultProfile;
  });

  function getPrimaryBinder(card) {
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

  const wishlistCards = cards.filter((card) => {
    return getPrimaryBinder(card) === "Wishlist";
  });

  const totalCards = ownedCards.length;

  const totalValue = ownedCards.reduce((total, card) => {
    return total + Number(card.value || 0);
  }, 0);

  const favoriteCards = ownedCards.filter((card) => card.favorite).length;

  const tradeCards = ownedCards.filter((card) => {
    return (
      card.status === "For Trade" ||
      getExtraBinders(card).includes("Trade Binder")
    );
  }).length;

  const gradedCards = ownedCards.filter((card) => {
    return card.gradingCompany && card.gradingCompany !== "Raw";
  }).length;

  const selectedFeaturedCard = ownedCards.find((card) => {
    return String(card.id) === String(collectorProfile.featuredCardId);
  });

  const favoriteFeaturedCard = ownedCards.find((card) => card.favorite);

  const newestOwnedCard = [...ownedCards].sort((a, b) => {
    return Number(b.id) - Number(a.id);
  })[0];

  const displayedFeaturedCard =
    selectedFeaturedCard || favoriteFeaturedCard || newestOwnedCard;

  const publicBinders = binders
    .filter(isPublicBinder)
    .map((binderName) => {
      const cardCount = cards.filter((card) => {
        return cardBelongsToBinder(card, binderName);
      }).length;

      return {
        name: binderName,
        cardCount,
        visibility: getBinderVisibility(binderName),
      };
    });

  function updateProfile(field, value) {
    setCollectorProfile((currentProfile) => {
      const updatedProfile = {
        ...currentProfile,
        [field]: value,
      };

      localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }

  function replaceCollectorProfile(importedProfile) {
    if (!importedProfile || typeof importedProfile !== "object") {
      return;
    }

    const updatedProfile = {
      ...defaultProfile,
      ...importedProfile,
    };

    setCollectorProfile(updatedProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
  }

  function handleAvatarUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      updateProfile("avatar", reader.result);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removeAvatar() {
    updateProfile("avatar", "");
  }

  function exportCollection() {
    const backup = {
      app: "Pocket Deck",
      backupVersion: 4,
      exportedAt: new Date().toISOString(),
      cards,
      binders,
      binderGoals,
      binderVisibility,
      collectorProfile,
    };

    const data = JSON.stringify(backup, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "pocket-deck-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function importCollection(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      try {
        const importedBackup = JSON.parse(reader.result);

        const isOldCardBackup = Array.isArray(importedBackup);
        const importedCards = isOldCardBackup
          ? importedBackup
          : importedBackup.cards;

        if (!Array.isArray(importedCards)) {
          alert("Invalid backup file.");
          return;
        }

        const confirmImport = confirm(
          "This will replace your current Pocket Deck data with the imported backup. Continue?"
        );

        if (!confirmImport) return;

        setCards(importedCards);

        if (!isOldCardBackup) {
          replaceBinders(importedBackup.binders);
          replaceBinderGoals(importedBackup.binderGoals);
          replaceBinderVisibility(importedBackup.binderVisibility);
          replaceCollectorProfile(importedBackup.collectorProfile);
        }

        alert("Pocket Deck backup imported successfully.");
      } catch {
        alert("Could not import this file.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div>
      <PageHeader
        label="POCKET DECK PROFILE"
        title="Collector Profile"
        description="Build your collector identity before Pocket Deck becomes social."
      />

      <section className="collector-profile-card">
        <div className="collector-profile-top">
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
            <p className="page-label">COLLECTOR</p>
            <h2>{collectorProfile.username}</h2>
            <p>{collectorProfile.favoriteTcg} Collector</p>
          </div>

          <div className="profile-action-row">
            <Link className="secondary-button" to="/u/collector">
              View Public Profile
            </Link>

            <button
              className="secondary-button"
              onClick={() => {
                setIsPreviewingPublicProfile(!isPreviewingPublicProfile);
                setIsEditingProfile(false);
              }}
            >
              {isPreviewingPublicProfile ? "Back to My View" : "Public Preview"}
            </button>

            {!isPreviewingPublicProfile && (
              <button
                className="primary-button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? "Done" : "Edit Profile"}
              </button>
            )}
          </div>
        </div>

        {isPreviewingPublicProfile && (
          <div className="public-preview-banner">
            This is how your profile will look to other collectors.
          </div>
        )}

        <p className="collector-bio">"{collectorProfile.bio}"</p>

        <div className="collector-profile-stats">
          <div>
            <span>Collector Since</span>
            <strong>{collectorProfile.collectorSince}</strong>
          </div>

          <div>
            <span>Favorite Set</span>
            <strong>{collectorProfile.favoriteSet}</strong>
          </div>

          {!isPreviewingPublicProfile && (
            <div>
              <span>Location · Private</span>
              <strong>{collectorProfile.location}</strong>
            </div>
          )}

          <div>
            <span>Owned Collection</span>
            <strong>{totalCards} Cards</strong>
          </div>

          {!isPreviewingPublicProfile && (
            <div>
              <span>Estimated Value · Private</span>
              <strong>${totalValue.toLocaleString()}</strong>
            </div>
          )}

          <div>
            <span>Favorites</span>
            <strong>{favoriteCards}</strong>
          </div>

          <div>
            <span>Wishlist</span>
            <strong>{wishlistCards.length} Cards</strong>
          </div>

          <div>
            <span>For Trade</span>
            <strong>{tradeCards} Cards</strong>
          </div>

          <div>
            <span>Graded</span>
            <strong>{gradedCards} Cards</strong>
          </div>
        </div>

        <div className="collector-social-stats">
          <div>
            <strong>0</strong>
            <span>Followers</span>
          </div>

          <div>
            <strong>0</strong>
            <span>Following</span>
          </div>

          <div>
            <strong>New Collector</strong>
            <span>Trade Rating</span>
          </div>
        </div>

        {displayedFeaturedCard && (
          <div className="collector-top-card">
            <span>Featured Card</span>
            <strong>{displayedFeaturedCard.name}</strong>
          </div>
        )}

        <div className="public-binders-preview">
          <div className="section-header">
            <div>
              <h3>Public Binders</h3>
              <p>Only binders marked Public or Trade Visible appear here.</p>
            </div>
          </div>

          {publicBinders.length > 0 ? (
            <div className="public-binder-list">
              {publicBinders.map((binder) => (
                <Link key={binder.name} to="/binder">
                  {binder.name} · {binder.cardCount} cards · {binder.visibility}
                </Link>
              ))}
            </div>
          ) : (
            <div className="profile-empty-note">
              <p>No public binders yet.</p>
              <span>Set binder visibility from the Binders page.</span>
            </div>
          )}
        </div>

        {isEditingProfile && !isPreviewingPublicProfile && (
          <div className="collector-profile-editor">
            <div className="editor-section-header">
              <div>
                <p className="page-label">EDIT PROFILE</p>
                <h3>Collector Identity</h3>
              </div>
            </div>

            <div className="profile-editor-grid">
              <label>
                <span>Username</span>
                <input
                  placeholder="Username"
                  value={collectorProfile.username}
                  onChange={(event) =>
                    updateProfile("username", event.target.value)
                  }
                />
              </label>

              <label>
                <span>Favorite TCG</span>
                <input
                  placeholder="Favorite TCG"
                  value={collectorProfile.favoriteTcg}
                  onChange={(event) =>
                    updateProfile("favoriteTcg", event.target.value)
                  }
                />
              </label>

              <label>
                <span>Favorite Set</span>
                <input
                  placeholder="Favorite Set"
                  value={collectorProfile.favoriteSet}
                  onChange={(event) =>
                    updateProfile("favoriteSet", event.target.value)
                  }
                />
              </label>

              <label>
                <span>Featured Card</span>
                <select
                  value={collectorProfile.featuredCardId}
                  onChange={(event) =>
                    updateProfile("featuredCardId", event.target.value)
                  }
                >
                  <option value="">Auto-select featured card</option>

                  {ownedCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.name} - {card.set || "Unknown set"}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Location</span>
                <input
                  placeholder="Location"
                  value={collectorProfile.location}
                  onChange={(event) =>
                    updateProfile("location", event.target.value)
                  }
                />
              </label>

              <label>
                <span>Collector Since</span>
                <input
                  placeholder="Collector Since"
                  value={collectorProfile.collectorSince}
                  onChange={(event) =>
                    updateProfile("collectorSince", event.target.value)
                  }
                />
              </label>

              <label className="profile-editor-wide">
                <span>Bio</span>
                <textarea
                  placeholder="Bio"
                  value={collectorProfile.bio}
                  onChange={(event) => updateProfile("bio", event.target.value)}
                />
              </label>

              <div className="profile-editor-wide avatar-actions">
                <span>Profile Picture</span>

                <label className="secondary-button">
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>

                {collectorProfile.avatar && (
                  <button type="button" onClick={removeAvatar}>
                    Remove Profile Picture
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {!isPreviewingPublicProfile && (
        <div className="profile-grid">
          <section className="profile-card">
            <p className="page-label">BACKUP</p>
            <h2>Export Pocket Deck</h2>
            <p>
              Download your cards, binders, goals, profile, and visibility
              settings.
            </p>

            <button className="primary-button" onClick={exportCollection}>
              Export Backup
            </button>
          </section>

          <section className="profile-card">
            <p className="page-label">RESTORE</p>
            <h2>Import Pocket Deck</h2>
            <p>
              Restore your cards, binders, goals, profile, and visibility
              settings.
            </p>

            <label className="primary-button">
              Import Backup
              <input
                type="file"
                accept="application/json"
                onChange={importCollection}
              />
            </label>
          </section>
        </div>
      )}
    </div>
  );
}

export default Profile;