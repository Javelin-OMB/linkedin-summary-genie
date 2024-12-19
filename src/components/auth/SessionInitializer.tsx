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
        console.log('Session already initialized, skipping...');
        return;
      }

      try {
        console.log('Starting session initialization...');
        const { data: { session } } = await supabase.auth.getSession();
        
        // Immediately update states
        setIsLoading(false);
        setSessionChecked(true);
        initialized.current = true;

        if (session) {
          console.log('Session found for:', session.user?.email);
          await checkInitialSession(navigate, location.pathname, toast);
        } else {
          console.log('No session found, proceeding as guest');
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        setIsLoading(false);
        setSessionChecked(true);
        initialized.current = true;
      }
    };

    if (!sessionChecked && !initialized.current) {
      initializeSession();
    }
  }, [setIsLoading, setSessionChecked, initialized, navigate, toast, location.pathname, sessionChecked]);

  return null;
};