import { useEffect, useRef } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface AuthStateManagerProps {
  setIsLoading: (loading: boolean) => void;
  setSessionChecked: (checked: boolean) => void;
  initialized: { current: boolean };
  authSubscription: { current: any };
  navigate: NavigateFunction;
  toast: any;
  location: { pathname: string };
}

export const AuthStateManager = ({
  setIsLoading,
  setSessionChecked,
  initialized,
  authSubscription,
  navigate,
  toast,
  location
}: AuthStateManagerProps) => {
  const hasSubscribed = useRef(false);

  useEffect(() => {
    if (hasSubscribed.current) return;
    
    let isMounted = true;
    hasSubscribed.current = true;

    const handleAuthStateChange = async (event: string, session: any) => {
      if (!isMounted) return;
      
      console.log('Auth state changed:', event, 'Session:', session?.user?.email);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            console.log('User signed in, updating state...');
            setIsLoading(false);
            setSessionChecked(true);
            initialized.current = true;
            
            // Only navigate if we're not already on the dashboard
            if (location.pathname !== '/dashboard') {
              console.log('Navigating to dashboard...');
              await navigate('/dashboard', { replace: true });
            }
          }
          break;
          
        case 'SIGNED_OUT':
          console.log('User signed out, cleaning up...');
          setIsLoading(false);
          setSessionChecked(false);
          initialized.current = false;
          
          // Only navigate if we're not already on the home page
          if (location.pathname !== '/') {
            console.log('Navigating to home...');
            await navigate('/', { replace: true });
          }
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed');
          if (session) {
            await supabase.auth.setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token
            });
          }
          break;
          
        default:
          setIsLoading(false);
          setSessionChecked(true);
          break;
      }
    };

    console.log('Setting up auth state subscription...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    authSubscription.current = subscription;

    return () => {
      console.log('Cleaning up auth subscription...');
      isMounted = false;
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
      hasSubscribed.current = false;
    };
  }, [setIsLoading, setSessionChecked, initialized, authSubscription, navigate, location]);

  return null;
};