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
  return session !== null && 
         typeof session === 'object' && 
         'user' in session &&
         'access_token' in session &&
         typeof session.access_token === 'string' &&
         session.access_token.length > 0;
};

export const checkSession = async (): Promise<SessionCheckResult> => {
  try {
    console.log('Checking session in environment:', process.env.NODE_ENV);
    const result = await supabase.auth.getSession();
    
    if (result.data.session) {
      // Verify the session is actually valid
      const { data: { user } } = await supabase.auth.getUser(result.data.session.access_token);
      if (!user) {
        throw new Error('Invalid session - no user found');
      }
    }
    
    return result;
  } catch (error) {
    console.error('Session check error:', error);
    // Clear potentially corrupted session data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    throw error;
  }
};