import { NavigateFunction } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initializeUserSession } from '@/utils/sessionInitializer';
import { safeNavigate } from '@/utils/navigationUtils';
import { LOADING_TIMEOUT } from '@/utils/constants';
import { Session, User } from '@supabase/supabase-js';

// Type definitions for session handling
type AuthSession = {
  session: Session | null;
  user: User | null;
};

type SessionCheckResult = {
  data: {
    session: Session | null;
  };
  error: Error | null;
};

// Type guard to ensure session is valid
const isValidSession = (session: Session | null): session is Session => {
  return session !== null && typeof session === 'object' && 'user' in session;
};

// Maximum number of redirects to prevent infinite loops
const MAX_REDIRECTS = 3;
let redirectCount = 0;

export const checkInitialSession = async (
  navigate: NavigateFunction,
  showToast: typeof toast,
  currentPath: string
) => {
  let timeoutId: NodeJS.Timeout;

  try {
    // Reset redirect count if we've reached a new path
    if (redirectCount >= MAX_REDIRECTS) {
      console.error('Max redirects reached, resetting user to login');
      redirectCount = 0;
      showToast({
        title: "Er ging iets mis",
        description: "Probeer opnieuw in te loggen",
        variant: "destructive",
      });
      await safeNavigate(navigate, '/login', { replace: true });
      return;
    }
    redirectCount++;

    console.log('Checking initial session...', { currentPath, redirectCount });
    
    // Set up loading timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Session check timed out'));
      }, LOADING_TIMEOUT);
    });

    // Race between the session check and timeout
    const { data: { session }, error } = await Promise.race([
      supabase.auth.getSession(),
      timeoutPromise
    ]) as SessionCheckResult;

    clearTimeout(timeoutId);

    if (error) {
      console.error('Error checking session:', error);
      throw error;
    }

    console.log('Session check result:', { 
      hasSession: !!session, 
      currentPath,
      redirectCount 
    });

    if (isValidSession(session)) {
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
        console.log('Session refreshed successfully');
      }

      await initializeUserSession(session.user.id, session.user.email);
      
      if (currentPath === '/') {
        console.log('On home page with valid session, navigating to dashboard...');
        redirectCount = 0; // Reset count before navigation
        await safeNavigate(navigate, '/dashboard', { replace: true });
      }
    } else {
      console.log('No active session found');
      if (currentPath !== '/' && 
          currentPath !== '/login' && 
          currentPath !== '/about' && 
          currentPath !== '/pricing') {
        console.log('On protected route without session, redirecting to home...');
        redirectCount = 0; // Reset count before navigation
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
    redirectCount = 0; // Reset count before error navigation
    await safeNavigate(navigate, '/', { replace: true });
  } finally {
    clearTimeout(timeoutId);
  }
};