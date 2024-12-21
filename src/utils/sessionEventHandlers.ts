import { NavigateFunction } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initializeUserSession, handleSessionNavigation } from './sessionInitializer';
import { safeNavigate } from './navigationUtils';

export const handleSignInEvent = async (
  session: any,
  navigate: NavigateFunction,
  currentPath: string
) => {
  if (session?.user && session?.access_token) {
    console.log('Valid session detected, starting session handling...');
    
    try {
      // Update session
      console.log('Updating session tokens...');
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      });
      
      try {
        // Initialize user session and handle navigation
        await initializeUserSession(session.user.id, session.user.email);
        
        // Only navigate to dashboard if we're on a public route
        const publicRoutes = ['/', '/login', '/about', '/pricing'];
        if (publicRoutes.includes(currentPath)) {
          console.log('On public route, navigating to dashboard...');
          await safeNavigate(navigate, '/dashboard', { replace: true });
        }
      } catch (error: any) {
        console.error('Session initialization error:', error);
        
        // Handle email verification error
        if (error.message.includes('verify your email')) {
          toast({
            title: "Email verificatie vereist",
            description: "Verifieer eerst je e-mailadres via de link in de verificatie e-mail.",
            variant: "destructive"
          });
          
          // Sign out the user since email isn't verified
          await supabase.auth.signOut();
          await safeNavigate(navigate, '/login', { replace: true });
          return;
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Session handling error:', error);
      throw error;
    }
  }
};

export const handleSignOutEvent = async (
  navigate: NavigateFunction,
  currentPath: string,
  showToast: typeof toast
) => {
  console.log('User signed out, cleaning up session data...');
  localStorage.removeItem('supabase.auth.token');
  sessionStorage.clear();
  
  const publicRoutes = ['/', '/login', '/about', '/pricing'];
  if (!publicRoutes.includes(currentPath)) {
    await safeNavigate(navigate, '/', { replace: true });
    showToast({
      title: "Uitgelogd",
      description: "Tot ziens!",
    });
  }
};

export const handleTokenRefresh = async (session: any) => {
  console.log('Token refresh detected, updating session...');
  if (session?.access_token) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });
  }
};
