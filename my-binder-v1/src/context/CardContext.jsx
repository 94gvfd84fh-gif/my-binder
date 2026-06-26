import { createContext, useState } from "react";
import initialCards from "../data/cards";

export const CardContext = createContext();

function CardProvider({ children }) {
  const [cards, setCards] = useState(initialCards);

  return (
    <CardContext.Provider value={{ cards, setCards }}>
      {children}
    </CardContext.Provider>
  );
}

export default CardProvider;