import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { checkInitialSession } from './InitialSessionCheck';

interface SessionInitializerProps {
  setIsLoading: (loading: boolean) => void;
  setSessionChecked: (checked: boolean) => void;
  sessionChecked: boolean;
  initialized: { current: boolean };
  navigate: NavigateFunction;
  toast: any;
  location: { pathname: string };
}

export const SessionInitializer = ({
  setIsLoading,
  setSessionChecked,
  sessionChecked,
  initialized,
  navigate,
  toast,
  location
}: SessionInitializerProps) => {
  useEffect(() => {
    const initializeSession = async () => {
      if (initialized.current || sessionChecked) {
        console.log('Session already initialized or checked, skipping...');
        return;
      }

      try {
        console.log('Starting session initialization...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Setting session state...');
          setIsLoading(false);
          setSessionChecked(true);
          initialized.current = true;
        } else {
          console.log('No session found, resetting state...');
          setIsLoading(false);
          setSessionChecked(true);
          initialized.current = true;
        }
        
        await checkInitialSession(navigate, location.pathname, toast);
      } catch (error) {
        console.error('Session initialization error:', error);
        setIsLoading(false);
        setSessionChecked(true);
        initialized.current = true;
        toast({
          title: "Er is een fout opgetreden",
          description: "Probeer opnieuw in te loggen",
          variant: "destructive",
        });
      }
    };

    if (!sessionChecked && !initialized.current) {
      initializeSession();
    }
  }, [setIsLoading, setSessionChecked, initialized, navigate, toast, location.pathname, sessionChecked]);

  return null;
};