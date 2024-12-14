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
    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      console.log('Current session state:', currentSession?.user?.email);
      
      if (currentSession?.user) {
        console.log('Valid session found, proceeding with initialization');
        setIsInitialized(false);
      } else {
        console.log('No active session found');
        if (window.location.pathname !== '/login' && 
            window.location.pathname !== '/signup' && 
            window.location.pathname !== '/') {
          navigate('/login');
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully:', session?.user?.email);
        setIsInitialized(false);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsInitialized(false);
        navigate('/login');
      }
    });

    return () => {
      console.log('Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (!isInitialized && session?.user?.id) {
    console.log('Starting session initialization for user:', session.user.email);
    return <SessionInitializer 
      userId={session.user.id}
      setIsInitialized={setIsInitialized}
    />;
  }

  return <SessionEventHandler />;
};