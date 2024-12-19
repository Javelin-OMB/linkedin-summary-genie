import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oafrayzemkdwjxuqclks.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZnJheXplbWtkd2p4dXFjbGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTI0MjksImV4cCI6MjA0OTE4ODQyOX0.g3hazl0_ZUO6fKFQsyf-uv7UsheXi3JaHJa6jXFeoo4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});