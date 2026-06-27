const SPECIAL_TYPES = ["EX", "GX", "VMAX", "VSTAR", "BREAK", "V"];

function cleanSearchTerm(value) {
  return value.trim().replace(/\s+/g, " ");
}

function buildSearchTerms(searchTerm) {
  const cleaned = cleanSearchTerm(searchTerm);

  const hasSpecialType = SPECIAL_TYPES.some((type) => {
    return new RegExp(`\\b${type}\\b$`, "i").test(cleaned);
  });

  if (!hasSpecialType) {
    return [cleaned];
  }

  const hyphenVersion = cleaned.replace(
    /\s+(EX|GX|VMAX|VSTAR|BREAK|V)$/i,
    "-$1"
  );

  return Array.from(new Set([hyphenVersion, cleaned]));
}

function getBaseSearchName(searchTerm) {
  return cleanSearchTerm(searchTerm)
    .replace(/\s+(EX|GX|VMAX|VSTAR|BREAK|V)$/i, "")
    .toLowerCase();
}

function isMatchingPokemonName(cardName, baseName) {
  const normalizedCardName = cardName.toLowerCase();

  return (
    normalizedCardName === baseName ||
    normalizedCardName.startsWith(`${baseName}-`) ||
    normalizedCardName.startsWith(`${baseName} `)
  );
}

function mapCard(card) {
  return {
    apiId: card.id,
    name: card.name,
    set: card.set?.name || "",
    cardNumber: card.number || "",
    rarity: card.rarity || "",
    image: card.images?.small || card.images?.large || "",
  };
}

export async function searchPokemonCards(searchTerm) {
  const cleaned = cleanSearchTerm(searchTerm);

  if (!cleaned) {
    return [];
  }

  const searchTerms = buildSearchTerms(cleaned);
  const allCards = [];

  for (const term of searchTerms) {
    const params = new URLSearchParams({
      q: `name:${term}*`,
      pageSize: "100",
    });

    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to search Pokémon cards");
    }

    const data = await response.json();
    allCards.push(...data.data);
  }

  const uniqueCards = Array.from(
    new Map(allCards.map((card) => [card.id, card])).values()
  );

  const baseName = getBaseSearchName(cleaned);

  return uniqueCards
    .filter((card) => isMatchingPokemonName(card.name, baseName))
    .map(mapCard);
}