import { useEffect } from 'react';

const SESSION_TIMEOUT = 5000; // 5 seconds timeout

export const useSessionTimeout = (
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
  setSessionChecked: (checked: boolean) => void,
  initialized: { current: boolean }
) => {
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
  }, [isLoading, setIsLoading, setSessionChecked, initialized]);
};