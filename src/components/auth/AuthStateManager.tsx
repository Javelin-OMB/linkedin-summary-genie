import { useEffect } from 'react';
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
  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: any) => {
      console.log('Auth state change:', event, 'Session:', session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          setIsLoading(false);
          setSessionChecked(true);
          initialized.current = true;
          
          if (location.pathname !== '/dashboard') {
            console.log('Navigating to dashboard...');
            await navigate('/dashboard');
          }
        } catch (error) {
          console.error('Session handling error:', error);
          setIsLoading(false);
          setSessionChecked(false);
          toast({
            title: "Er ging iets mis",
            description: "Probeer het opnieuw",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, resetting states...');
        setIsLoading(false);
        setSessionChecked(false);
        initialized.current = false;
        
        if (location.pathname !== '/') {
          await navigate('/');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    authSubscription.current = subscription;

    // Cleanup subscription on unmount
    return () => {
      if (authSubscription.current) {
        console.log('Cleaning up auth subscription');
        authSubscription.current.unsubscribe();
      }
    };
  }, [setIsLoading, setSessionChecked, initialized, authSubscription, navigate, toast, location]);

  return null;
};