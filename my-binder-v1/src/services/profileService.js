import { supabase } from "../lib/supabaseClient";

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function saveProfile(profile) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      ...profile,
      account_type: profile.account_type || profile.accountType || "Collector",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getPublicProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, account_type, favorite_tcg, favorite_set, location, collector_since, bio, avatar, featured_card_id, updated_at"
    )
    .order("updated_at", { ascending: false })
    .limit(80);

  if (error) {
    throw error;
  }

  return data || [];
}


export async function getPublicProfile(profileId) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, account_type, favorite_tcg, favorite_set, location, collector_since, bio, avatar, featured_card_id, updated_at"
    )
    .eq("id", profileId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}
