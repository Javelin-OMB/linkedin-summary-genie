import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { AuthStateManager } from './AuthStateManager';
import { SessionInitializer } from './SessionInitializer';
import LoadingSpinner from '../LoadingSpinner';
import { useToast } from "@/hooks/use-toast";

export const SessionHandler = () => {
  const location = useLocation();
  const [initializationComplete, setInitializationComplete] = useState(false);
  const { toast } = useToast();
  const {
    isLoading,
    setIsLoading,
    sessionChecked,
    setSessionChecked,
    initialized,
    authSubscription,
    navigate,
  } = useSessionState();

  // Simplified initialization timeout
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!initializationComplete) {
        console.log('Session initialization timeout reached');
        setInitializationComplete(true);
        setIsLoading(false);
        setSessionChecked(true);
        initialized.current = true;
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [initializationComplete, setIsLoading, setSessionChecked, initialized]);

  // Only show loading state briefly
  if (isLoading && !initializationComplete && !sessionChecked) {
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