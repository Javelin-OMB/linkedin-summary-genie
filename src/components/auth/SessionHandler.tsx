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
    let isSubscribed = true;
    
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession?.user?.id) {
          console.log('No session found in SessionHandler');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
            toast({
              title: "Authentication required",
              description: "Please log in to access this page",
              variant: "destructive",
            });
          }
          return;
        }

        if (!isSubscribed) return;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          return;
        }

        if (!isSubscribed) return;
        setIsInitialized(true);

        if (location.pathname === '/login') {
          navigate('/dashboard');
          toast({
            title: "Welcome back!",
            description: "You've been successfully logged in.",
          });
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
        // Clear any stored session data
        localStorage.removeItem('supabase.auth.token');
        navigate('/');
        toast({
          title: "Signed out",
          description: "You've been successfully logged out.",
        });
      }
    });

    return () => {
      console.log('Cleaning up auth subscriptions');
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [supabase, navigate, location.pathname, toast]);

  return null;
};