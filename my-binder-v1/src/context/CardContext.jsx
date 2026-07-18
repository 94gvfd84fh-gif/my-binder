import { createContext, useContext, useEffect, useState } from "react";
import initialCards from "../data/cards";
import { AuthContext } from "./AuthContext";
import {
  getCards,
  saveCard,
  updateCard,
  deleteCard as deleteSupabaseCard,
} from "../services/cardService";

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

  if (card.status === "For Trade" && !extraBinders.includes("Trade Binder")) {
    extraBinders.push("Trade Binder");
  }

  return Array.from(
    new Set(extraBinders.filter((binderName) => binderName !== primaryBinder))
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

function getLocalCards() {
  const savedCards = localStorage.getItem(STORAGE_KEY);

  if (savedCards) {
    try {
      return normalizeCards(JSON.parse(savedCards));
    } catch {
      return normalizeCards(initialCards);
    }
  }

  return normalizeCards(initialCards);
}

function CardProvider({ children }) {
  const { user, authLoading } = useContext(AuthContext);
  const [cards, setCards] = useState(getLocalCards);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState("");

  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, user]);

  useEffect(() => {
    async function loadSupabaseCards() {
      if (authLoading) {
        return;
      }

      if (!user) {
        setCards(getLocalCards());
        return;
      }

      setCardsLoading(true);
      setCardsError("");

      try {
        const supabaseCards = await getCards(user.id);
        setCards(normalizeCards(supabaseCards));
      } catch (error) {
        setCardsError(error.message);
        setCards([]);
      }

      setCardsLoading(false);
    }

    loadSupabaseCards();
  }, [user, authLoading]);

  async function addCard(card) {
    const now = new Date().toISOString();

    const newCard = normalizeCard({
      ...card,
      id: card.id || Date.now(),
      createdAt: card.createdAt || now,
      updatedAt: now,
    });

    if (!user) {
      setCards((currentCards) => [...currentCards, newCard]);
      return;
    }

    setCardsLoading(true);
    setCardsError("");

    try {
      const savedCard = await saveCard(newCard, user.id);
      setCards((currentCards) => [...currentCards, normalizeCard(savedCard)]);
    } catch (error) {
      setCardsError(error.message);
    }

    setCardsLoading(false);
  }

  async function editCard(updatedCard) {
    const normalizedCard = normalizeCard({
      ...updatedCard,
      updatedAt: new Date().toISOString(),
    });

    if (!user) {
      setCards((currentCards) =>
        currentCards.map((card) =>
          Number(card.id) === Number(normalizedCard.id) ? normalizedCard : card
        )
      );
      return;
    }

    setCardsLoading(true);
    setCardsError("");

    try {
      const savedCard = await updateCard(normalizedCard, user.id);

      setCards((currentCards) =>
        currentCards.map((card) =>
          Number(card.id) === Number(savedCard.id) ? normalizeCard(savedCard) : card
        )
      );
    } catch (error) {
      setCardsError(error.message);
    }

    setCardsLoading(false);
  }

  async function removeCard(id) {
    if (!user) {
      setCards((currentCards) =>
        currentCards.filter((card) => Number(card.id) !== Number(id))
      );
      return;
    }

    setCardsLoading(true);
    setCardsError("");

    try {
      await deleteSupabaseCard(id, user.id);

      setCards((currentCards) =>
        currentCards.filter((card) => Number(card.id) !== Number(id))
      );
    } catch (error) {
      setCardsError(error.message);
    }

    setCardsLoading(false);
  }

  async function syncLocalCardsToSupabase() {
    if (!user) {
      setCardsError("Sign in before syncing cards.");
      return;
    }

    setCardsLoading(true);
    setCardsError("");

    try {
      const syncedCards = [];

      for (const card of cards) {
        const savedCard = await saveCard(card, user.id);
        syncedCards.push(normalizeCard(savedCard));
      }

      setCards(syncedCards);
    } catch (error) {
      setCardsError(error.message);
    }

    setCardsLoading(false);
  }

  return (
    <CardContext.Provider
      value={{
        cards,
        setCards,
        cardsLoading,
        cardsError,
        addCard,
        editCard,
        removeCard,
        syncLocalCardsToSupabase,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

export default CardProvider;