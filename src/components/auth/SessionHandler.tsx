import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { SessionInitializer } from './SessionInitializer';
import { SessionEventHandler } from './SessionEventHandler';

export const SessionHandler = () => {
  const session = useSession();
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (!isInitialized && session?.user?.id) {
    return <SessionInitializer 
      userId={session.user.id}
      setIsInitialized={setIsInitialized}
    />;
  }

  return <SessionEventHandler />;
};