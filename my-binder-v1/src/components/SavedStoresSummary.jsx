import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { localShops } from "../data/communityData";
import { getPublicProfiles } from "../services/profileService";

function getSavedItems(key) {
  const saved = localStorage.getItem(key);

  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function profileToStore(profile) {
  return {
    id: "profile-" + profile.id,
    name: profile.username || "Beacon Store",
    area: profile.location || "Online",
    distance: "Beacon store profile",
    specialties: profile.bio || "Store profile",
    linkTo: "/community/profile/" + profile.id,
  };
}

function SavedStoresSummary() {
  const [storeProfiles, setStoreProfiles] = useState([]);
  const savedStoreIds = getSavedItems(STORAGE_KEYS.savedShops);

  useEffect(() => {
    async function loadStores() {
      try {
        const profiles = await getPublicProfiles();
        const stores = profiles
          .filter((profile) => profile.account_type === "Store")
          .map(profileToStore);

        setStoreProfiles(stores);
      } catch {
        setStoreProfiles([]);
      }
    }

    loadStores();
  }, []);

  const allStores = [...storeProfiles, ...localShops];

  const savedStores = allStores.filter((store) => {
    return savedStoreIds.includes(store.id);
  });

  if (savedStores.length === 0) {
    return null;
  }

  return (
    <section className="saved-events-summary">
      <div className="section-header">
        <div>
          <p className="page-label">COMMUNITY</p>
          <h2>Saved Stores</h2>
          <p>Stores and shops you want to keep nearby.</p>
        </div>

        <Link className="secondary-button" to="/community">
          View Stores
        </Link>
      </div>

      <div className="saved-events-list">
        {savedStores.slice(0, 3).map((store) => (
          <Link
            className="saved-event-row"
            to={store.linkTo || "/community"}
            key={store.id}
          >
            <div>
              <strong>{store.name}</strong>
              <span>{store.area || "Location not set"}</span>
            </div>

            <small>{store.specialties || store.eventType || "Store profile"}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SavedStoresSummary;