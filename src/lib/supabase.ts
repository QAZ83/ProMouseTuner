import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || null;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || null;

// Only create the client if both URL and key are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
