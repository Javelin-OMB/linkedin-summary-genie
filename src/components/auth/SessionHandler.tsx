import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

export const SessionHandler = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Initializing auth state...');
    
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.log('User signed in:', currentSession.user?.email);
          
          // Check if user exists in our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }

          setIsInitialized(true);
          
          // Only redirect if we're on the login page
          if (location.pathname === '/login') {
            navigate('/dashboard');
            toast({
              title: "Welcome back!",
              description: "You've been successfully logged in.",
            });
          }
        } else {
          console.log('No active session found');
          if (location.pathname !== '/login' && 
              location.pathname !== '/' && 
              location.pathname !== '/about' && 
              location.pathname !== '/pricing') {
            console.log('No session, redirecting to login');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        toast({
          title: "Error",
          description: "There was a problem checking your session.",
          variant: "destructive",
        });
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully:', session?.user?.email);
        setIsInitialized(true);
        navigate('/dashboard');
        toast({
          title: "Welcome!",
          description: "You've been successfully logged in.",
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsInitialized(false);
        navigate('/login');
        toast({
          title: "Signed out",
          description: "You've been successfully logged out.",
        });
      }
    });

    return () => {
      console.log('Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [supabase, navigate, location.pathname, toast]);

  return null;
};