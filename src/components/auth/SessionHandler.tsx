import { useState } from 'react';
import { SessionChecker } from './SessionChecker';
import { SessionStateListener } from './SessionStateListener';

export const SessionHandler = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSessionChecked = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  const handleAuthStateChange = (event: string) => {
    if (event === 'SIGNED_OUT') {
      setIsAuthenticated(false);
    }
  };

  return (
    <>
      <SessionChecker onSessionChecked={handleSessionChecked} />
      <SessionStateListener onStateChange={handleAuthStateChange} />
    </>
  );
};