import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionInitializer } from './SessionInitializer';
import { SessionStateHandler } from './SessionStateHandler';
import { checkInitialSession } from './InitialSessionCheck';
import { ALLOWED_ORIGINS } from '@/utils/constants';

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

  // Add origin validation for postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        console.error('Invalid origin:', event.origin);
        return;
      }
      
      // Handle the message
      if (event.data?.type === 'AUTH_STATE_CHANGE') {
        console.log('Received auth state change:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const initializeSession = async () => {
      if (initialized.current) return;
      initialized.current = true;

      console.log('SessionHandler mounted, current path:', location.pathname);
      await checkInitialSession(navigate, toast, location.pathname);
    };

    initializeSession();
  }, [navigate, location.pathname, toast]);

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