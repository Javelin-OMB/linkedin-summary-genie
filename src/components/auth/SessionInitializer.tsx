import { useEffect, useRef } from 'react';
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
  const initializationAttempted = useRef(false);

  useEffect(() => {
    if (initializationAttempted.current) return;
    
    let isMounted = true;
    initializationAttempted.current = true;

    const initializeSession = async () => {
      if (initialized.current || sessionChecked) return;

      try {
        console.log('Starting session initialization...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (session) {
          console.log('Session found for:', session.user?.email);
          await checkInitialSession(navigate, location.pathname, toast);
        }
        
        setIsLoading(false);
        setSessionChecked(true);
        initialized.current = true;
      } catch (error) {
        console.error('Session initialization error:', error);
        if (isMounted) {
          setIsLoading(false);
          setSessionChecked(true);
          initialized.current = true;
        }
      }
    };

    initializeSession();

    return () => {
      isMounted = false;
      initializationAttempted.current = false;
    };
  }, [setIsLoading, setSessionChecked, initialized, navigate, toast, location.pathname, sessionChecked]);

  return null;
};