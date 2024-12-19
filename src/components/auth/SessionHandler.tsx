import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionInitializer } from './SessionInitializer';
import { SessionStateHandler } from './SessionStateHandler';
import { checkInitialSession } from './InitialSessionCheck';
import { ALLOWED_ORIGINS } from '@/utils/constants';
import { supabase } from "@/integrations/supabase/client";

const SESSION_TIMEOUT = 5000; // 5 seconds timeout

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
    console.log('SessionHandler - Session State:', { 
      isLoading, 
      sessionChecked, 
      initialized: initialized.current 
    });
  }, [location.pathname, isLoading, sessionChecked]);

  // Refined auth state management
  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: any) => {
      console.log('Auth state change:', event, 'Session:', session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          // Update states first
          setIsLoading(false);
          setSessionChecked(true);
          initialized.current = true;
          
          // Check current location
          console.log('Current path:', location.pathname);
          
          // Only navigate if we're not already on dashboard
          if (location.pathname !== '/dashboard') {
            console.log('Navigating to dashboard...');
            await navigate('/dashboard');
          }
        } catch (error) {
          console.error('Session handling error:', error);
          // Reset states on error
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

    return () => {
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
    };
  }, [navigate, location.pathname, setIsLoading, setSessionChecked, initialized, toast]);

  // Add timeout handling
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Session initialization timeout reached, resetting state');
        setIsLoading(false);
        setSessionChecked(true);
        initialized.current = true;
      }
    }, SESSION_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [isLoading, setIsLoading, setSessionChecked]);

  // Initialize session on mount with improved state management
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