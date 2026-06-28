import { createContext, useEffect, useState } from "react";
import initialCards from "../data/cards";

export const CardContext = createContext();

const STORAGE_KEY = "pocket-deck-cards";

function getPrimaryBinder(card) {
  if (card.status === "Wishlist") {
    return "Wishlist";
  }

  if (card.primaryBinder) {
    return card.primaryBinder;
  }

  if (
    card.binder === "Main Collection" ||
    card.binder === "Graded Collection" ||
    card.binder === "Wishlist"
  ) {
    return card.binder;
  }

  if (card.gradingCompany && card.gradingCompany !== "Raw") {
    return "Graded Collection";
  }

  return "Main Collection";
}

function getExtraBinders(card, primaryBinder) {
  const extraBinders = Array.isArray(card.extraBinders)
    ? [...card.extraBinders]
    : [];

  if (
    card.binder &&
    card.binder !== primaryBinder &&
    !extraBinders.includes(card.binder)
  ) {
    extraBinders.push(card.binder);
  }

  if (
    card.status === "For Trade" &&
    !extraBinders.includes("Trade Binder")
  ) {
    extraBinders.push("Trade Binder");
  }

  return Array.from(
    new Set(
      extraBinders.filter((binderName) => {
        return binderName !== primaryBinder;
      })
    )
  );
}

function getCardDate(card) {
  if (card.createdAt) {
    return card.createdAt;
  }

  if (card.id) {
    const dateFromId = new Date(Number(card.id));

    if (!Number.isNaN(dateFromId.getTime())) {
      return dateFromId.toISOString();
    }
  }

  return new Date().toISOString();
}

function normalizeCard(card) {
  const primaryBinder = getPrimaryBinder(card);
  const createdAt = getCardDate(card);

  return {
    ...card,
    cardType: card.cardType || "Pokémon",
    value: Number(card.value || 0),
    salePrice: card.salePrice === undefined ? "" : card.salePrice,
    binder: primaryBinder,
    primaryBinder,
    extraBinders: getExtraBinders(card, primaryBinder),
    createdAt,
    updatedAt: card.updatedAt || createdAt,
  };
}

function normalizeCards(cardList) {
  if (!Array.isArray(cardList)) {
    return [];
  }

  return cardList.map(normalizeCard);
}

function CardProvider({ children }) {
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem(STORAGE_KEY);

    if (savedCards) {
      try {
        return normalizeCards(JSON.parse(savedCards));
      } catch {
        return normalizeCards(initialCards);
      }
    }

    return normalizeCards(initialCards);
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