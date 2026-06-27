import { createContext, useEffect, useState } from "react";
import initialCards from "../data/cards";

export const CardContext = createContext();

const STORAGE_KEY = "pocket-deck-cards";

function CardProvider({ children }) {
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem(STORAGE_KEY);

    if (savedCards) {
      try {
        return JSON.parse(savedCards);
      } catch {
        return initialCards;
      }
    }

    return initialCards;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  return (
    <CardContext.Provider value={{ cards, setCards }}>
      {children}
    </CardContext.Provider>
  );
}

export default CardProvider;