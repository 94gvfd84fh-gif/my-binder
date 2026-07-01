import { supabase } from "../lib/supabaseClient";

export async function getBinderSettings(userId) {
  const { data, error } = await supabase
    .from("binder_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function saveBinderSettings({
  userId,
  binders,
  binderGoals,
  binderVisibility,
}) {
  const { data, error } = await supabase
    .from("binder_settings")
    .upsert({
      user_id: userId,
      binders,
      binder_goals: binderGoals || {},
      binder_visibility: binderVisibility || {},
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}