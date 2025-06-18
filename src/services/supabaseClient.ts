import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const useDatabase = import.meta.env.VITE_DATA_SOURCE !== 'local';

export const supabase: SupabaseClient | null =
  useDatabase && supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const isUsingDatabase = !!supabase;
