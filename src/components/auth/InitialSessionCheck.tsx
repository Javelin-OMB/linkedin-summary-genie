import { NavigateFunction } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { initializeUserSession } from '@/utils/sessionInitializer';
import { safeNavigate } from '@/utils/navigationUtils';
import { checkSession, isValidSession } from '@/utils/sessionValidation';
import { refreshSession } from '@/utils/sessionRefresh';
import { handleNavigation, resetRedirectCount } from '@/utils/navigationHandler';

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
      
      const refreshedSession = await refreshSession(session);
      if (refreshedSession) {
        await initializeUserSession(session.user.id, session.user.email);
      }
    }

    const navigationOccurred = await handleNavigation(
      navigate, 
      currentPath, 
      isValidSession(session), 
      showToast
    );

    if (!navigationOccurred) {
      console.log('No navigation needed for current state');
    }

  } catch (error) {
    console.error('Session handling error:', error);
    resetRedirectCount();
    showToast({
      title: "Sessie fout",
      description: "Er was een probleem met je sessie. Probeer opnieuw in te loggen.",
      variant: "destructive",
    });
    await safeNavigate(navigate, '/', { replace: true });
  }
};