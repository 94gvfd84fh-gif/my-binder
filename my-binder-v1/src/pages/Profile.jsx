import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../context/CardContext";
import { BinderContext } from "../context/BinderContext";
import { AuthContext } from "../context/AuthContext";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from "../constants/storageKeys";
import { getProfile, saveProfile } from "../services/profileService";
import StoreEvents from "../components/StoreEvents";
import PageHeader from "../ui/PageHeader";
import "../styles/profile.css";

const defaultProfile = {
  username: "Beacon Collector",
  accountType: "Collector",
  favoriteTcg: "Pokémon",
  favoriteSet: "Team Rocket Returns",
  location: "Sacramento, CA",
  collectorSince: "2026",
  bio: "Collecting since I was a kid. Always looking for vintage holos.",
  avatar: "",
  featuredCardId: "",
  profileTheme: "Beacon Dark",
  profileAccentColor: "#2563EB",
  profileBanner: "",
  profileLayout: "Classic",
  profileTagline: "",
  profileTileColors: {},
  profileTileTextColors: {},
};

function toAppProfile(profile) {
  if (!profile) {
    return defaultProfile;
  }

  return {
    ...defaultProfile,
    username: profile.username || defaultProfile.username,
    accountType: profile.account_type || profile.accountType || "Collector",
    favoriteTcg: profile.favorite_tcg || defaultProfile.favoriteTcg,
    favoriteSet: profile.favorite_set || defaultProfile.favoriteSet,
    location: profile.location || defaultProfile.location,
    collectorSince: profile.collector_since || defaultProfile.collectorSince,
    bio: profile.bio || defaultProfile.bio,
    avatar: profile.avatar || "",
    featuredCardId: profile.featured_card_id || "",
    profileTheme: profile.profile_theme || profile.profileTheme || defaultProfile.profileTheme,
    profileAccentColor:
      profile.profile_accent_color ||
      profile.profileAccentColor ||
      defaultProfile.profileAccentColor,
    profileBanner: profile.profile_banner || profile.profileBanner || "",
    profileLayout: profile.profile_layout || profile.profileLayout || defaultProfile.profileLayout,
    profileTagline: profile.profile_tagline || profile.profileTagline || "",
    profileTileColors:
      profile.profileTileColors ||
      profile.profile_tile_colors ||
      defaultProfile.profileTileColors,
    profileTileTextColors:
      profile.profileTileTextColors ||
      profile.profile_tile_text_colors ||
      defaultProfile.profileTileTextColors,
  };
}

function toDatabaseProfile(profile, userId) {
  return {
    id: userId,
    username: profile.username || defaultProfile.username,
    account_type: profile.accountType || "Collector",
    favorite_tcg: profile.favoriteTcg || "",
    favorite_set: profile.favoriteSet || "",
    location: profile.location || "",
    collector_since: profile.collectorSince || "",
    bio: profile.bio || "",
    avatar: profile.avatar || "",
    featured_card_id: profile.featuredCardId || "",
    profile_theme: profile.profileTheme || defaultProfile.profileTheme,
    profile_accent_color:
      profile.profileAccentColor || defaultProfile.profileAccentColor,
    profile_banner: profile.profileBanner || "",
    profile_layout: profile.profileLayout || defaultProfile.profileLayout,
    profile_tagline: profile.profileTagline || "",
    profile_tile_colors: profile.profileTileColors || {},
    profile_tile_text_colors: profile.profileTileTextColors || {},
    updated_at: new Date().toISOString(),
  };
}

function getStoredProfile() {
  const savedProfile =
    localStorage.getItem(STORAGE_KEYS.profile) ||
    localStorage.getItem(LEGACY_STORAGE_KEYS.profile);

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
}

function Profile() {
  const { user } = useContext(AuthContext);
  const { cards, replaceCards } = useContext(CardContext);
  const { followedCollectors } = useContext(UserPreferencesContext);
  const {
    binders,
    binderGoals,
    binderVisibility,
    binderColors,
    BINDER_VISIBILITY,
    getBinderVisibility,
    replaceBinders,
    replaceBinderGoals,
    replaceBinderVisibility,
    replaceBinderColors,
  } = useContext(BinderContext);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPreviewingPublicProfile, setIsPreviewingPublicProfile] =
    useState(false);
  const [collectorProfile, setCollectorProfile] = useState(getStoredProfile);
  const [profileMessage, setProfileMessage] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const isStoreAccount = collectorProfile.accountType === "Store";
  const accountLabel = isStoreAccount ? "STORE ACCOUNT" : "COLLECTOR ACCOUNT";

  useEffect(() => {
    async function loadSupabaseProfile() {
      if (!user) return;

      try {
        const supabaseProfile = await getProfile(user.id);

        if (supabaseProfile) {
          const appProfile = {
            ...toAppProfile(supabaseProfile),
            profileTileColors:
              getStoredProfile().profileTileColors || defaultProfile.profileTileColors,
            profileTileTextColors:
              getStoredProfile().profileTileTextColors ||
              defaultProfile.profileTileTextColors,
          };
          setCollectorProfile(appProfile);
          localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(appProfile));
          return;
        }

        await saveProfile(toDatabaseProfile(collectorProfile, user.id));
        setProfileMessage("Your profile is saved to your account.");
      } catch (error) {
        setProfileMessage(error.message);
      }
    }

    loadSupabaseProfile();
  }, [user]);

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

  const selectedFeaturedCard = ownedCards.find((card) => {
    return String(card.id) === String(collectorProfile.featuredCardId);
  });

  const favoriteFeaturedCard = ownedCards.find((card) => card.favorite);

  const newestOwnedCard = [...ownedCards].sort((a, b) => {
    return Number(b.id) - Number(a.id);
  })[0];

  const displayedFeaturedCard =
    selectedFeaturedCard || favoriteFeaturedCard || newestOwnedCard;

  const profileTileControls = [
    { key: "accountType", label: "Account Type" },
    { key: "collectorSince", label: isStoreAccount ? "Store Since" : "Collector Since" },
    { key: "favoriteSet", label: isStoreAccount ? "Main Focus" : "Favorite Set" },
    { key: "topCardType", label: isStoreAccount ? "Shop Category" : "Top Card Type" },
    { key: "location", label: "Location" },
    { key: "ownedCollection", label: "Owned Collection" },
    { key: "estimatedValue", label: "Estimated Value" },
    { key: "favorites", label: "Favorites" },
    { key: "wishlist", label: "Wishlist" },
    { key: "forTrade", label: "For Trade" },
    { key: "graded", label: "Graded" },
    { key: "followers", label: "Followers" },
    { key: "following", label: "Following" },
    { key: "accountStatus", label: isStoreAccount ? "Account Status" : "Trade Rating" },
  ];

  function getProfileTileStyle(tileKey) {
    const tileColor = collectorProfile.profileTileColors?.[tileKey];
    const textColor = collectorProfile.profileTileTextColors?.[tileKey];

    if (!tileColor && !textColor) {
      return undefined;
    }

    return {
      ...(tileColor ? { "--profile-tile-color": tileColor } : {}),
      ...(textColor ? { "--profile-tile-text-color": textColor } : {}),
    };
  }

  function updateProfileTileColor(tileKey, color) {
    updateProfile("profileTileColors", {
      ...(collectorProfile.profileTileColors || {}),
      [tileKey]: color,
    });
  }

  function updateProfileTileTextColor(tileKey, color) {
    updateProfile("profileTileTextColors", {
      ...(collectorProfile.profileTileTextColors || {}),
      [tileKey]: color,
    });
  }

  const publicBinders = binders.filter(isPublicBinder).map((binderName) => {
    const cardCount = cards.filter((card) => {
      return cardBelongsToBinder(card, binderName);
    }).length;

    return {
      name: binderName,
      cardCount,
      visibility: getBinderVisibility(binderName),
    };
  });

  async function persistProfile(updatedProfile) {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updatedProfile));

    if (!user) return;

    setIsSavingProfile(true);
    setProfileMessage("");

    try {
      await saveProfile(toDatabaseProfile(updatedProfile, user.id));
      setProfileMessage("Profile saved.");
    } catch (error) {
      setProfileMessage(error.message);
    }

    setIsSavingProfile(false);
  }

  function updateProfile(field, value) {
    setCollectorProfile((currentProfile) => {
      const updatedProfile = {
        ...currentProfile,
        [field]: value,
      };

      persistProfile(updatedProfile);
      return updatedProfile;
    });
  }

  function replaceCollectorProfile(importedProfile) {
    if (!importedProfile || typeof importedProfile !== "object") return;

    const updatedProfile = {
      ...defaultProfile,
      ...importedProfile,
      accountType:
        importedProfile.accountType ||
        importedProfile.account_type ||
        defaultProfile.accountType,
    };

    setCollectorProfile(updatedProfile);
    persistProfile(updatedProfile);
  }

  function handleAvatarUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function () {
      updateProfile("avatar", reader.result);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removeAvatar() {
    updateProfile("avatar", "");
  }

  function handleBannerUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function () {
      updateProfile("profileBanner", reader.result);
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removeBanner() {
    updateProfile("profileBanner", "");
  }

  function exportCollection() {
    const backup = {
      app: "Beacon Collect",
      backupVersion: 5,
      exportedAt: new Date().toISOString(),
      cards,
      binders,
      binderGoals,
      binderVisibility,
      binderColors,
      collectorProfile,
    };

    const data = JSON.stringify(backup, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "beacon-collect-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function importCollection(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async function () {
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
          "This will replace your current Beacon Collect data with the imported backup. Continue?"
        );

        if (!confirmImport) return;

        const cardsImported = await replaceCards(importedCards);

        if (!cardsImported) {
          alert("Could not import cards into your account.");
          return;
        }

        if (!isOldCardBackup) {
          replaceBinders(importedBackup.binders);
          replaceBinderGoals(importedBackup.binderGoals);
          replaceBinderVisibility(importedBackup.binderVisibility);
          replaceBinderColors(importedBackup.binderColors);
          replaceCollectorProfile(importedBackup.collectorProfile);
        }

        alert("Beacon Collect backup imported successfully.");
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
        label="BEACON COLLECT PROFILE"
        title={isStoreAccount ? "Store Profile" : "Collector Profile"}
        description={
          isStoreAccount
            ? "Manage your store identity, public presence, and posted events."
            : "Manage your collector identity, public profile, and collection summary."
        }
      />

      {profileMessage && <p className="auth-message">{profileMessage}</p>}

      <section
        className={`collector-profile-card themed-profile-card theme-${collectorProfile.profileTheme
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`}
        style={{ "--profile-accent": collectorProfile.profileAccentColor }}
      >
        {collectorProfile.profileBanner && (
          <div
            className="profile-banner-preview"
            style={{ backgroundImage: `url(${collectorProfile.profileBanner})` }}
          >
            <img src={collectorProfile.profileBanner} alt="Profile banner" />
          </div>
        )}

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
            <p className="page-label">{accountLabel}</p>
            <h2>{collectorProfile.username}</h2>
            {collectorProfile.profileTagline && (
              <p className="profile-tagline">{collectorProfile.profileTagline}</p>
            )}
            <p>
              {isStoreAccount
                ? "Shop, event host, or collector business"
                : `${collectorProfile.favoriteTcg} Collector`}
            </p>
          </div>

          <div className="profile-action-row">
            <Link className="secondary-button" to="/u/collector">
              View Public Profile
            </Link>

            <button
              className="secondary-button"
              type="button"
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
                type="button"
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

        {isSavingProfile && (
          <div className="public-preview-banner">Saving profile...</div>
        )}

        <p className="collector-bio">"{collectorProfile.bio}"</p>

        <div className="collector-profile-stats">
          <div style={getProfileTileStyle("accountType")}>
            <span>Account Type</span>
            <strong>{collectorProfile.accountType}</strong>
          </div>

          <div style={getProfileTileStyle("collectorSince")}>
            <span>{isStoreAccount ? "Store Since" : "Collector Since"}</span>
            <strong>{collectorProfile.collectorSince}</strong>
          </div>

          <div style={getProfileTileStyle("favoriteSet")}>
            <span>{isStoreAccount ? "Main Focus" : "Favorite Set"}</span>
            <strong>{collectorProfile.favoriteSet}</strong>
          </div>

          <div style={getProfileTileStyle("topCardType")}>
            <span>{isStoreAccount ? "Shop Category" : "Top Card Type"}</span>
            <strong>{topCardType}</strong>
          </div>

          {!isPreviewingPublicProfile && (
            <div style={getProfileTileStyle("location")}>
              <span>Location · Private</span>
              <strong>{collectorProfile.location}</strong>
            </div>
          )}

          <div style={getProfileTileStyle("ownedCollection")}>
            <span>Owned Collection</span>
            <strong>{totalCards} Cards</strong>
          </div>

          {!isPreviewingPublicProfile && (
            <div style={getProfileTileStyle("estimatedValue")}>
              <span>Estimated Value · Private</span>
              <strong>${totalValue.toLocaleString()}</strong>
            </div>
          )}

          <div style={getProfileTileStyle("favorites")}>
            <span>Favorites</span>
            <strong>{favoriteCards}</strong>
          </div>

          <div style={getProfileTileStyle("wishlist")}>
            <span>Wishlist</span>
            <strong>{wishlistCards.length} Cards</strong>
          </div>

          <div style={getProfileTileStyle("forTrade")}>
            <span>For Trade</span>
            <strong>{tradeCards} Cards</strong>
          </div>

          <div style={getProfileTileStyle("graded")}>
            <span>Graded</span>
            <strong>{gradedCards} Cards</strong>
          </div>
        </div>

        {isStoreAccount && !isPreviewingPublicProfile && (
          <div className="profile-empty-note store-profile-note">
            <p>Store tools are enabled.</p>
            <span>
              You can post trade nights, card shows, shop events, and flyers
              below. Collector accounts will not see these posting tools.
            </span>
          </div>
        )}

        {collectionMix.length > 0 && (
          <div className="profile-collection-mix">
            <div className="section-header">
              <div>
                <h3>{isStoreAccount ? "Store Inventory Mix" : "Collection Mix"}</h3>
                <p>
                  {isStoreAccount
                    ? "A quick read on what your store account has listed."
                    : "Your collection across card types."}
                </p>
              </div>
            </div>

            <div className="profile-mix-list">
              {collectionMix.map((item) => (
                <div key={item.type}>
                  <span>{item.type}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="collector-social-stats">
          <div style={getProfileTileStyle("followers")}>
            <strong>0</strong>
            <span>Followers</span>
          </div>

          <div style={getProfileTileStyle("following")}>
            <strong>{followedCollectors.length}</strong>
            <span>Following</span>
          </div>

          <div style={getProfileTileStyle("accountStatus")}>
            <strong>{isStoreAccount ? "Store Account" : "New Collector"}</strong>
            <span>{isStoreAccount ? "Account Status" : "Trade Rating"}</span>
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
                <h3>{isStoreAccount ? "Store Identity" : "Collector Identity"}</h3>
              </div>
            </div>

            <div className="profile-editor-grid">
              <label>
                <span>Account Type</span>
                <select
                  value={collectorProfile.accountType}
                  onChange={(event) =>
                    updateProfile("accountType", event.target.value)
                  }
                >
                  <option>Collector</option>
                  <option>Store</option>
                </select>
              </label>

              <label>
                <span>{isStoreAccount ? "Store Name" : "Username"}</span>
                <input
                  placeholder={isStoreAccount ? "Store name" : "Username"}
                  value={collectorProfile.username}
                  onChange={(event) =>
                    updateProfile("username", event.target.value)
                  }
                />
              </label>

              <label>
                <span>{isStoreAccount ? "Store Focus" : "Favorite TCG"}</span>
                <input
                  placeholder={
                    isStoreAccount
                      ? "Pokemon, sports cards, One Piece..."
                      : "Favorite TCG"
                  }
                  value={collectorProfile.favoriteTcg}
                  onChange={(event) =>
                    updateProfile("favoriteTcg", event.target.value)
                  }
                />
              </label>

              <label>
                <span>{isStoreAccount ? "Main Specialty" : "Favorite Set"}</span>
                <input
                  placeholder={
                    isStoreAccount ? "Vintage, slabs, wax, trades..." : "Favorite Set"
                  }
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
                <span>{isStoreAccount ? "Store Location" : "Location"}</span>
                <input
                  placeholder={isStoreAccount ? "City, State" : "Location"}
                  value={collectorProfile.location}
                  onChange={(event) =>
                    updateProfile("location", event.target.value)
                  }
                />
              </label>

              <label>
                <span>{isStoreAccount ? "Store Since" : "Collector Since"}</span>
                <input
                  placeholder={isStoreAccount ? "Store Since" : "Collector Since"}
                  value={collectorProfile.collectorSince}
                  onChange={(event) =>
                    updateProfile("collectorSince", event.target.value)
                  }
                />
              </label>

              <label className="profile-editor-wide">
                <span>{isStoreAccount ? "About Your Store" : "Bio"}</span>
                <textarea
                  placeholder={
                    isStoreAccount
                      ? "Tell collectors about your shop, events, specialties, and community..."
                      : "Tell collectors what you collect..."
                  }
                  value={collectorProfile.bio}
                  onChange={(event) => updateProfile("bio", event.target.value)}
                />
              </label>

              <div className="profile-style-panel profile-editor-wide">
                <div className="editor-section-header">
                  <div>
                    <p className="page-label">PROFILE STYLE</p>
                    <h3>Make It Yours</h3>
                  </div>
                </div>

                <div className="profile-editor-grid compact-profile-grid">
                  <label>
                    <span>Theme</span>
                    <select
                      value={collectorProfile.profileTheme}
                      onChange={(event) =>
                        updateProfile("profileTheme", event.target.value)
                      }
                    >
                      <option>Beacon Dark</option>
                      <option>Showcase Blue</option>
                      <option>Collector Gold</option>
                      <option>Neon Cyan</option>
                      <option>Card Shop</option>
                      <option>Vintage Vault</option>
                    </select>
                  </label>

                  <label>
                    <span>Accent Color</span>
                    <input
                      type="color"
                      value={collectorProfile.profileAccentColor}
                      onChange={(event) =>
                        updateProfile("profileAccentColor", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    <span>Layout</span>
                    <select
                      value={collectorProfile.profileLayout}
                      onChange={(event) =>
                        updateProfile("profileLayout", event.target.value)
                      }
                    >
                      <option>Classic</option>
                      <option>Showcase</option>
                      <option>Compact</option>
                      <option>Gallery</option>
                    </select>
                  </label>

                  <label>
                    <span>Profile Tagline</span>
                    <input
                      placeholder="Vintage holos, slabs, and trade nights."
                      value={collectorProfile.profileTagline}
                      onChange={(event) =>
                        updateProfile("profileTagline", event.target.value)
                      }
                    />
                  </label>
                </div>

                {collectorProfile.profileTheme === "Card Shop" && (
                  <div className="profile-tile-color-panel">
                    <div>
                      <p className="page-label">CARD SHOP TILE COLORS</p>
                      <h4>Color Each Display Tile</h4>
                      <p>Change only one profile plaque at a time, like Account Type, Favorites, Wishlist, and more.</p>
                    </div>

                    <div className="profile-tile-color-grid">
                      {profileTileControls.map((tile) => (
                        <div className="profile-tile-color-row" key={tile.key}>
                          <div className="profile-tile-color-name">
                            <span>{tile.label}</span>
                          </div>

                          <div className="profile-color-control">
                            <label htmlFor={`tile-color-${tile.key}`}>Tile</label>
                            <input
                              id={`tile-color-${tile.key}`}
                              type="color"
                              value={
                                collectorProfile.profileTileColors?.[tile.key] ||
                                collectorProfile.profileAccentColor
                              }
                              onChange={(event) =>
                                updateProfileTileColor(tile.key, event.target.value)
                              }
                            />
                          </div>

                          <div className="profile-color-control">
                            <label htmlFor={`tile-text-color-${tile.key}`}>Text</label>
                            <input
                              id={`tile-text-color-${tile.key}`}
                              type="color"
                              value={
                                collectorProfile.profileTileTextColors?.[tile.key] ||
                                "#211005"
                              }
                              onChange={(event) =>
                                updateProfileTileTextColor(
                                  tile.key,
                                  event.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="profile-style-preview" aria-hidden="true">
                  <div className="style-preview-banner"></div>
                  <div>
                    <span>{collectorProfile.profileTheme}</span>
                    <strong>{collectorProfile.profileLayout}</strong>
                    <p>{collectorProfile.profileTagline || "Your collector style preview"}</p>
                  </div>
                </div>

                <div className="avatar-actions banner-actions">
                  <span>Profile Banner</span>

                  <label className="secondary-button">
                    Upload Banner
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                    />
                  </label>

                  {collectorProfile.profileBanner && (
                    <button type="button" onClick={removeBanner}>
                      Remove Banner
                    </button>
                  )}
                </div>
              </div>

              <div className="profile-editor-wide avatar-actions">
                <span>
                  {isStoreAccount ? "Store Logo / Picture" : "Profile Picture"}
                </span>

                <label className="secondary-button">
                  Upload Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>

                {collectorProfile.avatar && (
                  <button type="button" onClick={removeAvatar}>
                    Remove Picture
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {isStoreAccount && !isPreviewingPublicProfile && <StoreEvents />}

      {!isPreviewingPublicProfile && (
        <div className="profile-grid">
          <section className="profile-card">
            <p className="page-label">BACKUP</p>
            <h2>Export Beacon Collect</h2>
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
            <h2>Import Beacon Collect</h2>
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