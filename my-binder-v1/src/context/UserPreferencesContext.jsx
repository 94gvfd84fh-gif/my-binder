import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { STORAGE_KEYS } from "../constants/storageKeys";
import {
  getUserPreferences,
  saveUserPreferences,
} from "../services/userPreferenceService";

export const UserPreferencesContext = createContext();

function getStoredItems(key) {
  const saved = localStorage.getItem(key);

  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function getLocalPreferences() {
  return {
    savedEvents: getStoredItems(STORAGE_KEYS.savedEvents),
    savedShops: getStoredItems(STORAGE_KEYS.savedShops),
    followedCollectors: getStoredItems(STORAGE_KEYS.followedCollectors),
  };
}

function saveLocalPreferences(preferences) {
  saveStoredItems(STORAGE_KEYS.savedEvents, preferences.savedEvents);
  saveStoredItems(STORAGE_KEYS.savedShops, preferences.savedShops);
  saveStoredItems(
    STORAGE_KEYS.followedCollectors,
    preferences.followedCollectors
  );
}

function toAppPreferences(preferences) {
  return {
    savedEvents: Array.isArray(preferences?.saved_events)
      ? preferences.saved_events
      : [],
    savedShops: Array.isArray(preferences?.saved_shops)
      ? preferences.saved_shops
      : [],
    followedCollectors: Array.isArray(preferences?.followed_collectors)
      ? preferences.followed_collectors
      : [],
  };
}

function UserPreferencesProvider({ children }) {
  const { user, authLoading } = useContext(AuthContext);
  const [preferences, setPreferences] = useState(getLocalPreferences);
  const [preferencesError, setPreferencesError] = useState("");

  useEffect(() => {
    async function loadPreferences() {
      if (authLoading) return;

      if (!user) {
        setPreferences(getLocalPreferences());
        return;
      }

      setPreferencesError("");

      try {
        const storedPreferences = await getUserPreferences(user.id);

        if (storedPreferences) {
          const appPreferences = toAppPreferences(storedPreferences);
          setPreferences(appPreferences);
          saveLocalPreferences(appPreferences);
          return;
        }

        const localPreferences = getLocalPreferences();
        setPreferences(localPreferences);

        await saveUserPreferences({
          userId: user.id,
          ...localPreferences,
        });
      } catch (error) {
        setPreferencesError(error.message);
        setPreferences(getLocalPreferences());
      }
    }

    loadPreferences();
  }, [user, authLoading]);

  async function persistPreferences(nextPreferences) {
    saveLocalPreferences(nextPreferences);

    if (!user) return;

    try {
      await saveUserPreferences({
        userId: user.id,
        ...nextPreferences,
      });
      setPreferencesError("");
    } catch (error) {
      setPreferencesError(error.message);
    }
  }

  function updatePreferenceList(key, value) {
    const currentItems = preferences[key] || [];
    const nextItems = currentItems.includes(value)
      ? currentItems.filter((item) => item !== value)
      : [...currentItems, value];

    const nextPreferences = {
      ...preferences,
      [key]: nextItems,
    };

    setPreferences(nextPreferences);
    persistPreferences(nextPreferences);
  }

  function toggleSavedEvent(eventId) {
    updatePreferenceList("savedEvents", eventId);
  }

  function toggleSavedStore(storeId) {
    updatePreferenceList("savedShops", storeId);
  }

  function toggleFollowCollector(collectorId) {
    updatePreferenceList("followedCollectors", collectorId);
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        savedEvents: preferences.savedEvents,
        savedShops: preferences.savedShops,
        followedCollectors: preferences.followedCollectors,
        preferencesError,
        toggleSavedEvent,
        toggleSavedStore,
        toggleFollowCollector,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export default UserPreferencesProvider;
