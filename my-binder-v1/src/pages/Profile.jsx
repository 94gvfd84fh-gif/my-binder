import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import PageHeader from "../ui/PageHeader";

const PROFILE_KEY = "pocket-deck-profile";

const defaultProfile = {
  username: "Pocket Deck Collector",
  favoriteTcg: "Pokémon",
  favoriteSet: "Team Rocket Returns",
  location: "Sacramento, CA",
  collectorSince: "2026",
  bio: "Collecting since I was a kid. Always looking for vintage holos.",
  avatar: "",
};

function Profile() {
  const { cards, setCards } = useContext(CardContext);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPreviewingPublicProfile, setIsPreviewingPublicProfile] =
    useState(false);

  const [collectorProfile, setCollectorProfile] = useState(() => {
    const savedProfile = localStorage.getItem(PROFILE_KEY);

    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch {
        return defaultProfile;
      }
    }

    return defaultProfile;
  });

  const totalCards = cards.length;

  const totalValue = cards.reduce((total, card) => {
    return total + Number(card.value || 0);
  }, 0);

  const favoriteCards = cards.filter((card) => card.favorite).length;

  const highestValueCard = [...cards].sort((a, b) => {
    return Number(b.value || 0) - Number(a.value || 0);
  })[0];

  const publicBinders = [
    "Main Collection",
    "Showcase Binder",
    "Trade Binder",
  ].map((binderName) => {
    const cardCount = cards.filter((card) => {
      return (card.binder || "Main Collection") === binderName;
    }).length;

    return {
      name: binderName,
      cardCount,
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
    const data = JSON.stringify(cards, null, 2);
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
        const importedCards = JSON.parse(reader.result);

        if (!Array.isArray(importedCards)) {
          alert("Invalid backup file.");
          return;
        }

        const confirmImport = confirm(
          "This will replace your current collection with the imported backup. Continue?"
        );

        if (!confirmImport) return;

        setCards(importedCards);
        alert("Collection imported successfully.");
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
              <img src={collectorProfile.avatar} alt={collectorProfile.username} />
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
            <span>Collection</span>
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

        {highestValueCard && (
          <div className="collector-top-card">
            <span>
              {isPreviewingPublicProfile ? "Featured Card" : "Highest Value Card"}
            </span>
            <strong>{highestValueCard.name}</strong>
          </div>
        )}

        <div className="public-binders-preview">
          <div className="section-header">
            <div>
              <h3>Public Binders</h3>
              <p>Binders other collectors will be able to view.</p>
            </div>
          </div>

          <div className="public-binder-list">
            {publicBinders.map((binder) => (
              <Link key={binder.name} to="/binder">
                {binder.name} · {binder.cardCount} cards
              </Link>
            ))}
          </div>
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
                  onChange={(event) => updateProfile("username", event.target.value)}
                />
              </label>

              <label>
                <span>Favorite TCG</span>
                <input
                  placeholder="Favorite TCG"
                  value={collectorProfile.favoriteTcg}
                  onChange={(event) => updateProfile("favoriteTcg", event.target.value)}
                />
              </label>

              <label>
                <span>Favorite Set</span>
                <input
                  placeholder="Favorite Set"
                  value={collectorProfile.favoriteSet}
                  onChange={(event) => updateProfile("favoriteSet", event.target.value)}
                />
              </label>

              <label>
                <span>Location</span>
                <input
                  placeholder="Location"
                  value={collectorProfile.location}
                  onChange={(event) => updateProfile("location", event.target.value)}
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
                <input type="file" accept="image/*" onChange={handleAvatarUpload} />

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
            <h2>Export Collection</h2>
            <p>Download your Pocket Deck collection as a JSON backup file.</p>
            <button className="primary-button" onClick={exportCollection}>
              Export Backup
            </button>
          </section>

          <section className="profile-card">
            <p className="page-label">RESTORE</p>
            <h2>Import Collection</h2>
            <p>Restore your cards from a Pocket Deck backup file.</p>
            <input
              type="file"
              accept="application/json"
              onChange={importCollection}
            />
          </section>
        </div>
      )}
    </div>
  );
}

export default Profile;