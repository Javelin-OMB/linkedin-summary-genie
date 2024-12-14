import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/LoadingSpinner';

export const SessionHandler = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session state:', currentSession?.user?.email);
        
        if (currentSession?.user?.id) {
          console.log('Session found, checking user data');
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            setIsInitialized(true);
            return;
          }

          console.log('User data:', userData);
          
          if (userData) {
            console.log('Existing user - redirecting to homepage');
            navigate('/');
          } else {
            console.log('No user data found - redirecting to pricing');
            navigate('/pricing');
          }
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', currentSession?.user?.email);
        
        if (currentSession?.user?.id) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }

          console.log('User data after sign in:', userData);
          
          if (userData) {
            console.log('Existing user - redirecting to homepage');
            toast({
              title: "Welcome back!",
              description: "You have successfully logged in.",
            });
            navigate('/');
          } else {
            console.log('New user - redirecting to pricing');
            navigate('/pricing');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        toast({
          title: "Signed out",
          description: "You have been logged out successfully",
        });
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (!isInitialized) {
    return <LoadingSpinner message="Initializing session..." />;
  }

  return null;
};