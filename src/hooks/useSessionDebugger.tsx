import { useEffect } from 'react';
import { Location } from 'react-router-dom';

export const useSessionDebugger = (
  location: Location,
  isLoading: boolean,
  sessionChecked: boolean,
  initialized: { current: boolean }
) => {
  useEffect(() => {
    console.log('Session state:', {
      path: location.pathname,
      isLoading,
      sessionChecked,
      initialized: initialized.current
    });
  }, [location, isLoading, sessionChecked, initialized]);
};