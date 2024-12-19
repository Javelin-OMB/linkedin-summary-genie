import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { checkInitialSession } from './InitialSessionCheck';

interface SessionInitializerProps {
  setIsLoading: (loading: boolean) => void;
  setSessionChecked: (checked: boolean) => void;
  sessionChecked: boolean;  // Added this prop
  initialized: { current: boolean };
  navigate: NavigateFunction;
  toast: any;
  location: { pathname: string };
}

export const SessionInitializer = ({
  setIsLoading,
  setSessionChecked,
  sessionChecked,  // Added this prop
  initialized,
  navigate,
  toast,
  location
}: SessionInitializerProps) => {
  useEffect(() => {
    const initializeSession = async () => {
      if (initialized.current) {
        console.log('Session already initialized, skipping...');
        return;
      }

      try {
        console.log('SessionHandler mounted, checking session state');
        console.log('Current environment:', process.env.NODE_ENV);
        console.log('Current URL:', window.location.href);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Existing session found, refreshing...');
          await supabase.auth.refreshSession();
          
          const { data: { session: refreshedSession } } = await supabase.auth.getSession();
          if (refreshedSession) {
            console.log('Setting refreshed session...');
            await supabase.auth.setSession({
              access_token: refreshedSession.access_token,
              refresh_token: refreshedSession.refresh_token
            });
            
            // Update state after successful session refresh
            setIsLoading(false);
            setSessionChecked(true);
            initialized.current = true;
          }
        } else {
          console.log('No existing session found');
          // Reset state when no session is found
          setIsLoading(false);
          setSessionChecked(true);
          initialized.current = true;
        }
        
        await checkInitialSession(navigate, location.pathname, toast);
      } catch (error) {
        console.error('Session initialization error:', error);
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        setSessionChecked(false);
        setIsLoading(false);
        initialized.current = true;
      }
    };

    if (!sessionChecked) {
      console.log('Starting session initialization...');
      initializeSession();
    }
  }, [setIsLoading, setSessionChecked, initialized, navigate, toast, location.pathname, sessionChecked]);

  return null;
};