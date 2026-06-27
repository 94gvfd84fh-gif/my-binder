import { createContext, useEffect, useState } from "react";

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

function BinderProvider({ children }) {
  const [binders, setBinders] = useState(() => {
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
  });

  const [binderGoals, setBinderGoals] = useState(() => {
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
  });

  const [binderVisibility, setBinderVisibility] = useState(() => {
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
  });

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
    setBinderVisibility((currentVisibility) => {
      return {
        ...currentVisibility,
        [name]: visibility,
      };
    });
  }

  function addBinder(name) {
    const trimmedName = name.trim();

    if (!trimmedName || binderExists(trimmedName)) {
      return false;
    }

    setBinders([...binders, trimmedName]);

    setBinderVisibility((currentVisibility) => {
      return {
        ...currentVisibility,
        [trimmedName]: BINDER_VISIBILITY.PRIVATE,
      };
    });

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

    setBinders(updatedBinders);

    setBinderGoals((currentGoals) => {
      const updatedGoals = { ...currentGoals };

      if (updatedGoals[oldName]) {
        updatedGoals[trimmedName] = updatedGoals[oldName];
        delete updatedGoals[oldName];
      }

      return updatedGoals;
    });

    setBinderVisibility((currentVisibility) => {
      const updatedVisibility = { ...currentVisibility };
      updatedVisibility[trimmedName] =
        updatedVisibility[oldName] || BINDER_VISIBILITY.PRIVATE;
      delete updatedVisibility[oldName];
      return updatedVisibility;
    });

    return true;
  }

  function deleteBinder(name) {
    if (isDefaultBinder(name)) {
      return false;
    }

    const updatedBinders = binders.filter((binder) => binder !== name);
    setBinders(updatedBinders);

    setBinderGoals((currentGoals) => {
      const updatedGoals = { ...currentGoals };
      delete updatedGoals[name];
      return updatedGoals;
    });

    setBinderVisibility((currentVisibility) => {
      const updatedVisibility = { ...currentVisibility };
      delete updatedVisibility[name];
      return updatedVisibility;
    });

    return true;
  }

  function setBinderGoal(name, targetCount) {
    const numericTarget = Number(targetCount);

    setBinderGoals((currentGoals) => {
      const updatedGoals = { ...currentGoals };

      if (!numericTarget || numericTarget < 1) {
        delete updatedGoals[name];
        return updatedGoals;
      }

      updatedGoals[name] = numericTarget;
      return updatedGoals;
    });
  }

  function replaceBinders(importedBinders) {
    if (!Array.isArray(importedBinders) || importedBinders.length === 0) {
      setBinders(defaultBinders);
      return;
    }

    const mergedBinders = Array.from(
      new Set([...defaultBinders, ...importedBinders])
    );

    setBinders(mergedBinders);
  }

  function replaceBinderGoals(importedGoals) {
    if (!importedGoals || typeof importedGoals !== "object") {
      setBinderGoals({});
      return;
    }

    setBinderGoals(importedGoals);
  }

  function replaceBinderVisibility(importedVisibility) {
    if (!importedVisibility || typeof importedVisibility !== "object") {
      setBinderVisibility(defaultBinderVisibility);
      return;
    }

    setBinderVisibility({
      ...defaultBinderVisibility,
      ...importedVisibility,
    });
  }

  return (
    <BinderContext.Provider
      value={{
        binders,
        setBinders,
        binderGoals,
        setBinderGoals,
        binderVisibility,
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