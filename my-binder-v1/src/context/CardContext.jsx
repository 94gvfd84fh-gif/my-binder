import { createContext, useEffect, useState } from "react";
import initialCards from "../data/cards";

export const CardContext = createContext();

function CardProvider({ children }) {
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem("vaultedCards");

    if (savedCards) {
      return JSON.parse(savedCards);
    }

    return initialCards;
  });

  useEffect(() => {
    localStorage.setItem("vaultedCards", JSON.stringify(cards));
  }, [cards]);

  return (
    <CardContext.Provider value={{ cards, setCards }}>
      {children}
    </CardContext.Provider>
  );
}

export default CardProvider;