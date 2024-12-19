import { useEffect } from 'react';

export const useSessionDebugger = (
  location: { pathname: string },
  isLoading: boolean,
  sessionChecked: boolean,
  initialized: { current: boolean }
) => {
  useEffect(() => {
    console.log('SessionHandler - Current Path:', location.pathname);
    console.log('SessionHandler - Session State:', { 
      isLoading, 
      sessionChecked, 
      initialized: initialized.current 
    });
  }, [location.pathname, isLoading, sessionChecked, initialized]);
};