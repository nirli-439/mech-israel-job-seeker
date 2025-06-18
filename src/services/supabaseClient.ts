import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isUsingDatabase = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null =
  isUsingDatabase ? createClient(supabaseUrl!, supabaseKey!) : null;
