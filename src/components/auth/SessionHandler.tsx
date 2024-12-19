import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { AuthStateManager } from './AuthStateManager';
import { SessionInitializer } from './SessionInitializer';
import LoadingSpinner from '../LoadingSpinner';
import { useToast } from "@/hooks/use-toast";

export const SessionHandler = () => {
  const location = useLocation();
  const [initializationComplete, setInitializationComplete] = useState(false);
  const initializationAttempted = useRef(false);
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

  // Single initialization attempt with shorter timeout
  useEffect(() => {
    if (initializationAttempted.current) return;
    
    initializationAttempted.current = true;
    const timeoutId = setTimeout(() => {
      if (!initializationComplete) {
        console.log('Forcing session completion after timeout');
        setInitializationComplete(true);
        setIsLoading(false);
        setSessionChecked(true);
        initialized.current = true;
      }
    }, 1500); // Reduced timeout to 1.5 seconds

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