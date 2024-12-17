import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';

export const SessionHandler = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isSubscribed = true;
    
    const checkSession = async () => {
      try {
        console.log('Checking session state...');
        
        // Get current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        console.log('Current session:', currentSession?.user?.email);
        
        if (!currentSession?.user?.id) {
          console.log('No active session found');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
          setIsLoading(false);
          return;
        }

        if (!isSubscribed) return;

        // Verify user data exists
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          toast({
            title: "Error",
            description: "Er is een probleem opgetreden bij het ophalen van je gegevens.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (!isSubscribed) return;

        // Handle successful login redirect
        if (location.pathname === '/login' && userData) {
          navigate('/');
          toast({
            title: "Welkom terug!",
            description: "Je bent succesvol ingelogd.",
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        setIsLoading(false);
        
        // Clear session on error
        await supabase.auth.signOut();
        
        if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
          navigate('/login');
        }
        
        toast({
          title: "Sessie verlopen",
          description: "Je sessie is verlopen. Log opnieuw in.",
          variant: "destructive",
        });
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setIsLoading(true);

      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
        await checkSession();
        navigate('/');
        toast({
          title: "Welkom!",
          description: "Je bent succesvol ingelogd.",
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsLoading(false);
        navigate('/');
        toast({
          title: "Tot ziens!",
          description: "Je bent succesvol uitgelogd.",
        });
      }
    });

    // Initial session check
    checkSession();

    return () => {
      console.log('Cleaning up auth subscriptions');
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [supabase, navigate, location.pathname, toast]);

  if (isLoading) {
    return <LoadingSpinner message="Even geduld..." />;
  }

  return null;
};