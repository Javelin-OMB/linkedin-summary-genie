import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { useSessionDebugger } from '@/hooks/useSessionDebugger';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { AuthStateManager } from './AuthStateManager';
import { SessionInitializer } from './SessionInitializer';
import LoadingSpinner from '../LoadingSpinner';

export const SessionHandler = () => {
  const location = useLocation();
  const [initializationComplete, setInitializationComplete] = useState(false);
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
  useSessionDebugger(location, isLoading, sessionChecked, initialized);

  // Add timeout handling
  useSessionTimeout(isLoading, setIsLoading, setSessionChecked, initialized);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!initializationComplete) {
        console.log('Session initialization timeout reached');
        setInitializationComplete(true);
        setIsLoading(false);
        setSessionChecked(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeoutId);
  }, [initializationComplete, setIsLoading, setSessionChecked]);

  // Show loading state for maximum 5 seconds
  if (isLoading && !initializationComplete) {
    return <LoadingSpinner message="Even geduld..." />;
  }

  return (
    <>
      <AuthStateManager
        setIsLoading={setIsLoading}
        setSessionChecked={setSessionChecked}
        initialized={initialized}
        authSubscription={authSubscription}
        navigate={navigate}
        toast={toast}
        location={location}
      />
      <SessionInitializer
        setIsLoading={setIsLoading}
        setSessionChecked={setSessionChecked}
        sessionChecked={sessionChecked}
        initialized={initialized}
        navigate={navigate}
        toast={toast}
        location={location}
      />
    </>
  );
};