import { supabase } from "../lib/supabaseClient";

export async function getStoreEvents(storeId) {
  const { data, error } = await supabase
    .from("store_events")
    .select("*")
    .eq("store_id", storeId)
    .order("event_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getPublicStoreEvents() {
  const { data, error } = await supabase
    .from("store_events")
    .select("*")
    .eq("is_public", true)
    .order("event_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createStoreEvent(event, storeId) {
  const { data, error } = await supabase
    .from("store_events")
    .insert({
      store_id: storeId,
      title: event.title,
      event_type: event.eventType,
      event_date: event.eventDate,
      event_time: event.eventTime,
      location: event.location,
      details: event.details,
      event_flyer: event.eventFlyer || "",
      is_public: true,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateStoreEvent(eventId, event, storeId) {
  const { data, error } = await supabase
    .from("store_events")
    .update({
      title: event.title,
      event_type: event.eventType,
      event_date: event.eventDate,
      event_time: event.eventTime,
      location: event.location,
      details: event.details,
      event_flyer: event.eventFlyer || "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId)
    .eq("store_id", storeId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteStoreEvent(eventId, storeId) {
  const { error } = await supabase
    .from("store_events")
    .delete()
    .eq("id", eventId)
    .eq("store_id", storeId);

  if (error) {
    throw error;
  }
}