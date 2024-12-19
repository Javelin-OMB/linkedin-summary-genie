import { NavigateFunction } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initializeUserSession } from '@/utils/sessionInitializer';
import { safeNavigate } from '@/utils/navigationUtils';

export const checkInitialSession = async (
  navigate: NavigateFunction,
  showToast: typeof toast,
  currentPath: string
) => {
  try {
    console.log('Checking initial session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking session:', error);
      throw error;
    }

    if (session?.user) {
      console.log('Valid session found for user:', session.user.email);
      
      // Refresh the session token
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
      }

      await initializeUserSession(session.user.id, session.user.email);
      
      if (currentPath === '/') {
        console.log('On home page with valid session, navigating to dashboard...');
        await safeNavigate(navigate, '/dashboard', { replace: true });
      }
    } else {
      console.log('No active session found');
      if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/about' && currentPath !== '/pricing') {
        console.log('On protected route without session, redirecting to home...');
        await safeNavigate(navigate, '/', { replace: true });
        showToast({
          title: "Sessie verlopen",
          description: "Log opnieuw in om door te gaan",
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    console.error('Session check error:', error);
    showToast({
      title: "Sessie fout",
      description: "Er was een probleem met je sessie. Probeer opnieuw in te loggen.",
      variant: "destructive",
    });
    await safeNavigate(navigate, '/', { replace: true });
  }
};