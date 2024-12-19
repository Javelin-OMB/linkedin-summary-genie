import { NavigateFunction } from 'react-router-dom';
import { Toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initializeUserSession } from '@/utils/sessionInitializer';
import { safeNavigate } from '@/utils/navigationUtils';

export const checkInitialSession = async (
  navigate: NavigateFunction,
  toast: Toast,
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
      await initializeUserSession(session.user.id, session.user.email);
      
      // Only redirect to dashboard if not already there
      if (currentPath === '/') {
        console.log('Redirecting to dashboard...');
        await safeNavigate(navigate, '/dashboard', { replace: true });
      }
    } else {
      console.log('No active session found');
      // Only redirect to home if on a protected route
      if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/about' && currentPath !== '/pricing') {
        console.log('Redirecting to home...');
        await safeNavigate(navigate, '/', { replace: true });
        toast({
          title: "Sessie verlopen",
          description: "Log opnieuw in om door te gaan",
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    console.error('Session check error:', error);
    toast({
      title: "Sessie fout",
      description: "Er was een probleem met je sessie. Probeer opnieuw in te loggen.",
      variant: "destructive",
    });
    await safeNavigate(navigate, '/', { replace: true });
  }
};