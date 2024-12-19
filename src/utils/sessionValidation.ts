import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

export type SessionCheckResult = {
  data: {
    session: Session | null;
  };
  error: Error | null;
};

// Type guard to ensure session is valid
export const isValidSession = (session: Session | null): session is Session => {
  return session !== null && typeof session === 'object' && 'user' in session;
};

export const checkSession = async (): Promise<SessionCheckResult> => {
  try {
    const result = await supabase.auth.getSession();
    return result;
  } catch (error) {
    console.error('Session check error:', error);
    throw error;
  }
};