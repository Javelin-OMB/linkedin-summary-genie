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
    let timeoutId: NodeJS.Timeout;
    
    const checkSession = async () => {
      try {
        console.log('Checking session state...');
        
        // Set a timeout to show error if session check takes too long
        timeoutId = setTimeout(() => {
          if (isLoading && isSubscribed) {
            setIsLoading(false);
            toast({
              title: "Timeout",
              description: "Het laden van de sessie duurt te lang. Probeer de pagina te verversen.",
              variant: "destructive",
            });
          }
        }, 10000); // 10 second timeout

        // Get current session with error handling
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        console.log('Current session:', currentSession?.user?.email);
        
        // Check if session exists
        if (!currentSession?.user?.id) {
          console.log('No active session found');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
          setIsLoading(false);
          return;
        }

        if (!isSubscribed) return;

        // Verify user data exists with optimized query
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email')  // Only select needed fields
          .eq('id', currentSession.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          throw userError;
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
        if (!isSubscribed) return;
        
        setIsLoading(false);
        await supabase.auth.signOut();
        
        if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
          navigate('/login');
        }
        
        toast({
          title: "Sessie fout",
          description: "Er is een probleem met je sessie. Probeer opnieuw in te loggen.",
          variant: "destructive",
        });
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Set up auth state change listener with timeout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
        await checkSession();
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
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase, navigate, location.pathname, toast, isLoading]);

  if (isLoading) {
    return <LoadingSpinner message="Even geduld..." />;
  }

  return null;
};