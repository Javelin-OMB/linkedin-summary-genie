import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { useSessionDebugger } from '@/hooks/useSessionDebugger';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
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

  // Add debug logging
  useSessionDebugger(location, isLoading, sessionChecked, initialized);

  // Add timeout handling
  useSessionTimeout(isLoading, setIsLoading, setSessionChecked, initialized);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const initSession = async () => {
      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.log('Session initialization timeout reached');
          setInitializationComplete(true);
          setIsLoading(false);
          setSessionChecked(true);
          initialized.current = true;
          toast({
            title: "Sessie timeout",
            description: "Probeer de pagina te verversen",
            variant: "destructive",
          });
        }, 3000); // 3 second timeout

        // If initialization is already complete, clear timeout
        if (initializationComplete || !isLoading || sessionChecked) {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        setInitializationComplete(true);
        setIsLoading(false);
        setSessionChecked(true);
        initialized.current = true;
        toast({
          title: "Er is een fout opgetreden",
          description: "Probeer opnieuw in te loggen",
          variant: "destructive",
        });
      }
    };

    if (!initializationComplete && isLoading) {
      initSession();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [initializationComplete, isLoading, sessionChecked, setIsLoading, setSessionChecked, initialized, toast]);

  // Show loading state for maximum 3 seconds
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