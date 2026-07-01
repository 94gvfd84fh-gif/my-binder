import { supabase } from "../lib/supabaseClient";

function toDatabaseCard(card, userId) {
  return {
    user_id: userId,
    name: card.name || "",
    set_name: card.set || "",
    card_number: card.cardNumber || "",
    rarity: card.rarity || "",
    condition: card.condition || "",
    status: card.status || "Keep",
    card_type: card.cardType || "Pokémon",
    value: Number(card.value || 0),
    sale_price: Number(card.salePrice || 0),
    favorite: Boolean(card.favorite),
    image: card.image || "",
    notes: card.notes || "",
    primary_binder: card.primaryBinder || card.binder || "Main Collection",
    extra_binders: Array.isArray(card.extraBinders) ? card.extraBinders : [],
    grading_company: card.gradingCompany || "Raw",
    grade: card.grade || "",
    cert_number: card.certNumber || "",
    api_id: card.apiId || "",
    updated_at: new Date().toISOString(),
  };
}

function fromDatabaseCard(card) {
  return {
    id: card.id,
    name: card.name,
    set: card.set_name,
    cardNumber: card.card_number,
    rarity: card.rarity,
    condition: card.condition,
    status: card.status,
    cardType: card.card_type,
    value: card.value,
    salePrice: card.sale_price,
    favorite: card.favorite,
    image: card.image,
    notes: card.notes,
    binder: card.primary_binder,
    primaryBinder: card.primary_binder,
    extraBinders: card.extra_binders || [],
    gradingCompany: card.grading_company,
    grade: card.grade,
    certNumber: card.cert_number,
    apiId: card.api_id,
    createdAt: card.created_at,
    updatedAt: card.updated_at,
  };
}

export async function getCards(userId) {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(fromDatabaseCard);
}

export async function saveCard(card, userId) {
  const databaseCard = toDatabaseCard(card, userId);

  const { data, error } = await supabase
    .from("cards")
    .insert(databaseCard)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromDatabaseCard(data);
}

export async function updateCard(card, userId) {
  const databaseCard = toDatabaseCard(card, userId);

  const { data, error } = await supabase
    .from("cards")
    .update(databaseCard)
    .eq("id", card.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromDatabaseCard(data);
}

export async function deleteCard(cardId, userId) {
  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}