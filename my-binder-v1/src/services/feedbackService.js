import { supabase } from "../lib/supabaseClient";

export async function getFeedback(userId) {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function saveFeedback({ userId, email, type, message }) {
  const { data, error } = await supabase
    .from("feedback")
    .insert({
      user_id: userId,
      email,
      type,
      message,
      status: "New",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}