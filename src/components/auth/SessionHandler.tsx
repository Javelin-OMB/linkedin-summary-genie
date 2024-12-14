import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { SessionInitializer } from './SessionInitializer';
import { SessionEventHandler } from './SessionEventHandler';

export const SessionHandler = () => {
  const session = useSession();
  const [isInitialized, setIsInitialized] = useState(false);

  if (!isInitialized && session?.user?.id) {
    return <SessionInitializer 
      userId={session.user.id}
      setIsInitialized={setIsInitialized}
    />;
  }

  return <SessionEventHandler />;
};