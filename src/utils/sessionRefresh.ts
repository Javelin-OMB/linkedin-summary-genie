import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

export const refreshSession = async (session: Session) => {
  const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
  
  if (refreshError) {
    console.error('Error refreshing session:', refreshError);
    throw refreshError;
  }

  if (refreshedSession?.session) {
    await supabase.auth.setSession({
      access_token: refreshedSession.session.access_token,
      refresh_token: refreshedSession.session.refresh_token
    });
    console.log('Session refreshed successfully');
    return refreshedSession.session;
  }

  return null;
};