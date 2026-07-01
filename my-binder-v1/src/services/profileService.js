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