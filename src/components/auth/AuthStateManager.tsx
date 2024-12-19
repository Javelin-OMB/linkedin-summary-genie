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
      
      console.log('Auth state changed:', event);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setIsLoading(false);
            setSessionChecked(true);
            initialized.current = true;
            
            if (location.pathname !== '/dashboard') {
              await navigate('/dashboard');
            }
          }
          break;
          
        case 'SIGNED_OUT':
          setIsLoading(false);
          setSessionChecked(false);
          initialized.current = false;
          
          if (location.pathname !== '/') {
            await navigate('/');
          }
          break;
          
        default:
          setIsLoading(false);
          setSessionChecked(true);
          break;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    authSubscription.current = subscription;

    return () => {
      isMounted = false;
      hasSubscribed.current = false;
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
    };
  }, [setIsLoading, setSessionChecked, initialized, authSubscription, navigate, location]);

  return null;
};