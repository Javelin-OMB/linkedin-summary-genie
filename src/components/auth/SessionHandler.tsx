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

  // Add debug logging
  useEffect(() => {
    console.log('SessionHandler - Current Path:', location.pathname);
    console.log('SessionHandler - Session State:', { isLoading, sessionChecked, initialized: initialized.current });
  }, [location.pathname, isLoading, sessionChecked]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Add more detailed origin checking
      console.log('Received message from origin:', event.origin);
      
      const currentOrigin = window.location.origin;
      console.log('Current origin:', currentOrigin);
      
      if (event.origin !== currentOrigin) {
        console.warn('Origin mismatch:', { 
          received: event.origin, 
          expected: currentOrigin 
        });
        return;
      }
      
      if (event.data?.type === 'AUTH_STATE_CHANGE') {
        console.log('Auth state change event received:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Initialize session on mount with environment checks
  useEffect(() => {
    const initializeSession = async () => {
      if (initialized.current) {
        console.log('Session already initialized, skipping...');
        return;
      }
      
      initialized.current = true;

      try {
        console.log('SessionHandler mounted, checking session state');
        console.log('Current environment:', process.env.NODE_ENV);
        console.log('Current URL:', window.location.href);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Existing session found, refreshing...');
          // Force session refresh to ensure it's valid
          await supabase.auth.refreshSession();
          
          // Then set the refreshed session
          const { data: { session: refreshedSession } } = await supabase.auth.getSession();
          if (refreshedSession) {
            console.log('Setting refreshed session...');
            await supabase.auth.setSession({
              access_token: refreshedSession.access_token,
              refresh_token: refreshedSession.refresh_token
            });
          }
        } else {
          console.log('No existing session found');
        }
        
        await checkInitialSession(navigate, location.pathname, toast);
      } catch (error) {
        console.error('Session initialization error:', error);
        // Clear any potentially corrupted session data
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        setSessionChecked(false);
        setIsLoading(false);
      }
    };

    if (!sessionChecked) {
      console.log('Starting session initialization...');
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