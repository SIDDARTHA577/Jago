import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const isUrlValid = url && !url.includes('placeholder');
  const isKeyValid = 
    key && 
    !key.includes('placeholder') && 
    !key.endsWith('...') && 
    key.length > 50; // Valid JWT anon key length

  return Boolean(isUrlValid && isKeyValid);
};
