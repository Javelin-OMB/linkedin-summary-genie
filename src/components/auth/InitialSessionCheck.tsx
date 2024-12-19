import { NavigateFunction } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { safeNavigate } from '@/utils/navigationUtils';
import { checkSession, isValidSession } from '@/utils/sessionValidation';

export const checkInitialSession = async (
  navigate: NavigateFunction,
  currentPath: string,
  showToast = toast
) => {
  try {
    console.log('Checking initial session...');
    const { data: { session } } = await supabase.auth.getSession();

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
      const publicRoutes = ['/', '/login', '/about', '/pricing', '/how-it-works'];
      if (publicRoutes.includes(currentPath)) {
        console.log('Authenticated user on public route, redirecting to dashboard...');
        await safeNavigate(navigate, '/dashboard', { replace: true });
      }
    } else {
      // Handle navigation for unauthenticated users
      const protectedRoutes = ['/dashboard', '/settings', '/analyses', '/admin'];
      if (protectedRoutes.includes(currentPath)) {
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
    // Only show error toast and redirect if we're not already on the home page
    if (currentPath !== '/') {
      showToast({
        title: "Sessie fout",
        description: "Er was een probleem met je sessie. Probeer opnieuw in te loggen.",
        variant: "destructive",
      });
      await safeNavigate(navigate, '/', { replace: true });
    }
  }
};