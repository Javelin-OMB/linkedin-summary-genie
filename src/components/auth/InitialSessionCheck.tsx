import { NavigateFunction } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { safeNavigate } from '@/utils/navigationUtils';
import { checkSession, isValidSession } from '@/utils/sessionValidation';

export const checkInitialSession = async (
  navigate: NavigateFunction,
  showToast: typeof toast,
  currentPath: string
) => {
  try {
    console.log('Starting initial session check:', { currentPath });
    
    const { data: { session }, error } = await checkSession();

    if (error) {
      console.error('Session check error:', error);
      throw error;
    }

    if (isValidSession(session)) {
      console.log('Valid session found for user:', session.user.email);
      
      // Update session
      if (session) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
      }

      // Handle navigation for authenticated users
      if (currentPath === '/') {
        console.log('Authenticated user on home page, redirecting to dashboard...');
        await safeNavigate(navigate, '/dashboard', { replace: true });
      }
    } else {
      // Handle navigation for unauthenticated users
      if (currentPath !== '/' && 
          currentPath !== '/login' && 
          currentPath !== '/about' && 
          currentPath !== '/pricing') {
        console.log('Unauthenticated user on protected route, redirecting to home...');
        showToast({
          title: "Toegang geweigerd",
          description: "Log in om deze pagina te bekijken",
          variant: "destructive",
        });
        await safeNavigate(navigate, '/', { replace: true });
      }
    }

  } catch (error) {
    console.error('Session handling error:', error);
    showToast({
      title: "Sessie fout",
      description: "Er was een probleem met je sessie. Probeer opnieuw in te loggen.",
      variant: "destructive",
    });
    await safeNavigate(navigate, '/', { replace: true });
  }
};