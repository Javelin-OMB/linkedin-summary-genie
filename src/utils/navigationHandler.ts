import { NavigateFunction } from 'react-router-dom';
import { safeNavigate } from './navigationUtils';
import { toast } from "@/hooks/use-toast";

// Maximum number of redirects to prevent infinite loops
const MAX_REDIRECTS = 3;
let redirectCount = 0;

export const handleNavigation = async (
  navigate: NavigateFunction,
  currentPath: string,
  hasValidSession: boolean,
  showToast: typeof toast
) => {
  if (redirectCount >= MAX_REDIRECTS) {
    console.error('Max redirects reached, resetting user to login');
    redirectCount = 0;
    showToast({
      title: "Er ging iets mis",
      description: "Probeer opnieuw in te loggen",
      variant: "destructive",
    });
    await safeNavigate(navigate, '/login', { replace: true });
    return true;
  }
  
  redirectCount++;
  console.log('Navigation check:', { currentPath, redirectCount });

  if (hasValidSession && currentPath === '/') {
    console.log('On home page with valid session, navigating to dashboard...');
    redirectCount = 0;
    await safeNavigate(navigate, '/dashboard', { replace: true });
    return true;
  }

  if (!hasValidSession && 
      currentPath !== '/' && 
      currentPath !== '/login' && 
      currentPath !== '/about' && 
      currentPath !== '/pricing') {
    console.log('On protected route without session, redirecting to home...');
    redirectCount = 0;
    await safeNavigate(navigate, '/', { replace: true });
    showToast({
      title: "Sessie verlopen",
      description: "Log opnieuw in om door te gaan",
      variant: "destructive",
    });
    return true;
  }

  return false;
};

export const resetRedirectCount = () => {
  redirectCount = 0;
};