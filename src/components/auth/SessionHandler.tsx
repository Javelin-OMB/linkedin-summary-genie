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

  useSessionDebugger(location, isLoading, sessionChecked, initialized);
  useSessionTimeout(isLoading, setIsLoading, setSessionChecked, initialized);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading && !initializationComplete) {
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
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isLoading, initializationComplete, setIsLoading, setSessionChecked, initialized, toast]);

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