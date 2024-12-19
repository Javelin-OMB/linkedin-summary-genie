import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionInitializer } from './SessionInitializer';
import { SessionStateHandler } from './SessionStateHandler';
import { checkInitialSession } from './InitialSessionCheck';
import { ALLOWED_ORIGINS } from '@/utils/constants';
import { supabase } from "@/integrations/supabase/client";

export const SessionHandler = () => {
  const location = useLocation();
  const {
    isLoading,
    setIsLoading,
    sessionChecked,
    setSessionChecked,
    initialized,
    authSubscription,
    navigate,
    toast
  } = useSessionState();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        console.error('Invalid origin:', event.origin);
        return;
      }
      
      if (event.data?.type === 'AUTH_STATE_CHANGE') {
        console.log('Received auth state change:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const initializeSession = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        console.log('SessionHandler mounted, checking session state');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Existing session found, refreshing...');
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token
          });
        }
        
        await checkInitialSession(navigate, location.pathname, toast);
      } catch (error) {
        console.error('Session initialization error:', error);
      }
    };

    if (!sessionChecked) {
      initializeSession();
    }
  }, [navigate, location.pathname, toast, sessionChecked]);

  return (
    <>
      <SessionInitializer
        setIsLoading={setIsLoading}
        setSessionChecked={setSessionChecked}
        navigate={navigate}
        toast={toast}
        currentPath={location.pathname}
      />
      <SessionStateHandler
        setSessionChecked={setSessionChecked}
        setIsLoading={setIsLoading}
        authSubscription={authSubscription}
        navigate={navigate}
        toast={toast}
        currentPath={location.pathname}
      />
    </>
  );
};