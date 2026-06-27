import { createContext, useEffect, useState } from "react";

export const BinderContext = createContext();

const BINDERS_STORAGE_KEY = "pocket-deck-binders";
const GOALS_STORAGE_KEY = "pocket-deck-binder-goals";

export const defaultBinders = [
  "Main Collection",
  "Showcase Binder",
  "Trade Binder",
  "Graded Collection",
  "Wishlist",
];

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

  useEffect(() => {
    localStorage.setItem(BINDERS_STORAGE_KEY, JSON.stringify(binders));
  }, [binders]);

  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(binderGoals));
  }, [binderGoals]);

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

  function addBinder(name) {
    const trimmedName = name.trim();

    if (!trimmedName || binderExists(trimmedName)) {
      return false;
    }

    setBinders([...binders, trimmedName]);
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

  return (
    <BinderContext.Provider
      value={{
        binders,
        setBinders,
        binderGoals,
        setBinderGoals,
        addBinder,
        renameBinder,
        deleteBinder,
        setBinderGoal,
        replaceBinders,
        replaceBinderGoals,
        isDefaultBinder,
      }}
    >
      {children}
    </BinderContext.Provider>
  );
}

export default BinderProvider;