import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  getBinderSettings,
  saveBinderSettings,
} from "../services/binderService";

export const BinderContext = createContext();

const BINDERS_STORAGE_KEY = "pocket-deck-binders";
const GOALS_STORAGE_KEY = "pocket-deck-binder-goals";
const VISIBILITY_STORAGE_KEY = "pocket-deck-binder-visibility";

export const BINDER_VISIBILITY = {
  PRIVATE: "Private",
  PUBLIC: "Public",
  TRADE_VISIBLE: "Trade Visible",
};

export const defaultBinders = [
  "Main Collection",
  "Showcase Binder",
  "Trade Binder",
  "Graded Collection",
  "Wishlist",
];

const defaultBinderVisibility = {
  "Main Collection": BINDER_VISIBILITY.PRIVATE,
  "Showcase Binder": BINDER_VISIBILITY.PUBLIC,
  "Trade Binder": BINDER_VISIBILITY.TRADE_VISIBLE,
  "Graded Collection": BINDER_VISIBILITY.PRIVATE,
  Wishlist: BINDER_VISIBILITY.PRIVATE,
};

function getStoredBinders() {
  const savedBinders = localStorage.getItem(BINDERS_STORAGE_KEY);

  if (savedBinders) {
    try {
      const parsedBinders = JSON.parse(savedBinders);

      if (Array.isArray(parsedBinders) && parsedBinders.length > 0) {
        return parsedBinders;
      }
    } catch {
      return defaultBinders;
    }
  }

  return defaultBinders;
}

function getStoredGoals() {
  const savedGoals = localStorage.getItem(GOALS_STORAGE_KEY);

  if (savedGoals) {
    try {
      const parsedGoals = JSON.parse(savedGoals);

      if (parsedGoals && typeof parsedGoals === "object") {
        return parsedGoals;
      }
    } catch {
      return {};
    }
  }

  return {};
}

function getStoredVisibility() {
  const savedVisibility = localStorage.getItem(VISIBILITY_STORAGE_KEY);

  if (savedVisibility) {
    try {
      const parsedVisibility = JSON.parse(savedVisibility);

      if (parsedVisibility && typeof parsedVisibility === "object") {
        return {
          ...defaultBinderVisibility,
          ...parsedVisibility,
        };
      }
    } catch {
      return defaultBinderVisibility;
    }
  }

  return defaultBinderVisibility;
}

function BinderProvider({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  const [binders, setBinders] = useState(getStoredBinders);
  const [binderGoals, setBinderGoals] = useState(getStoredGoals);
  const [binderVisibility, setBinderVisibility] = useState(getStoredVisibility);
  const [binderSettingsLoading, setBinderSettingsLoading] = useState(false);
  const [binderSettingsError, setBinderSettingsError] = useState("");

  useEffect(() => {
    localStorage.setItem(BINDERS_STORAGE_KEY, JSON.stringify(binders));
  }, [binders]);

  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(binderGoals));
  }, [binderGoals]);

  useEffect(() => {
    localStorage.setItem(
      VISIBILITY_STORAGE_KEY,
      JSON.stringify(binderVisibility)
    );
  }, [binderVisibility]);

  useEffect(() => {
    async function loadSupabaseBinderSettings() {
      if (authLoading || !user) {
        return;
      }

      setBinderSettingsLoading(true);
      setBinderSettingsError("");

      try {
        const settings = await getBinderSettings(user.id);

        if (settings) {
          const savedBinders =
            Array.isArray(settings.binders) && settings.binders.length > 0
              ? Array.from(new Set([...defaultBinders, ...settings.binders]))
              : defaultBinders;

          setBinders(savedBinders);
          setBinderGoals(settings.binder_goals || {});
          setBinderVisibility({
            ...defaultBinderVisibility,
            ...(settings.binder_visibility || {}),
          });
        } else {
          await saveBinderSettings({
            userId: user.id,
            binders,
            binderGoals,
            binderVisibility,
          });
        }
      } catch (error) {
        setBinderSettingsError(error.message);
      }

      setBinderSettingsLoading(false);
    }

    loadSupabaseBinderSettings();
  }, [user, authLoading]);

  async function persistBinderSettings(nextBinders, nextGoals, nextVisibility) {
    if (!user) {
      return;
    }

    setBinderSettingsError("");

    try {
      await saveBinderSettings({
        userId: user.id,
        binders: nextBinders,
        binderGoals: nextGoals,
        binderVisibility: nextVisibility,
      });
    } catch (error) {
      setBinderSettingsError(error.message);
    }
  }

  function isDefaultBinder(name) {
    return defaultBinders.some((binder) => {
      return binder.toLowerCase() === name.toLowerCase();
    });
  }

  function binderExists(name) {
    return binders.some((binder) => {
      return binder.toLowerCase() === name.toLowerCase();
    });
  }

  function getBinderVisibility(name) {
    return binderVisibility[name] || BINDER_VISIBILITY.PRIVATE;
  }

  function setBinderVisibilityStatus(name, visibility) {
    const updatedVisibility = {
      ...binderVisibility,
      [name]: visibility,
    };

    setBinderVisibility(updatedVisibility);
    persistBinderSettings(binders, binderGoals, updatedVisibility);
  }

  function addBinder(name) {
    const trimmedName = name.trim();

    if (!trimmedName || binderExists(trimmedName)) {
      return false;
    }

    const updatedBinders = [...binders, trimmedName];
    const updatedVisibility = {
      ...binderVisibility,
      [trimmedName]: BINDER_VISIBILITY.PRIVATE,
    };

    setBinders(updatedBinders);
    setBinderVisibility(updatedVisibility);
    persistBinderSettings(updatedBinders, binderGoals, updatedVisibility);

    return true;
  }

  function renameBinder(oldName, newName) {
    const trimmedName = newName.trim();

    if (
      !trimmedName ||
      isDefaultBinder(oldName) ||
      binderExists(trimmedName)
    ) {
      return false;
    }

    const updatedBinders = binders.map((binder) => {
      if (binder === oldName) {
        return trimmedName;
      }

      return binder;
    });

    const updatedGoals = { ...binderGoals };

    if (updatedGoals[oldName]) {
      updatedGoals[trimmedName] = updatedGoals[oldName];
      delete updatedGoals[oldName];
    }

    const updatedVisibility = { ...binderVisibility };
    updatedVisibility[trimmedName] =
      updatedVisibility[oldName] || BINDER_VISIBILITY.PRIVATE;
    delete updatedVisibility[oldName];

    setBinders(updatedBinders);
    setBinderGoals(updatedGoals);
    setBinderVisibility(updatedVisibility);
    persistBinderSettings(updatedBinders, updatedGoals, updatedVisibility);

    return true;
  }

  function deleteBinder(name) {
    if (isDefaultBinder(name)) {
      return false;
    }

    const updatedBinders = binders.filter((binder) => binder !== name);

    const updatedGoals = { ...binderGoals };
    delete updatedGoals[name];

    const updatedVisibility = { ...binderVisibility };
    delete updatedVisibility[name];

    setBinders(updatedBinders);
    setBinderGoals(updatedGoals);
    setBinderVisibility(updatedVisibility);
    persistBinderSettings(updatedBinders, updatedGoals, updatedVisibility);

    return true;
  }

  function setBinderGoal(name, targetCount) {
    const numericTarget = Number(targetCount);
    const updatedGoals = { ...binderGoals };

    if (!numericTarget || numericTarget < 1) {
      delete updatedGoals[name];
    } else {
      updatedGoals[name] = numericTarget;
    }

    setBinderGoals(updatedGoals);
    persistBinderSettings(binders, updatedGoals, binderVisibility);
  }

  function replaceBinders(importedBinders) {
    const updatedBinders =
      !Array.isArray(importedBinders) || importedBinders.length === 0
        ? defaultBinders
        : Array.from(new Set([...defaultBinders, ...importedBinders]));

    setBinders(updatedBinders);
    persistBinderSettings(updatedBinders, binderGoals, binderVisibility);
  }

  function replaceBinderGoals(importedGoals) {
    const updatedGoals =
      !importedGoals || typeof importedGoals !== "object" ? {} : importedGoals;

    setBinderGoals(updatedGoals);
    persistBinderSettings(binders, updatedGoals, binderVisibility);
  }

  function replaceBinderVisibility(importedVisibility) {
    const updatedVisibility =
      !importedVisibility || typeof importedVisibility !== "object"
        ? defaultBinderVisibility
        : {
            ...defaultBinderVisibility,
            ...importedVisibility,
          };

    setBinderVisibility(updatedVisibility);
    persistBinderSettings(binders, binderGoals, updatedVisibility);
  }

  return (
    <BinderContext.Provider
      value={{
        binders,
        setBinders,
        binderGoals,
        setBinderGoals,
        binderVisibility,
        binderSettingsLoading,
        binderSettingsError,
        BINDER_VISIBILITY,
        addBinder,
        renameBinder,
        deleteBinder,
        setBinderGoal,
        getBinderVisibility,
        setBinderVisibilityStatus,
        replaceBinders,
        replaceBinderGoals,
        replaceBinderVisibility,
        isDefaultBinder,
      }}
    >
      {children}
    </BinderContext.Provider>
  );
}

export default BinderProvider;