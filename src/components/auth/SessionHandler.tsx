import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { SessionInitializer } from './SessionInitializer';
import { SessionEventHandler } from './SessionEventHandler';
import { useToast } from "@/components/ui/use-toast";

export const SessionHandler = () => {
  const session = useSession();
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (currentSession?.user) {
          console.log('Valid session found for user:', currentSession.user.email);
          setIsInitialized(true);
        } else {
          console.log('No active session found');
          const currentPath = window.location.pathname;
          if (!['/', '/login', '/signup', '/pricing', '/about'].includes(currentPath)) {
            toast({
              title: "Sessie verlopen",
              description: "Log opnieuw in om door te gaan.",
              variant: "destructive",
            });
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        navigate('/login');
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully:', session?.user?.email);
        setIsInitialized(true);
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
  }, [navigate, toast]);

  if (!isInitialized && session?.user?.id) {
    return <SessionInitializer 
      userId={session.user.id}
      setIsInitialized={setIsInitialized}
    />;
  }

  return <SessionEventHandler />;
};