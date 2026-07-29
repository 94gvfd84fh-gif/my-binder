import { supabase } from "../lib/supabaseClient";

export async function getUserPreferences(userId) {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function saveUserPreferences({
  userId,
  savedEvents,
  savedShops,
  followedCollectors,
}) {
  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({
      user_id: userId,
      saved_events: Array.isArray(savedEvents) ? savedEvents : [],
      saved_shops: Array.isArray(savedShops) ? savedShops : [],
      followed_collectors: Array.isArray(followedCollectors)
        ? followedCollectors
        : [],
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
