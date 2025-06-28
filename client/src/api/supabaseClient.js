import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Optional: Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // Optional: Configure realtime settings
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
