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
    console.log('SessionHandler - Current session:', session?.user?.email);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
        setIsInitialized(false); // Reset initialization when user signs in
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsInitialized(false); // Reset initialization when user signs out
        navigate('/login');
      }
    });

    // Check initial session
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('Initial session check:', currentSession?.user?.email);
      if (currentSession?.user) {
        setIsInitialized(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (!isInitialized && session?.user?.id) {
    console.log('Initializing session for user:', session.user.email);
    return <SessionInitializer 
      userId={session.user.id}
      setIsInitialized={setIsInitialized}
    />;
  }

  return <SessionEventHandler />;
};