import { useLocation } from 'react-router-dom';
import { useSessionState } from '@/hooks/useSessionState';
import { useSessionDebugger } from '@/hooks/useSessionDebugger';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { AuthStateManager } from './AuthStateManager';
import { SessionInitializer } from './SessionInitializer';

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
  useSessionDebugger(location, isLoading, sessionChecked, initialized);

  // Add timeout handling
  useSessionTimeout(isLoading, setIsLoading, setSessionChecked, initialized);

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
        initialized={initialized}
        navigate={navigate}
        toast={toast}
        location={location}
      />
    </>
  );
};